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

    async getVault(): Promise<string> {
        if (!this.currentVaultId) {
        throw new Error('No vault selected');
        }
        return this.currentVaultId;
    }

    async createVault(config?: VaultConfig): Promise<string> {
        try {
        const response = await this.request<{ vaultId: string }>('/vaults', {
            method: 'POST',
            body: JSON.stringify(config)
        });
        return response.vaultId;
        } catch (error) {
        throw new Error(`Failed to create vault: ${error}`);
        }
    }

    async deleteVault(vaultId?: string): Promise<boolean> {
        const id = vaultId || this.currentVaultId;
        if (!id) {
        throw new Error('No vault specified');
        }

        try {
        await this.request(`/vaults/${id}`, {
            method: 'DELETE'
        });
        if (id === this.currentVaultId) {
            this.currentVaultId = null;
        }
        return true;
        } catch (error) {
        throw new Error(`Failed to delete vault: ${error}`);
        }
    }

    async listVaults(): Promise<string[]> {
        try {
        const response = await this.request<{ vaults: string[] }>('/vaults');
        return response.vaults;
        } catch (error) {
        throw new Error(`Failed to list vaults: ${error}`);
        }
    }

    async selectVault(vaultId: string): Promise<void> {
        try {
        await this.request(`/vaults/${vaultId}`, {
            method: 'GET'
        });
        this.currentVaultId = vaultId;
        } catch (error) {
        throw new Error(`Failed to select vault: ${error}`);
        }
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
}
