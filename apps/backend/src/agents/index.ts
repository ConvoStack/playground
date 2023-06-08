import {IAgent, IDefaultAgentManagerAgentsConfig} from "convostack/agent";
import {LangchainChat} from "./langchain-chat";
import {AgentEcho} from "convostack/agent-echo";
import {LangchainConversationalRetrievalQA} from "./langchain-conversational-retrieval-qa";
import {LangchainPineconeChatQA} from "./langchain-pinecone-chat-qa";
import {IAgentManager} from "convostack/agent";
import {AgentHTTPClient} from 'convostack/agent-http'

// This is the default agent key that will be used for new conversations in ConvoStack.
// If a client specifies an agent key on their own, it will override this default.
export const defaultAgentKey = "default";

// Create a map of our agent configurations for use with the ConvoStack DefaultAgentManager in ../server.ts
export const agents: { [key: string]: IDefaultAgentManagerAgentsConfig } = {
    "default": {
        agent: new LangchainChat(),
        metadata: {
            displayName: "OpenAI Chat",
            primer: "I am an OpenAI-powered Langchain chat assistant. Write me a message, and I will do my best!"
        }
    },
    "echo-agent": {
        agent: new AgentEcho(),
        metadata: {
            displayName: "Echo Agent",
            primer: "This is demo echo agent. Write me a message, and I will stream it back to you! P.S., Set the OPENAI_API_KEY environment variable to power up to the OpenAI langchain chat demo!"
        }
    },
    "langchain-conversational-retrieval-qa": {
        agent: new LangchainConversationalRetrievalQA(),
        metadata: {
            displayName: "OpenAI Conversational QA",
            primer: "I am an OpenAI-powered Langchain Conversational Retriever QA Chain. Ask me questions about the state of the union document."
        }
    },
    "langchain-pinecone-chat-qa": {
        agent: new LangchainPineconeChatQA("convostack-docs"),
        metadata: {
            displayName: "ConvoStack Docs Agent",
            primer: "I am an OpenAI and Pinecone-powered Langchain QA Chain. Ask me anything about the ConvoStack docs."
        }
    },
};

export type PlaygroundAgentManagerAgentsConfig = IDefaultAgentManagerAgentsConfig

export class PlaygroundAgentManager implements IAgentManager {
    private readonly proxyUrl = process.env.PLAYGROUND_PROXY_CLIENT_URL || 'https://playground-proxy.convostack.ai/client';
    private readonly proxyAgentPrefix = 'pxy::';
    private agents: {
        [key: string]: PlaygroundAgentManagerAgentsConfig
    };
    private defaultAgentKey: string;

    constructor(agents: {
        [key: string]: PlaygroundAgentManagerAgentsConfig
    }, defaultAgentKey: string) {
        if (Object.keys(agents).length === 0) {
            throw new Error("No agents provided");
        }
        if (!defaultAgentKey || !agents[defaultAgentKey]) {
            throw new Error(`Default agent key '${defaultAgentKey}' is not provided or not found in available agents`);
        }
        for (const key in agents) {
            if (!key) {
                throw new Error("Agent key cannot be an empty string");
            }
        }
        this.agents = agents;
        this.defaultAgentKey = defaultAgentKey;
    }

    getDefaultAgentKey(): string {
        return this.defaultAgentKey;
    }

    getDefaultAgent(): IAgent {
        return this.agents[this.defaultAgentKey].agent;
    }

    getProxyAgent(key: string) {
        const agentId = key.substring(this.proxyAgentPrefix.length)
        const url = `${this.proxyUrl}?agentId=${encodeURIComponent(agentId)}`;
        return new AgentHTTPClient(url);
    }

    getAgent(key: string): IAgent {
        if (key.startsWith(this.proxyAgentPrefix)) {
            return this.getProxyAgent(key);
        }
        const agent = this.agents[key];
        if (!agent) {
            throw new Error(`Agent with key '${key}' not found`);
        }
        return agent.agent;
    }

    getAgentDisplayName(key: string): string {
        if (key.startsWith(this.proxyAgentPrefix)) {
            return "ConvoStack Dev Agent";
        }
        return this.agents[key].metadata.displayName;
    }

    getAgentPrimer(key: string): string {
        if (key.startsWith(this.proxyAgentPrefix)) {
            return "This is your agent running live on ConvoStack. Write me a message, and I will respond! Feel free to give ConvoStack a ⭐️ to support open-source AI projects: [https://github.com/ConvoStack/convostack](https://github.com/ConvoStack/convostack)";
        }
        return this.agents[key].metadata.primer;
    }

    getAgentHumanRole(key: string): string {
        // TODO consider allowing customization of the Human role string
        return "Human";
    }

    getAgentAIRole(key: string): string {
        // TODO consider allowing customization of the AI role string
        return "AI";
    }

    listAvailableAgents(): string[] {
        return Object.keys(this.agents);
    }

    getAgentAvatarUrl(key: string): string | null {
        if (key.startsWith(this.proxyAgentPrefix)) {
            return null;
        }
        return this.agents[key].metadata.avatarUrl;
    }
}