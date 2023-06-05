import {IDefaultAgentManagerAgentsConfig} from "convostack/agent";
import {LangchainChat} from "./langchain-chat";
import {AgentEcho} from "convostack/agent-echo";
import {LangchainConversationalRetrievalQA} from "./langchain-conversational-retrieval-qa";
import {LangchainPineconeChatQA} from "./langchain-pinecone-chat-qa";

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