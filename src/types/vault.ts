export interface VaultBalance {
    vault_id: string;
    solana_address: string;
    balance: number;
    token_balance?: TokenBalance[];
}

export interface TokenBalance {
    mint: string;
    amount: string;
    decimals: number;
}

export interface TransferParams {
    vault_id: string;
    to_address: string;
    amount: number;
    mint?: string;
}

export interface SwapParams {
    vault_id: string;
    input_mint: string;
    output_mint: string;
    amount: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
}
