// Setup dotenv before doing anything else
import * as dotenv from "dotenv";

dotenv.config();

import {ConvoStackBackendExpress, IConversationEventServiceOptions} from "convostack/backend-express";
import express from "express";
import {StorageEnginePrismaSQLite} from "convostack/storage-engine-prisma-sqlite";
import {StorageEnginePrismaPostgres} from "convostack/storage-engine-prisma-postgres";
import {StorageEnginePrismaMySQL} from "convostack/storage-engine-prisma-mysql";
import {IStorageEngine} from "convostack/models"
import cors, {CorsOptions} from "cors";
import {AuthJWT} from "convostack/auth-jwt";
import {createServer} from "http";
import {DefaultAgentManager, IDefaultAgentManagerAgentsConfig} from "convostack/agent";
import {AgentEcho} from "convostack/agent-echo";
import {LangchainChat} from "./langchain-chat";
import {RedisPubSub} from "graphql-redis-subscriptions";
import Redis, {RedisOptions} from "ioredis";
import path from "path";

const port = process.env.PORT || "3000";
const host = process.env.HOST || "localhost";
const origins = process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(',') : ["http://localhost:5173", "https://studio.apollographql.com"]
console.log("Configuring server...");

const corsOptions: CorsOptions = {
    origin: origins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
};

const defaultAgentKey = "default";
const agents: { [key: string]: IDefaultAgentManagerAgentsConfig } = {
    "default": {
        agent: new AgentEcho(),
        metadata: {
            displayName: "Echo Agent",
            primer: "This is demo echo agent. Write me a message, and I will stream it back to you! P.S., Set the OPENAI_API_KEY environment variable to power up to the OpenAI langchain chat demo!"
        }
    }
};

// If the OPENAI_API_KEY environment variable is set, power up to the GPT langchain demo!
if (process.env.OPENAI_API_KEY) {
    agents["default"] = {
        agent: new LangchainChat(),
        metadata: {
            displayName: "OpenAI Chat",
            primer: "I am an OpenAI-powered Langchain chat assistant. Write me a message, and I will do my best!"
        }
    }
}

const main = async () => {
    const app = express();
    // Setup CORS middleware app-wide
    app.use(cors(corsOptions));

    // Let the client get a list of the agents that are currently available
    app.get('/api/agents', (req, res) => {
        res.json(Object.keys(agents).map(agentKey => {
            return {
                ...agents[agentKey].metadata,
                isDefault: agentKey === defaultAgentKey
            }
        }));
    });

    const httpServer = createServer(app);
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
    const convEventsOpts = {} as IConversationEventServiceOptions;
    if (process.env.REDIS_URL) {
        convEventsOpts.pubSubEngine = new RedisPubSub({
            connection: process.env.REDIS_URL
        });
        convEventsOpts.cache = new Redis(process.env.REDIS_URL);
    }

    const backend = new ConvoStackBackendExpress({
        basePath: "/",
        storage,
        auth: new AuthJWT(storage, {
            jwtSecret: process.env.JWT_SECRET,
            userDataVerificationSecret: process.env.USER_VERIFICATION_HASH_SECRET,
            allowAnonUsers: process.env.ALLOW_ANONYMOUS_USERS == "true",
            requireUserVerificationHash: !(
                process.env.REQUIRE_USER_VERIFICATION_HASH == "false"
            )
        }),
        agents: new DefaultAgentManager(agents, defaultAgentKey),
        conversationEventServiceOptions: convEventsOpts,
    });

    await backend.init(app, httpServer);

    // Used for serving the React frontend app when bundled in production (see: Dockerfile)
    if (process.env.NODE_ENV === 'production') {
        // This code makes sure that any request that does not matches a static file
        // in the build folder, will just serve index.html. Client side routing is
        // going to make sure that the correct content will be loaded.
        app.use((req, res, next) => {
            if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
                next();
            } else {
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                res.sendFile(path.join(__dirname, '../dist-fe', 'index.html'));
            }
        });
        app.use(express.static(path.join(__dirname, '../dist-fe')));
    }

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