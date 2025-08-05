const express = require('express');
const app = express();
const cors = require('cors');

// Define the port here
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Your routes go here
app.get('/', (req, res) => {
  res.send('AidChain AI backend is running!');
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
