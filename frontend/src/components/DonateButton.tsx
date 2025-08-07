// src/components/DonateButton.tsx
import { useState } from "react";
import { useConfidentialDonationContract } from "../hooks/useConfidentialDonationContract";
import { parseEther } from "viem";

const DonateButton = () => {
  const { sendDonation } = useConfidentialDonationContract();
  const [to, setTo] = useState(""); // recipient address
  const [amount, setAmount] = useState("0.01"); // ETH value
  const [txHash, setTxHash] = useState("");

  const handleDonate = async () => {
    try {
      const tx = await sendDonation(to as `0x${string}`, parseEther(amount));
      setTxHash(tx);
      alert(`Donation sent! Tx hash: ${tx}`);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div>
      <h2>Send Confidential Donation</h2>
      <input
        type="text"
        placeholder="Recipient address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleDonate}>Donate</button>
      {txHash && <p>Tx sent: {txHash}</p>}
    </div>
  );
};

export default DonateButton;
