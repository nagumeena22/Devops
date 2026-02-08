// Simple seed script to insert demo journal entries showing risk trend
const mongoose = require('mongoose');
const Journal = require('./models/journal');
require('dotenv').config();

const sample = [
  { textEntry: 'I felt a little tired today, but okay.', riskScore: 25 },
  { textEntry: 'More stressed than usual, having trouble sleeping.', riskScore: 40 },
  { textEntry: 'Feeling anxious and alone.', riskScore: 50 },
  { textEntry: 'I have been crying and feeling hopeless.', riskScore: 60 },
  { textEntry: 'I feel depressed and worthless.', riskScore: 70 },
  { textEntry: 'I sometimes think I should end it all.', riskScore: 80 },
  { textEntry: 'I want to die, I might kill myself.', riskScore: 85 }
];

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mindguard';
  await mongoose.connect(uri);
  await Journal.deleteMany({});
  await Journal.insertMany(sample.map(s => ({ ...s, signals: [], createdAt: new Date() })));
  console.log('Seed complete');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
