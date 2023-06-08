// Setup dotenv before doing anything else
import * as dotenv from "dotenv";
// Load the config from .env
dotenv.config();

import {ConvoStackBackendExpress} from "convostack/backend-express";
import express from "express";
import {StorageEnginePrismaSQLite} from "convostack/storage-engine-prisma-sqlite";
import {StorageEnginePrismaPostgres} from "convostack/storage-engine-prisma-postgres";
import {StorageEnginePrismaMySQL} from "convostack/storage-engine-prisma-mysql";
import {IStorageEngine, IConversationEventServiceOptions} from "convostack/models"
import cors, {CorsOptions} from "cors";
import {AuthJWT} from "convostack/auth-jwt";
import {createServer} from "http";
import {RedisPubSub} from "graphql-redis-subscriptions";
import path from "path";
import {serveStaticReactAppHandler} from "./utils/static";
import {agents, defaultAgentKey, PlaygroundAgentManager} from "./agents";
import {createRedisInstance} from "./utils/redis";

// Start configuring the server
console.log("Configuring server...");
const port = process.env.PORT || "3000";
const host = process.env.HOST || "localhost";
const origins = process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(',') : "*"

// CORS setup is important to make sure that browsers don't block our clients' ConvoStack API requests
const corsOptions: CorsOptions = {
    origin: origins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
};

const main = async () => {
    // Create an Express app for our endpoints, playground client, and ConvoStack
    const app = express();

    // Setup CORS middleware app-wide
    app.use(cors(corsOptions));

    // Let the client get a list of the agents that are currently available
    app.get('/api/agents', (req, res) => {
        res.json(Object.keys(agents).map(agentKey => {
            return {
                ...agents[agentKey].metadata,
                key: agentKey,
                isDefault: agentKey === defaultAgentKey
            }
        }));
    });

    // Create an HTTP server to host our Express app
    const httpServer = createServer(app);

    // Select and init a storage backend depending on the configuration
    let storage: IStorageEngine;
    switch (process.env.STORAGE_ENGINE) {
        case 'sqlite':
            storage = new StorageEnginePrismaSQLite(process.env.DATABASE_URL);
            await (storage as StorageEnginePrismaSQLite).init();
            break;
        case 'postgres':
            storage = new StorageEnginePrismaPostgres(process.env.DATABASE_URL);
            await (storage as StorageEnginePrismaPostgres).init();
            break;
        case 'mysql':
            storage = new StorageEnginePrismaMySQL(process.env.DATABASE_URL);
            await (storage as StorageEnginePrismaMySQL).init();
            break;
        default:
            throw new Error(`Invalid storage engine: ${process.env.STORAGE_ENGINE}`)
    }

    // Setup Redis-based caching and pub/sub if we set the REDIS_URL env var
    const convEventsOpts = {} as IConversationEventServiceOptions;
    if (process.env.REDIS_URL) {
        convEventsOpts.pubSubEngine = new RedisPubSub({
            subscriber: createRedisInstance(process.env.REDIS_URL),
            publisher: createRedisInstance(process.env.REDIS_URL),
            connectionListener: (err) => {
                console.error(`Redis pub/sub engine error: ${err}`);
            }
        });
        convEventsOpts.cache = createRedisInstance(process.env.REDIS_URL);
    }

    // Setup the ConvoStack backend
    const backend = new ConvoStackBackendExpress({
        storage,
        auth: new AuthJWT(storage, {
            jwtSecret: process.env.JWT_SECRET,
            userDataVerificationSecret: process.env.USER_VERIFICATION_HASH_SECRET,
            allowAnonUsers: process.env.ALLOW_ANONYMOUS_USERS == "true",
            requireUserVerificationHash: !(
                process.env.REQUIRE_USER_VERIFICATION_HASH == "false"
            )
        }),
        agents: new PlaygroundAgentManager(agents, defaultAgentKey),
        conversationEventServiceOptions: convEventsOpts,
    });

    // Initialize ConvoStack by connecting it to your Express App and HTTP server
    await backend.init(app, httpServer, {
        introspection: process.env.ENABLE_GQL_INTROSPECTION == "true",
    });

    // Used for serving the React frontend app when bundled in production (see: Dockerfile)
    if (process.env.NODE_ENV === 'production') {
        app.use(serveStaticReactAppHandler(path.join(__dirname, '../dist-fe', 'index.html')));
        app.use(express.static(path.join(__dirname, '../dist-fe')));
    }

    // Start the HTTP server on your port and host combination
    console.log(`Starting server on port ${port}...`);
    httpServer.listen(parseInt(port), host, () => {
        console.log(`Server is running on http://${host}:${port}/graphql`);
    });
};

try {
    main();
} catch (err) {
    console.error(err);
}