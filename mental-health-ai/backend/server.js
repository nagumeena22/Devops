const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const https = require('https');
const axios = require('axios');
const client = require('prom-client'); // Prometheus client

dotenv.config();

const analyzeRouter = require('./routes/analyze');
const authRouter = require('./routes/auth');
const journalRouter = require('./routes/journals');

const app = express();

// =====================
// Prometheus Metrics
// =====================
client.collectDefaultMetrics();

app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// =====================
// Middleware
// =====================
app.use(cors());
app.use(express.json());

// =====================
// MongoDB Connection
// =====================
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/mindguard';

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error', err);
    process.exit(1);
  });

// =====================
// Routes
// =====================
app.use('/api/auth', authRouter);
app.use('/api', analyzeRouter);
app.use('/api/journals', journalRouter);

// =====================
// Chat Endpoint (Grok)
// =====================
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res
        .status(400)
        .json({ error: 'Invalid input: message is required.' });
    }

    const apiKey = process.env.GROK_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured.' });
    }

    const response = await axios.post(
      'https://api.x.ai/v1/chat/completions',
      {
        model: 'grok-beta',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful mental health assistant. Provide supportive, empathetic responses.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      }
    );

    const data = response.data;
    console.log('Grok API response:', data);

    const reply = data.choices[0].message.content;

    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// =====================
// Available Models
// =====================
app.get('/api/models', async (req, res) => {
  try {
    const apiKey = process.env.GROK_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured.' });
    }

    const response = await axios.get('https://api.x.ai/v1/models', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });

    res.json(response.data);
  } catch (err) {
    console.error('Models error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// =====================
// Start Server
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`MindGuard backend running on port ${PORT}`);
  console.log(`Prometheus metrics available at http://localhost:${PORT}/metrics`);
});