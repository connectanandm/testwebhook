const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files like index.html

// Serve index.html from root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// POST /register — Sends POST to user-defined webhookUrl
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
      responseData: error.response?.data || null,
    });
  }
});

// GET /fetch — Sends GET to ?url=
app.get('/fetch', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: 'Missing url query parameter' });
  }

  try {
    const response = await axios.get(url, {
      headers: { Accept: 'application/json' },
    });

    const contentType = response.headers['content-type'];

    if (contentType.includes('application/json')) {
      res.status(200).json(response.data);
    } else {
      res.status(200).send(response.data); // for HTML or text
    }
  } catch (error) {
    res.status(500).json({
      error: 'Failed to GET from URL',
      details: error.message,
      responseData: error.response?.data || null,
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ ConnectsWebhook Server Running at http://localhost:${PORT}`);
});
