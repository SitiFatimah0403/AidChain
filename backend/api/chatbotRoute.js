const express = require('express');
const router = express.Router();
const { getGeminiResponse , getAidChainBotResponse , isAidChainRelevant } = require('../services/aidChatBot'); // This is your Gemini call function

// Chatbot route to handle user messages
router.post('/chatbot', async (req, res) => {
  try {
    const userMessage = req.body.message; // Expecting a JSON body with a "message" field

    if (!userMessage || typeof userMessage !== 'string') {
      return res.status(400).json({ error: 'Invalid or empty message provided.' }); // Validate input
    }

    let reply = await getGeminiResponse(userMessage);

     //  If Gemini fails or gives unrelated response, use fallback
    if (!reply || !isAidChainRelevant(reply)) {
      console.warn("⚠️ Gemini failed or went off-topic. Using fallback.");
      reply = getAidChainBotResponse(userMessage);
    }

    res.json({ response: reply });
  } catch (error) {
    console.error("❌ API error:", error);
    res.status(500).json({ error: "Something went wrong in the server." });
  }
});

module.exports = router;
