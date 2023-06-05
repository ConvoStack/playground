import {PineconeClient} from "@pinecone-database/pinecone";
import {CallbackManager} from "langchain/callbacks";
import {LLMChain} from "langchain/chains";
import {ChatOpenAI} from "langchain/chat_models/openai";
import {OpenAIEmbeddings} from 'langchain/embeddings/openai';
import {OpenAI} from "langchain/llms/openai";
import {PromptTemplate} from "langchain/prompts";
import {summarizeLongDocument} from './summarizer';
import {Metadata, getMatchesFromEmbeddings} from './matches';
import {templates} from './templates';
import {IAgent, IAgentCallbacks, IAgentContext, IAgentResponse} from "convostack/agent";
import {PINECONE_API_KEY_NOT_SET_MESSAGE} from "../../utils/errors";
import {BufferMemory} from "langchain/memory";
import {ConvoStackLangchainChatMessageHistory} from "convostack/langchain-memory";

/**
 * Adapted from https://github.com/pinecone-io/chatbot-demo
 */
export class LangchainPineconeChatQA implements IAgent {
    private agentName: string;

    constructor(agentName: string) {
        this.agentName = agentName;
    }

    pinecone: PineconeClient | null = null

    async initPineconeClient() {
        this.pinecone = new PineconeClient();
        await this.pinecone.init({
            environment: process.env.PINECONE_ENVIRONMENT!,
            apiKey: process.env.PINECONE_API_KEY!,
        });
    }

    async reply(
        context: IAgentContext,
        callbacks?: IAgentCallbacks
    ): Promise<IAgentResponse> {
        if (!process.env.OPENAI_API_KEY || !process.env.PINECONE_API_KEY) {
            return {
                content: PINECONE_API_KEY_NOT_SET_MESSAGE,
                contentType: "markdown"
            }
        }

        if (!this.pinecone) {
            await this.initPineconeClient();
        }

        let summarizedCount = 0;
        const llm = new OpenAI({});

        try {
            // Build an LLM chain that will improve the user prompt
            const inquiryChain = new LLMChain({
                llm,
                prompt: new PromptTemplate({
                    template: templates.inquiryTemplate,
                    inputVariables: ["userPrompt", "conversationHistory"],
                })
            });
            inquiryChain.memory = new BufferMemory({
                chatHistory: new ConvoStackLangchainChatMessageHistory({
                    history: context.getHistory()
                }),
                returnMessages: true,
                memoryKey: "conversationHistory",
                inputKey: "userPrompt"
            });
            const inquiryChainResult = await inquiryChain.call({
                userPrompt: context.getHumanMessage().content
            })
            const inquiry = inquiryChainResult.text

            console.log(inquiry)


            // Embed the user's intent and query the Pinecone index
            const embedder = new OpenAIEmbeddings({
                modelName: "text-embedding-ada-002"
            });


            const embeddings = await embedder.embedQuery(inquiry);
            console.log('Finding matches...')

            const matches = await getMatchesFromEmbeddings(embeddings, this.pinecone!, 2, this.agentName);


            const urls = matches && Array.from(new Set(matches.map(match => {
                const metadata = match.metadata as Metadata
                const {url} = metadata
                return url
            })))

            console.log(urls)


            const docs = matches && Array.from(
                matches.reduce((map, match) => {
                    const metadata = match.metadata as Metadata;
                    const {text, url} = metadata;
                    if (!map.has(url)) {
                        map.set(url, text);
                    }
                    return map;
                }, new Map())
            ).map(([_, text]) => text);


            const promptTemplate = new PromptTemplate({
                template: templates.qaTemplate,
                inputVariables: ["summaries", "question", "conversationHistory", "urls"],
            });


            const chat = new ChatOpenAI({
                streaming: true,
                verbose: true,
                modelName: "gpt-3.5-turbo",
                callbacks: CallbackManager.fromHandlers({
                    async handleLLMNewToken(token) {
                        callbacks.onMessagePart({
                            contentType: 'markdown',
                            contentChunk: token,
                        });
                    }
                }),
            });

            const chain = new LLMChain({
                prompt: promptTemplate,
                llm: chat,
            });
            chain.memory = new BufferMemory({
                chatHistory: new ConvoStackLangchainChatMessageHistory({
                    history: context.getHistory()
                }),
                returnMessages: true,
                memoryKey: "conversationHistory",
                inputKey: "question"
            });

            const allDocs = docs.join("\n")
            if (allDocs.length > 4000) {
                console.log("formalizing final answer")
            }

            const summary = allDocs.length > 4000 ? await summarizeLongDocument({document: allDocs, inquiry}) : allDocs

            const finalAnswer = await chain.call({
                summaries: summary,
                question: context.getHumanMessage().content,
                urls
            });
            console.log(finalAnswer);
            return {
                content: finalAnswer.text,
                contentType: 'markdown'
            }
        } catch (error) {
            console.error(error)
        }

    }
}
