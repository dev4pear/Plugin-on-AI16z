// src/test/run.ts
import TestAgent from './TestAgent';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const API_KEY = process.env.EMBLEM_API_KEY || '';
const TEST_WALLET = process.env.TEST_WALLET_ADDRESS || '';

if (!API_KEY || !TEST_WALLET) {
    console.error('Please set EMBLEM_API_KEY and TEST_WALLET_ADDRESS in .env file');
    process.exit(1);
}

const agent = new TestAgent(API_KEY, undefined, TEST_WALLET);
agent.runAllTests().catch(console.error);
