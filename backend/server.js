const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const chatbotRoute = require("./api/chatbotRoute");

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;


// Middleware
app.use(cors());
app.use(express.json());

// Use chatbot API route
app.use("/api", chatbotRoute);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
