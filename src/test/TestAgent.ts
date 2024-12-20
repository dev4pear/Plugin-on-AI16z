import { EmblemVaultProvider } from '../provider/VaultProvider';
import { 
    VaultProvider, 
    TransferSolParams,
    TransferSplParams,
    SwapParams,
    ActionResponse,
    TransactionResponse 
} from '../types';
  
class TestAgent {
    private vaultProvider: EmblemVaultProvider;
    private testWallet: string;
  
    constructor(
        apiKey: string, 
        endpoint: string = 'https://api.emblemvault.ai',
        testWallet: string // Your test wallet address
    ) {
        this.vaultProvider = new EmblemVaultProvider({ apiKey, endpoint });
        this.testWallet = testWallet;
    }
  
    async runAllTests() {
        console.log('🚀 Starting Test Suite...\n');
    
        try {
            // 1. Test Vault Operations
            await this.testVaultOperations();
    
            // 2. Test SOL Transfer
            await this.testSolTransfer();
    
            // 3. Test SPL Transfer
            await this.testSplTransfer();
    
            // 4. Test Swap
            await this.testSwap();
    
            console.log('\n✅ All tests completed successfully!');
        } catch (error) {
            console.error('\n❌ Test suite failed:', error);
        }
    }
  
    private async testVaultOperations() {
        console.log('📁 Testing Vault Operations...');
    
        try {
            // Create Vault
            const vaultId = await this.vaultProvider.createVault({
            name: 'Test Vault',
            description: 'Testing vault operations'
            });
            console.log('  ✓ Created vault:', vaultId);
    
            // List Vaults
            const vaults = await this.vaultProvider.listVaults();
            console.log('  ✓ Listed vaults:', vaults);
    
            // Select Vault
            await this.vaultProvider.selectVault(vaultId);
            console.log('  ✓ Selected vault:', vaultId);
    
            // Get Current Vault
            const currentVault = await this.vaultProvider.getVault();
            console.log('  ✓ Got current vault:', currentVault);
    
            // Delete Vault
            await this.vaultProvider.deleteVault(vaultId);
            console.log('  ✓ Deleted vault:', vaultId);
    
        } catch (error) {
            throw new Error(`Vault operations failed: ${error}`);
        }
    }
  
    private async testSolTransfer() {
        console.log('\n💸 Testing SOL Transfer...');
    
        try {
            // Create new vault for transfer test
            const vaultId = await this.vaultProvider.createVault({
            name: 'Transfer Test Vault'
            });
    
            const params: TransferSolParams = {
            recipient: this.testWallet,
            amount: 0.01 // Small amount for testing
            };
    
            // Execute transfer
            const result = await this.executeTransfer('sol', params);
            console.log('  ✓ SOL transfer result:', result);
    
            // Cleanup
            await this.vaultProvider.deleteVault(vaultId);
    
        } catch (error) {
            throw new Error(`SOL transfer failed: ${error}`);
        }
    }
  
    private async testSplTransfer() {
        console.log('\n🪙 Testing SPL Token Transfer...');
    
        try {
            const vaultId = await this.vaultProvider.createVault({
            name: 'SPL Test Vault'
            });
    
            const params: TransferSplParams = {
            recipient: this.testWallet,
            amount: 1,
            tokenMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' // USDC mint address
            };
    
            const result = await this.executeTransfer('spl', params);
            console.log('  ✓ SPL transfer result:', result);
    
            await this.vaultProvider.deleteVault(vaultId);
    
        } catch (error) {
            throw new Error(`SPL transfer failed: ${error}`);
        }
    }
  
    private async testSwap() {
      console.log('\n🔄 Testing Token Swap...');
  
        try {
            const vaultId = await this.vaultProvider.createVault({
            name: 'Swap Test Vault'
            });
    
            const params: SwapParams = {
            inputMint: 'So11111111111111111111111111111111111111112', // SOL
            outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
            amount: 0.01,
            slippage: 1 // 1% slippage
            };
    
            const result = await this.executeSwap(params);
            console.log('  ✓ Swap result:', result);
    
            await this.vaultProvider.deleteVault(vaultId);
    
        } catch (error) {
            throw new Error(`Swap failed: ${error}`);
        }
    }
  
    private async executeTransfer(
        type: 'sol' | 'spl', 
        params: TransferSolParams | TransferSplParams
    ): Promise<ActionResponse<TransactionResponse>> {
      // Implementation would go here
      // This is a mock response
        return {
            success: true,
            data: {
            signature: 'mock_signature',
            status: 'success',
            timestamp: Date.now()
            }
        };
    }
  
    private async executeSwap(
        params: SwapParams
        ): Promise<ActionResponse<TransactionResponse>> {

        return {
            success: true,
            data: {
            signature: 'mock_signature',
            status: 'success',
            timestamp: Date.now()
            }
        };
    }
}
  
  // Usage example
async function runTests() {
    const agent = new TestAgent(
    'your-api-key',
    'https://api.emblemvault.ai',
    'your-test-wallet-address'
    );
    
    await agent.runAllTests();
}
    
    // Run tests
if (require.main === module) {
    runTests().catch(console.error);
}
    
export default TestAgent;
  