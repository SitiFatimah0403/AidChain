const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const basePrompt = `
You are AidChainBot, a helpful assistant for a decentralized donation platform.

You must only answer questions related to:
- Making donations with ETH
- Applying for aid
- NFT badges for donors or recipients
- Admin access
- Connecting MetaMask wallets

❗ If a user asks anything outside of these topics, politely say:
"I'm AidChainBot, and I can only help with donations, aid, wallets, or badges. Please ask something related."

Always stay in character as AidChainBot.`;

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
function getAidChainBotResponse(userInput) { 
  if (!userInput) return "👋 Hi! I'm AidChainBot. How can I assist you today? You can ask me about donations, aid application, or wallet setup.";

  const input = userInput.toLowerCase();

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

  return "🤖 I'm not sure how to help with that. Try asking about donations, applying for aid, or NFT badges!";
}

// Helper: checks if Gemini reply is relevant
function isAidChainRelevant(response) {
  return response.toLowerCase().includes("donation") || 
         response.toLowerCase().includes("aid") || 
         response.toLowerCase().includes("metamask") ||
         response.toLowerCase().includes("nft") ||
         response.toLowerCase().includes("badge") ||
         response.toLowerCase().includes("wallet") ||
         response.toLowerCase().includes("admin") ||
         response.toLowerCase().includes("aidchain");
}

module.exports = {
  getGeminiResponse,
  getAidChainBotResponse,
  isAidChainRelevant
};