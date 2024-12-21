import { Plugin } from '@ai16z/eliza';
import { transferAction } from './actions/transferAction';
import { swapAction } from './actions/swapAction';
import { balanceAction } from './actions/balanceAction';
import { EmblemProvider } from './providers/emblemProvider';

export * from './types';

const plugin: Plugin = {
    name: 'emblemvault',
    version: '1.0.0',
    actions: {
        transfer: transferAction,
        swap: swapAction,
        balance: balanceAction
    },
    provider: EmblemProvider
};

export default plugin;
