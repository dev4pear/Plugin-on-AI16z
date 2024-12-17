// src/providers/VaultProvider.ts
import { VaultProvider, EmblemConfig, VaultConfig } from '../types';

export class EmblemVaultProvider implements VaultProvider {
    private apiKey: string;
    private endpoint: string;
    private currentVaultId: string | null = null;

    constructor(config: EmblemConfig) {
        this.apiKey = config.apiKey;
        this.endpoint = config.endpoint;
    }

    private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.endpoint}${path}`;
        const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
        };

        const response = await fetch(url, {
        ...options,
        headers,
        });

        if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    async createVault(config?: VaultConfig): Promise<string> {
        try {
        const response = await this.request<{ vaultId: string }>('/solana2/vaults', {
            method: 'POST',
            body: JSON.stringify({
            name: config?.name,
            description: config?.description,
            }),
        });

        this.currentVaultId = response.vaultId;
        return response.vaultId;
        } catch (error) {
        throw new Error(`Failed to create vault: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getVault(): Promise<string> {
        if (!this.currentVaultId) {
        throw new Error('No vault selected. Create or select a vault first.');
        }
        return this.currentVaultId;
    }

    async deleteVault(vaultId?: string): Promise<boolean> {
        const id = vaultId || this.currentVaultId;
        if (!id) {
        throw new Error('No vault specified for deletion');
        }

        try {
        await this.request(`/solana2/vaults/${id}`, {
            method: 'DELETE',
        });

        if (id === this.currentVaultId) {
            this.currentVaultId = null;
        }
        return true;
        } catch (error) {
        throw new Error(`Failed to delete vault: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async listVaults(): Promise<string[]> {
        try {
        const response = await this.request<{ vaults: string[] }>('/solana2/vaults');
        return response.vaults;
        } catch (error) {
        throw new Error(`Failed to list vaults: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async selectVault(vaultId: string): Promise<void> {
        const vaults = await this.listVaults();
        if (!vaults.includes(vaultId)) {
        throw new Error('Invalid vault ID');
        }
        this.currentVaultId = vaultId;
    }
}
