const express = require('express');
const router = express.Router();

router.post('/analyze', async (req, res) => {
  try {
    const { text } = req.body || {};
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Invalid input: text is required.' });
    }

    const negative = [
      'tired', 'stressed', 'anxious', 'hopeless', 'alone', 'depressed', 'worthless', 'crying', 'insomnia'
    ];
    const critical = ['suicide', 'kill', 'die', 'end it all'];

    const normalized = text.toLowerCase();
    let score = 30; // base
    const signals = [];

    // count occurrences
    negative.forEach((kw) => {
      const re = new RegExp('\\b' + kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'g');
      const matches = normalized.match(re);
      if (matches && matches.length) {
        score += 10 * matches.length;
        signals.push(...Array.from(new Set([...(signals || []), kw])));
      }
    });

    critical.forEach((kw) => {
      const re = new RegExp('\\b' + kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'g');
      const matches = normalized.match(re);
      if (matches && matches.length) {
        score += 20 * matches.length;
        signals.push(...Array.from(new Set([...(signals || []), kw])));
      }
    });

    if (score > 100) score = 100;

    let message = 'Low to moderate risk.';
    if (score >= 70) message = 'High risk — immediate attention recommended.';
    else if (score >= 40) message = 'Moderate risk — monitor and consider support.';

    return res.json({ riskScore: score, signals: Array.from(new Set(signals)), message });
  } catch (err) {
    console.error('Analyze error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
