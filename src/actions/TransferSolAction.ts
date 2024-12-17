import { BaseAction } from './BaseAction';
import { TransferSolParams, TransactionResponse, ActionResponse } from '../types';
import { isValidSolanaAddress, parseTokenAmount } from '../utils/validators';
import { API_ENDPOINTS } from '../utils/constants';

export class TransferSolAction extends BaseAction<TransferSolParams, ActionResponse<TransactionResponse>> {
  async execute(params: TransferSolParams): Promise<ActionResponse<TransactionResponse>> {
    try {
      const { recipient, amount } = params;

      if (!isValidSolanaAddress(recipient)) {
        throw new Error('Invalid recipient address');
      }

      if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      const vaultId = await this.vaultProvider.getVault();
      const formattedAmount = parseTokenAmount(amount);

      const response = await this.api.request<TransactionResponse>(
        API_ENDPOINTS.TRANSFER,
        {
          method: 'POST',
          body: JSON.stringify({
            vaultId,
            recipient,
            amount: formattedAmount,
            token: 'SOL'
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