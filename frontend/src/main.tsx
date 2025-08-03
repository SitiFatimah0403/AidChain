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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <App />
    </WagmiProvider>
  </StrictMode>
);
