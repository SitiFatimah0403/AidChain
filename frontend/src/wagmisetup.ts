/*
🔧 Purpose:
Sets up:
-Supported chain (sepolia)
-Wallet connector (MetaMask)
-Transport (http() RPC connection
-Exports config for use in your main file.

*/
import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { metaMask } from '@wagmi/connectors';

export const config = createConfig({
  chains: [sepolia],
  connectors: [metaMask()],
  transports: {
    [sepolia.id]: http(), // defaults to public RPC for Sepolia
  },
  ssr: false, // If you're using Next.js SSR, set to true
});
