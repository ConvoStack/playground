import {IAgent, IAgentCallbacks, IAgentContext, IAgentResponse} from "convostack/agent";
import {BufferMemory} from "langchain/memory";
import {ConvoStackLangchainChatMessageHistory} from "convostack/langchain-memory";
import {OPENAI_API_KEY_NOT_SET_MESSAGE} from "../utils/errors";
import {OpenAI} from "langchain/llms/openai";
import {ConversationalRetrievalQAChain} from "langchain/chains";
import {HNSWLib} from "langchain/vectorstores/hnswlib";
import {OpenAIEmbeddings} from "langchain/embeddings/openai";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import * as fs from "fs";

export class LangchainConversationalRetrievalQA implements IAgent {
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

        /* Initialize the LLM to use to answer the question */
        const model = new OpenAI({
            modelName: 'gpt-3.5-turbo', // Optionally, try using gpt-4 if you have access
            temperature: 0,
            streaming: true,
            callbacks: [
                {
                    handleLLMNewToken(token: string) {
                        // TODO only stream the answer (not the internal question)
                        callbacks.onMessagePart({
                            contentChunk: token
                        });
                    },
                },
            ],
        });
        /* Load in the file we want to do question answering over */
        const text = fs.readFileSync("./datasets/state_of_the_union.txt", "utf8");
        /* Split the text into chunks */
        const textSplitter = new RecursiveCharacterTextSplitter({chunkSize: 1000});
        const docs = await textSplitter.createDocuments([text]);
        /* Create the vectorstore */
        const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
        /* Create the chain */
        const chain = ConversationalRetrievalQAChain.fromLLM(
            model,
            vectorStore.asRetriever()
        );
        chain.memory = new BufferMemory({
            chatHistory: new ConvoStackLangchainChatMessageHistory({
                history: context.getHistory()
            }),
            returnMessages: true,
            memoryKey: "chat_history",
            inputKey: "question"
        });

        const resp = await chain.call({
            question: context.getHumanMessage().content,
        });

        return {
            content: resp.text,
            contentType: "markdown"
        };
    }
}
