import { TokenBalance } from '../types';
import { DEFAULT_DECIMALS } from './constants';

export function formatTokenAmount(amount: string, decimals: number = DEFAULT_DECIMALS): string {
    const value = parseFloat(amount) / Math.pow(10, decimals);
    return value.toLocaleString(undefined, { maximumFractionDigits: decimals });
}

export function formatBalanceResponse(solBalance: number, tokenBalances?: TokenBalance[]): string {
    let response = `SOL Balance: ${formatTokenAmount(solBalance.toString())}\n`;
    
    if (tokenBalances && tokenBalances.length > 0) {
        response += '\nToken Balances:\n';
        tokenBalances.forEach(token => {
        response += `${formatTokenAmount(token.amount, token.decimals)} (${token.mint})\n`;
        });
    }
    
    return response;
}
