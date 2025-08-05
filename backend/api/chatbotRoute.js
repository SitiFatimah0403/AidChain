const express = require('express');
const router = express.Router();
const { getGeminiResponse } = require('../services/aidChatBot'); // This is your Gemini call function

router.post('/chatbot', async (req, res) => {
  try {
    const userMessage = req.body.message;

    // Check first
    if (!userMessage || typeof userMessage !== 'string') {
      return res.status(400).json({ error: 'Invalid or empty message provided.' });
    }

    // Call Gemini
    const reply = await getGeminiResponse(userMessage);

    // Check if reply is valid
    if (!reply) {
      console.error("❌ Empty reply from Gemini");
      return res.status(500).json({ error: "No response from Gemini." });
    }

    // Send response
    res.json({ response: reply });
  } catch (error) {
    console.error("❌ API error:", error);
    res.status(500).json({ error: "Something went wrong in the server." });
  }
});

module.exports = router;
