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
import { SWAP_TEMPLATE } from '../utils/template';
import { SwapParams, ApiResponse, VaultBalance } from '../types';
import { EmblemProvider } from '../providers/emblemProvider';

export const swapAction: Action = {
    name: 'solana_swap',
    description: 'Swap tokens within an EmblemVault on Solana',
    similes: [
        'exchange tokens in vault',
        'swap SPL tokens',
        'convert tokens in vault'
    ],
    examples: [
        [
            {
            user: 'user1',
            content: {
                text: 'Swap 1 SOL for USDC in vault v123'
            }
            }
        ],
        [
            {
            user: 'user2',
            content: {
                text: 'Exchange 10 USDC for SOL in vault v456'
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

        const swapContext = composeContext({
            state,
            template: SWAP_TEMPLATE,
        });

        const params = await generateObject({
            runtime,
            context: swapContext,
            modelClass: ModelClass.LARGE,
        });

        if (!params.vault_id || !params.input_mint || !params.output_mint || !params.amount) {
            const responseMsg = {
            text: 'Missing required parameters for swap',
            };
            callback?.(responseMsg);
            return false;
        }

        try {
            const result = await api.post<VaultBalance>('/v1/solana/swap', params);
            const responseMsg = {
            text: `Swap completed successfully! New balance: ${result.data.balance} ${params.output_mint}`,
            };
            callback?.(responseMsg);
            return true;
        } catch (error) {
            const responseMsg = {
            text: `Error during swap: ${error instanceof Error ? error.message : String(error)}`,
            };
            callback?.(responseMsg);
            return false;
        }
    }
};
