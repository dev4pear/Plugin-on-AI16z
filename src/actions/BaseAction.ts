import { EmblemApi } from '../utils/api';
import { VaultProvider } from '../types';

export abstract class BaseAction<P, R> {
    protected api: EmblemApi;
    protected vaultProvider: VaultProvider;

    constructor(api: EmblemApi, vaultProvider: VaultProvider) {
        this.api = api;
        this.vaultProvider = vaultProvider;
    }

    abstract execute(params: P): Promise<R>;
}