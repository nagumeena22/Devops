# MindGuard AI — Day 1 Scaffold

This is a **Create React App + Python Flask** starter for a mental-health risk prediction demo.

## Project Structure

```
mental-health-ai/
  backend/          # Python Flask API
    app.py          # Flask app entrypoint
    requirements.txt # Python dependencies
    routes/
      analyze.py    # Sentiment analysis endpoint
    seed.py         # MongoDB seed script
    .env.example    # Environment template
    
  frontend/         # React frontend
    src/
      App.jsx       # Main app component
      index.js      # React entry
      index.css     # Global styles
      components/
        Dashboard.jsx    # Risk visualization
        TextJournal.jsx  # Text input form
        VoiceRecorder.jsx # Voice recording
    package.json    # Node deps (CRA)
```

## Quick Start

### 1. Backend (Python)

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
python app.py
```

Backend runs on `http://localhost:5000`.

**API Endpoint:**
- `POST /api/analyze` — Accepts `{ text: string }`, returns `{ riskScore: 0-100, signals: string[], message: string }`

### 2. Frontend (React)

```bash
cd frontend
npm install
npm start
```

Opens on `http://localhost:3000`.

## Features

- **VoiceRecorder**: Record 10-second audio clips (react-mic)
- **TextJournal**: Submit journal entries for sentiment analysis
- **Dashboard**: Risk score + 7-day trend chart (Recharts)
- **Python Sentiment Analysis**: Scans for mental-health keywords
  - Negative: tired, stressed, anxious, hopeless, alone, depressed, worthless, crying, insomnia
  - Critical: suicide, kill, die, end it all

## Seed Data

```bash
cd backend
python seed.py
```

Populates 7 demo entries (risk 25→85).

## Environment

**Backend .env:**
```
MONGODB_URI=mongodb://localhost:27017/mindguard
PORT=5000
```

## Stack

- **Frontend**: React 18 (Create React App), Axios, Recharts, react-mic, vanilla CSS
- **Backend**: Flask, PyMongo
- **Database**: MongoDB (optional)

## Notes

- Frontend uses **Create React App** (no Vite)
- Backend uses **Python Flask** (no Node.js/Express)
- Pure CSS styling (no Tailwind)

