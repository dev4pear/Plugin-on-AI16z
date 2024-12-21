export const TRANSFER_TEMPLATE = `
Extract the following information about the requested transfer:
- vault_id: The source vault ID
- to_address: The destination Solana address
- amount: The amount to transfer
- mint: (optional) The SPL token mint address

\`\`\`json
{
    "vault_id": string | null,
    "to_address": string | null,
    "amount": number | null,
    "mint": string | null
}
\`\`\`
`;

export const SWAP_TEMPLATE = `
Extract the following information about the requested swap:
- vault_id: The vault ID
- input_mint: The input token mint address
- output_mint: The output token mint address
- amount: The amount to swap

\`\`\`json
{
    "vault_id": string | null,
    "input_mint": string | null,
    "output_mint": string | null,
    "amount": number | null
}
\`\`\`
`;
