/*
🔧 Purpose:
- Connects the user's MetaMask wallet.
- Shows the wallet address if connected.
- Disconnects the wallet on button click.

🔑 Uses:
- useConnect(), useAccount(), and useDisconnect() from wagmi.
- metaMask() connector from @wagmi/connectors.

🔄 How it works:
- If the wallet is not connected, a Connect Wallet button appears.
- If already connected, it shows the wallet address and a Disconnect button.
*/

import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { metaMask } from '@wagmi/connectors';

export function ConnectWalletButton() {
  const { connect, isPending } = useConnect(); // Connects to MetaMask
  const { address, isConnected } = useAccount(); // Gets connected wallet address and status
  const { disconnect } = useDisconnect(); // Disconnects the wallet

  if (isConnected) {
    return (
      <div>
        <p>Connected to {address}</p>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    );
  }

  return (
    <button onClick={() => connect({ connector: metaMask() })}>
      {isPending ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}
