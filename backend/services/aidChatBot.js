const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const basePrompt = `
You are AidChainBot, a helpful assistant for a decentralized donation platform.

You must answer questions related to:
- Making donations with ETH
- Applying for aid
- NFT badges for donors or recipients
- Admin access
- Connecting MetaMask wallets
- Confidential donations via Sapphire network

📌 Confidential Donation Guide (Sapphire Network):
1. Connect your MetaMask wallet.
2. Switch your network to **Sapphire** (Oasis Sapphire Mainnet or Testnet).
3. Go to the "Donate" page and select the "Confidential Donation" option.
4. Enter the donation amount in ETH and confirm the transaction.
5. Your transaction details (amount, wallet address) will be encrypted and stored privately on the Sapphire blockchain, ensuring donor anonymity.

💡 Difference between Sapphire and Sepolia donations:
- **Sapphire** → A privacy-focused EVM-compatible network from Oasis Protocol. Transactions are confidential by default, hiding donor details and amounts from the public.
- **Sepolia** → A public Ethereum test network. Transactions are fully transparent on the blockchain, meaning donation amounts and sender addresses are visible to anyone.

❗ If a user asks anything outside of these topics, politely say:
"I'm AidChainBot, and I can only help with donations, aid, wallets, badges, or confidential donation guides. Please ask something related."

Always stay in character as AidChainBot.
`;


// Gemini API Call
async function getGeminiResponse(userMessage) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: [
        {
          role: "system", 
          parts: [{ text: basePrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    return null;
  }
}

// Fallback Bot
// Fallback Bot
function getAidChainBotResponse(userInput) { 
  if (!userInput) {
    return "👋 Hi! I'm AidChainBot. You can ask me about donations, aid application, wallet setup, NFT badges, or confidential donations via the Sapphire network.";
  }

  const input = userInput.toLowerCase();

  // Confidential Donation via Sapphire
  if (input.includes("donate") && input.includes("sapphire")) {
    return "🔒 To make a confidential donation via Sapphire: 1️⃣ Connect your MetaMask. 2️⃣ Switch to the Sapphire network. 3️⃣ Go to the Donate page and choose 'Confidential Donation'. 4️⃣ Enter the amount in ETH and confirm. Your transaction will remain private.";
  }

  // Sapphire vs Sepolia difference
  if ((input.includes("difference") && input.includes("sapphire")) || input.includes("sepolia")) {
    return "💡 Sapphire is a privacy-focused blockchain where donations are encrypted and donor details are hidden. Sepolia is a public Ethereum testnet where all donation details are visible on-chain.";
  }

  if (input.includes("sapphire")) {
  return "🔒 Sapphire donation is a confidential way to give on AidChain using the Sapphire network. It hides your wallet address and donation amount from public view, keeping your contribution private while still ensuring it reaches the recipient securely.";
}


  if (input.includes("donate")) {
    return "🙏 To donate, connect your wallet and go to the Donate page. You'll send ETH to support recipients in need.";
  }

  if (input.includes("apply") || input.includes("receive aid")) {
    return "📩 To apply for aid, go to the 'Receive Aid' page, connect your wallet, and submit a request. The admin will review your application.";
  }

  if (input.includes("claim aid")) {
    return "💸 Once approved, you can claim your aid through the same 'Receive Aid' page. Make sure you're approved before claiming.";
  }

  if (input.includes("nft") || input.includes("badge")) {
    return "🏅 You can mint an NFT badge after donating or receiving aid. Check the badge button on your dashboard!";
  }

  if (input.includes("admin")) {
    return "🛡️ Only admins can access the Admin Panel. If you're an admin, make sure your wallet is authorized in the system.";
  }

  if (input.includes("wallet") || input.includes("metamask")) {
    return "👛 Make sure you have MetaMask installed. Click 'Connect Wallet' at the top right to get started!";
  }

  return "🤖 I'm not sure how to help with that. Try asking about donations, aid, NFT badges, or confidential donations via Sapphire.";
}

// Helper: checks if Gemini reply is relevant
function isAidChainRelevant(response) {
  const r = response.toLowerCase();
  return r.includes("donation") || 
         r.includes("aid") || 
         r.includes("metamask") ||
         r.includes("nft") ||
         r.includes("badge") ||
         r.includes("wallet") ||
         r.includes("admin") ||
         r.includes("aidchain") ||
         r.includes("sapphire") ||
         r.includes("confidential");
}

module.exports = {
  getGeminiResponse,
  getAidChainBotResponse,
  isAidChainRelevant
};
