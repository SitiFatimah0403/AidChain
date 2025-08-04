/*
🔧 Purpose:
-Boots up your React app.
-Wraps it in WagmiProvider, providing web3 context across your entire component tree.

🔑 Uses:
-config from your wagmiSetup.ts file.
*/

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { WagmiProvider } from 'wagmi';
import { config } from './wagmisetup.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // ✅ import this

// ✅ create a QueryClient instance
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}> {/* ✅ add this wrapper */}
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);


/*
🔁 Summary of Changes:

QueryClient and QueryClientProvider :	Required by wagmi v2+ hooks (useBalance, useDisconnect, etc.)
Wrapped App with QueryClientProvider	: Prevents crash ( No QueryClient set )
*/