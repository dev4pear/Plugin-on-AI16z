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
import { VaultBalance } from '../types';
import { EmblemProvider } from '../providers/emblemProvider';

const BALANCE_TEMPLATE = `
Extract the vault ID from the request:
- vault_id: The vault ID to check balance

\`\`\`json
{
    "vault_id": string | null
}
\`\`\`
`;

export const balanceAction: Action = {
    name: 'solana_balance',
    description: 'Check SOL and SPL token balances in an EmblemVault',
    similes: [
        'check vault balance',
        'get token balance',
        'view vault holdings'
    ],
    examples: [
        [
            {
            user: 'user1',
            content: {
                text: 'Check balance of vault v123'
            }
            }
        ],
        [
            {
            user: 'user2',
            content: {
                text: 'Show me holdings in vault v456'
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
    
        const balanceContext = composeContext({
            state,
            template: BALANCE_TEMPLATE,
        });
    
        const params = await generateObject({
            runtime,
            context: balanceContext,
            modelClass: ModelClass.LARGE,
        });
    
        if (!params.vault_id) {
            const responseMsg = {
            text: 'Missing vault ID for balance check',
            };
            callback?.(responseMsg);
            return false;
        }
    
        try {
            const result = await api.get<VaultBalance>(`/v1/solana/balance/${params.vault_id}`);
            
            let balanceText = `Vault ${params.vault_id} balances:\n`;
            balanceText += `SOL: ${result.data.balance}\n`;
            
            if (result.data.token_balance && result.data.token_balance.length > 0) {
            balanceText += 'SPL Tokens:\n';
            result.data.token_balance.forEach(token => {
                const amount = parseFloat(token.amount) / Math.pow(10, token.decimals);
                balanceText += `- ${amount} (${token.mint})\n`;
            });
            }
    
            const responseMsg = {
            text: balanceText,
            };
            callback?.(responseMsg);
            return true;
        } catch (error) {
            const responseMsg = {
            text: `Error checking balance: ${error instanceof Error ? error.message : String(error)}`,
            };
            callback?.(responseMsg);
            return false;
        }
    }
};
  