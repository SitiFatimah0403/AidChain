const express = require('express');
const router = express.Router();
const { getGeminiResponse , getAidChainBotResponse } = require('../services/aidChatBot'); // This is your Gemini call function

router.post('/chatbot', async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage || typeof userMessage !== 'string') {
      return res.status(400).json({ error: 'Invalid or empty message provided.' });
    }

    let reply = await getGeminiResponse(userMessage);

    // If Gemini failed, fallback to AidChainBot
    if (!reply) {
      console.warn("⚠️ Gemini failed. Using fallback bot.");
      reply = getAidChainBotResponse(userMessage);
    }

    res.json({ response: reply });
  } catch (error) {
    console.error("❌ API error:", error);
    res.status(500).json({ error: "Something went wrong in the server." });
  }
});

module.exports = router;
