import { BaseAction } from './BaseAction';
import { SwapParams, TransactionResponse, ActionResponse } from '../types';
import { isValidSolanaAddress, parseTokenAmount } from '../utils/validators';
import { API_ENDPOINTS } from '../utils/constants';

export class SwapAction extends BaseAction<SwapParams, ActionResponse<TransactionResponse>> {
  async execute(params: SwapParams): Promise<ActionResponse<TransactionResponse>> {
    try {
      const { inputMint, outputMint, amount, slippage = 1 } = params;

      if (!isValidSolanaAddress(inputMint) || !isValidSolanaAddress(outputMint)) {
        throw new Error('Invalid token mint address');
      }

      if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      const vaultId = await this.vaultProvider.getVault();
      const formattedAmount = parseTokenAmount(amount);

      const response = await this.api.request<TransactionResponse>(
        API_ENDPOINTS.SWAP,
        {
          method: 'POST',
          body: JSON.stringify({
            vaultId,
            inputMint,
            outputMint,
            amount: formattedAmount,
            slippage
          })
        }
      );

      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}