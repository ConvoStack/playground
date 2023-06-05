// Setup dotenv before doing anything else
import * as dotenv from "dotenv";

dotenv.config();

import {crawl} from "../src/agents/langchain-pinecone-chat-qa/crawl";
import yargs from 'yargs';
import prompt from 'prompt';

async function main(urls, crawlLimit, shouldSummarize, agentName) {
    console.log("Starting to load docs into Pinecone");
    await crawl(urls, crawlLimit, shouldSummarize, agentName);
    console.log("Successfully finished loading docs into Pinecone")
}

prompt.start();

yargs
    .command({
        command: 'crawl',
        describe: 'Crawl websites',
        builder: {
            urls: {
                describe: 'Website urls to crawl',
                demandOption: true,
                type: 'array',
            },
            crawlLimit: {
                describe: 'Crawl limit',
                demandOption: false,
                default: 100,
                type: 'number',
            },
            shouldSummarize: {
                describe: 'Should summarize',
                demandOption: false,
                default: true,
                type: 'boolean',
            },
            agentName: {
                describe: 'Name of agent',
                demandOption: true,
                type: 'string'
            }
        },
        async handler(argv) {
            await main(argv.urls, argv.crawlLimit, argv.shouldSummarize, argv.agentName);
        },
    })
    .help()
    .argv;
