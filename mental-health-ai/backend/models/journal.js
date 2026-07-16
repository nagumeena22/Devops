const mongoose = require('mongoose');

const JournalSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  entryType: { type: String, enum: ['text', 'voice'], default: 'text' },
  textEntry: { type: String },
  voiceUrl: { type: String },
  riskScore: { type: Number, default: 0 },
  signals: { type: [String], default: [] },
  sentiment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Journal', JournalSchema);
