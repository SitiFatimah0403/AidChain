const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getGeminiResponse(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    return null; // returning null allows fallback if needed
  }
}

// Simulated chatbot fallback response for AidChain
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

module.exports = { getGeminiResponse };
