const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());              // Allow CORS
app.use(express.json());      // Parse JSON

// Serve HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle POST to user-defined URL
app.post('/register', async (req, res) => {
  const { webhookUrl, ...rest } = req.body;

  if (!webhookUrl) {
    return res.status(400).json({ error: 'Missing webhookUrl in request body' });
  }

  try {
    const response = await axios.post(webhookUrl, rest);
    res.status(200).json({
      message: 'POST successful',
      status: response.status,
      data: response.data,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to POST to URL',
      details: error.message,
    });
  }
});

// Handle GET to user-defined URL
app.post('/fetch', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: 'Missing url query parameter' });
  }

  try {
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to GET from URL',
      details: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`ConnectsWebhook Server is Running at http://localhost:${PORT}`);
});
