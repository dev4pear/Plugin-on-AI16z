export const EMBLEM_API_BASE_URL = 'https://api.emblemvault.ai';
export const API_VERSION = 'v1';
export const DEFAULT_DECIMALS = 9; // For SOL
export const TOKEN_PROGRAM_ID = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';

export const ERROR_MESSAGES = {
    MISSING_API_KEY: 'EMBLEM_API_KEY not configured',
    INVALID_VAULT_ID: 'Invalid vault ID provided',
    INSUFFICIENT_BALANCE: 'Insufficient balance for operation',
    INVALID_ADDRESS: 'Invalid Solana address provided',
    NETWORK_ERROR: 'Network error occurred while connecting to EmblemVault',
};

export const SUCCESS_MESSAGES = {
    TRANSFER_COMPLETE: 'Transfer completed successfully!',
    SWAP_COMPLETE: 'Swap completed successfully!',
    BALANCE_FETCHED: 'Balance fetched successfully!',
};
