const express = require('express');
const router = express.Router();
const Journal = require('../models/journal');

router.post('/', async (req, res) => {
  try {
    const {
      userEmail,
      entryType,
      textEntry,
      voiceUrl,
      riskScore,
      signals,
      sentiment
    } = req.body || {};

    if (!userEmail || !entryType) {
      return res.status(400).json({ error: 'userEmail and entryType are required.' });
    }

    const journal = new Journal({
      userEmail,
      entryType,
      textEntry: textEntry || '',
      voiceUrl: voiceUrl || '',
      riskScore: riskScore || 0,
      signals: Array.isArray(signals) ? signals : [],
      sentiment: sentiment || ''
    });

    const saved = await journal.save();
    return res.status(201).json({ journal: saved });
  } catch (err) {
    console.error('Journal save error', err);
    return res.status(500).json({ error: 'Server error while saving journal entry.' });
  }
});

module.exports = router;
