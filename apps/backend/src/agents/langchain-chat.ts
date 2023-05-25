import { IAgent, IAgentCallbacks, IAgentContext, IAgentResponse } from "convostack/agent";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    ChatPromptTemplate, MessagesPlaceholder,
} from "langchain/prompts";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { ConvoStackLangchainChatMessageHistory } from "convostack/langchain-memory";
import {OPENAI_API_KEY_NOT_SET_MESSAGE} from "../utils/errors";

export class LangchainChat implements IAgent {
    async reply(
        context: IAgentContext,
        callbacks?: IAgentCallbacks
    ): Promise<IAgentResponse> {
        if (!process.env.OPENAI_API_KEY) {
            return {
                content: OPENAI_API_KEY_NOT_SET_MESSAGE,
                contentType: "markdown"
            }
        }

        const chat = new ChatOpenAI({
            modelName: 'gpt-3.5-turbo', // Optionally, try using gpt-4 if you have access
            temperature: 0,
            streaming: true,
            callbacks: [
                {
                    handleLLMNewToken(token: string) {
                        callbacks.onMessagePart({
                            contentChunk: token
                        });
                    },
                },
            ],
        });

        const chatPrompt = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(
                "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know."
            ),
            new MessagesPlaceholder("history"),
            HumanMessagePromptTemplate.fromTemplate("{input}"),
        ]);

        const chain = new ConversationChain({
            memory: new BufferMemory({
                chatHistory: new ConvoStackLangchainChatMessageHistory({
                    history: context.getHistory()
                }),
                returnMessages: true,
                memoryKey: "history",
            }),
            prompt: chatPrompt,
            llm: chat,
        });

        const resp = await chain.call({
            input: context.getHumanMessage().content,
        });

        return {
            content: resp.response,
            contentType: "markdown"
        };
    }
}

