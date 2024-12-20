// src/types/index.ts
export interface EmblemConfig {
    apiKey: string;
    endpoint: string;
}

export interface VaultConfig {
    name?: string;
    description?: string;
}

export interface VaultProvider {
    getVault(): Promise<string>;
    createVault(config?: VaultConfig): Promise<string>;
    deleteVault(vaultId?: string): Promise<boolean>;
    listVaults(): Promise<string[]>;
    selectVault(vaultId: string): Promise<void>;
}
export interface TransferSolParams {
    recipient: string;
    amount: number;
}

export interface TransnodferSplParams {
    recipient: string;
    amount: number;
    tokenMint: string;
}

export interface SwapParams {
    inputMint: string;
    outputMint: string;
    amount: number;
    slippage?: number;
}

export interface TransactionResponse {
    signature: string;
    status: 'success' | 'pending' | 'failed';
    timestamp: number;
}

export interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
