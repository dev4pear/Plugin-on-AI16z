import dotenv from 'dotenv';
dotenv.config();

export interface EmblemConfig {
    apiKey: string;
    apiUrl: string;
    environment: 'mainnet' | 'devnet';
}

export const DEFAULT_CONFIG: EmblemConfig = {
    apiKey: process.env.EMBLEM_API_KEY || '',
    apiUrl: process.env.EMBLEM_API_URL || 'https://api.emblemvault.ai',
    environment: (process.env.EMBLEM_ENVIRONMENT || 'mainnet') as 'mainnet' | 'devnet'
}; 