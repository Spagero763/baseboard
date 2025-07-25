import { baseSepolia } from 'wagmi/chains';

export const chain = {
    ...baseSepolia,
    id: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '84532'),
};

export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

if (!contractAddress) {
    throw new Error('NEXT_PUBLIC_CONTRACT_ADDRESS is not set');
}
if (!chain.id) {
    throw new Error('NEXT_PUBLIC_CHAIN_ID is not set');
}
