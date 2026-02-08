#!/usr/bin/env python3
"""
Seed script to insert demo journal entries showing increasing risk trend.
Run with: python seed.py
"""

import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

SAMPLES = [
    {'textEntry': 'I felt a little tired today, but okay.', 'riskScore': 25},
    {'textEntry': 'More stressed than usual, having trouble sleeping.', 'riskScore': 40},
    {'textEntry': 'Feeling anxious and alone.', 'riskScore': 50},
    {'textEntry': 'I have been crying and feeling hopeless.', 'riskScore': 60},
    {'textEntry': 'I feel depressed and worthless.', 'riskScore': 70},
    {'textEntry': 'I sometimes think I should end it all.', 'riskScore': 80},
    {'textEntry': 'I want to die, I might kill myself.', 'riskScore': 85},
]

def seed():
    uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/mindguard')
    client = MongoClient(uri)
    db = client['mindguard']
    collection = db['journals']
    
    # Clear existing data
    collection.delete_many({})
    
    # Insert samples
    for sample in SAMPLES:
        doc = {
            'textEntry': sample['textEntry'],
            'riskScore': sample['riskScore'],
            'signals': [],
            'sentiment': 'negative',
            'createdAt': __import__('datetime').datetime.utcnow()
        }
        collection.insert_one(doc)
    
    print(f'✓ Inserted {len(SAMPLES)} sample journal entries')
    client.close()

if __name__ == '__main__':
    seed()
