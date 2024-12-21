import { IAgentRuntime, Provider } from '@ai16z/eliza';
import { EmblemApi } from '../utils/api';
import { EmblemConfig, DEFAULT_CONFIG, NETWORK_URLS } from '../config';

export class EmblemProvider implements Provider {
  private api: EmblemApi | null = null;
  private config: EmblemConfig;

  constructor(customConfig: Partial<EmblemConfig> = {}) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...customConfig
    };
  }

  async initialize(runtime: IAgentRuntime): Promise<void> {
    // Try to get config from runtime settings first
    const runtimeApiKey = runtime.getSetting('EMBLEM_API_KEY');
    const runtimeApiUrl = runtime.getSetting('EMBLEM_API_URL');
    const runtimeEnvironment = runtime.getSetting('EMBLEM_ENVIRONMENT') as 'mainnet' | 'devnet';

    // Merge runtime settings with existing config
    this.config = {
      ...this.config,
      apiKey: runtimeApiKey || this.config.apiKey,
      apiUrl: runtimeApiUrl || this.config.apiUrl,
      environment: runtimeEnvironment || this.config.environment
    };

    // Validate configuration
    if (!this.config.apiKey) {
      throw new Error('EMBLEM_API_KEY not configured');
    }

    // Set API URL based on environment if not explicitly provided
    if (!this.config.apiUrl) {
      this.config.apiUrl = NETWORK_URLS[this.config.environment];
    }

    // Initialize API client
    this.api = new EmblemApi(this.config.apiKey, this.config.apiUrl);

    try {
      // Test connection
      await this.api.get('/health');
      console.log(`EmblemVault provider initialized on ${this.config.environment}`);
    } catch (error) {
      console.error('Failed to initialize EmblemVault provider:', error);
      throw error;
    }
  }

  getApi(): EmblemApi {
    if (!this.api) {
      throw new Error('EmblemVault provider not initialized');
    }
    return this.api;
  }

  getConfig(): EmblemConfig {
    return this.config;
  }
}
