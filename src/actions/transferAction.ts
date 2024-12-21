import {
    Action,
    ActionExample,
    IAgentRuntime,
    Memory,
    State,
    HandlerCallback,
    composeContext,
    generateObject,
    ModelClass
} from '@ai16z/eliza';
import { TRANSFER_TEMPLATE } from '../utils/template';
import { TransferParams, ApiResponse, VaultBalance } from '../types';
import { EmblemProvider } from '../providers/emblemProvider';

export const transferAction: Action = {
    name: 'solana_transfer',
    description: 'Transfer SOL or SPL tokens from an EmblemVault',
    similes: [
        'send SOL to an address',
        'transfer SPL tokens',
        'send tokens from vault'
    ],
    examples: [
        [
            {
            user: 'user1',
            content: {
                text: 'Transfer 1 SOL from vault v123 to address abc...'
            }
            }
        ]
    ] as ActionExample[][],
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<any> => {
        const provider = runtime.getProvider('emblemvault') as EmblemProvider;
        const api = provider.getApi();
    
        const transferContext = composeContext({
            state,
            template: TRANSFER_TEMPLATE,
        });
    
        const params = await generateObject({
            runtime,
            context: transferContext,
            modelClass: ModelClass.LARGE,
        });
    
        if (!params.vault_id || !params.to_address || !params.amount) {
            const responseMsg = {
            text: 'Missing required parameters for transfer',
            };
            callback?.(responseMsg);
            return false;
        }
    
        try {
            const result = await api.post<VaultBalance>('/v1/solana/transfer', params);
            const responseMsg = {
            text: `Transfer completed successfully! Transaction ID: ${result.data.vault_id}`,
            };
            callback?.(responseMsg);
            return true;
        } catch (error) {
            const responseMsg = {
            text: `Error during transfer: ${error instanceof Error ? error.message : String(error)}`,
            };
            callback?.(responseMsg);
            return false;
        }
    }
};
