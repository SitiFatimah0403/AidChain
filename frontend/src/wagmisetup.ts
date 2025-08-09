/*
🔧 Purpose:
Sets up:
- Supported chains (Sepolia + Sapphire Testnet)
- Wallet connector (MetaMask)
- Transport (http() RPC connection)
- Exports config for use in your main file.
*/

import { http, createConfig } from 'wagmi';
import { sepolia, sapphireTestnet } from 'wagmi/chains';
import { metaMask } from '@wagmi/connectors';

export const config = createConfig({
  chains: [sepolia, sapphireTestnet], // ✅ register Sapphire here
  connectors: [metaMask()],
  transports: {
    [sepolia.id]: http(),           // defaults to public RPC for Sepolia
    [sapphireTestnet.id]: http(),   // ✅ uses Sapphire's default RPC
  },
  ssr: false,
});
