import {
    EmblemApi,
    EmblemVaultProvider,
    TransferSolAction,
    TransferSplAction,
    SwapAction
} from '../src';

async function main() {
    const config = {
        apiKey: 'your-api-key',
        endpoint: 'https://api.emblemvault.ai'
    };

    // Initialize core services
    const api = new EmblemApi(config);
    const vaultProvider = new EmblemVaultProvider(config);

    // Create vault
    const vaultId = await vaultProvider.createVault({
        name: 'My Trading Vault',
        description: 'Vault for trading operations'
    });

    // Initialize actions
    const transferSol = new TransferSolAction(api, vaultProvider);
    const transferSpl = new TransferSplAction(api, vaultProvider);
    const swap = new SwapAction(api, vaultProvider);

    // Execute operations
    const transferResult = await transferSol.execute({
        recipient: 'RECIPIENT_ADDRESS',
        amount: 1.0
    });

    console.log('Transfer result:', transferResult);
}

main().catch(console.error);