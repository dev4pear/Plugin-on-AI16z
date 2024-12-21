import { TransferParams, SwapParams } from '../types';
import { ERROR_MESSAGES } from './constants';

export function isValidSolanaAddress(address: string): boolean {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

export function validateTransferParams(params: TransferParams): string | null {
    if (!params.vault_id) {
        return ERROR_MESSAGES.INVALID_VAULT_ID;
    }
    if (!isValidSolanaAddress(params.to_address)) {
        return ERROR_MESSAGES.INVALID_ADDRESS;
    }
    if (params.amount <= 0) {
        return 'Amount must be greater than 0';
    }
    return null;
}

export function validateSwapParams(params: SwapParams): string | null {
    if (!params.vault_id) {
        return ERROR_MESSAGES.INVALID_VAULT_ID;
    }
    if (!params.input_mint || !params.output_mint) {
        return 'Invalid token mint addresses';
    }
    if (params.amount <= 0) {
        return 'Amount must be greater than 0';
    }
    return null;
}
