import React, { useState, useEffect } from 'react'
import TextJournal from './TextJournal'
import VoiceRecorder from './VoiceRecorder'
import Dashboard from './Dashboard'
import CrisisResources from './CrisisResources'
import { Link } from 'react-router-dom'
import './Home.css'

export default function Home({ user, onLogout, mode, setMode, riskScore, signals, trendData, onJournalSubmit, onVoiceAnalyze, loading }) {
  const positives = [
    'You are stronger than you think',
    'Small steps still move you forward',
    'You deserve care and kindness',
    'Today is a new chance to heal',
    'Your feelings are valid'
  ]

  const quotes = [
    '“The greatest wealth is health.” — Virgil',
    '“Healing takes time, and asking for help is a courageous step.” — Unknown',
    '“You are not alone in this.” — Unknown',
    '“One day at a time.” — Unknown',
    '“What matters most is how you see yourself.” — Unknown'
  ]

  const features = [
    { title: 'Real-time Voice Analysis', desc: 'Analyze spoken thoughts instantly using browser speech recognition.' },
    { title: 'Personalized Risk Trends', desc: 'Track your mental health risk over time with clear charts.' },
    { title: 'Safety Toolkit', desc: 'Immediate resources and crisis support when risk increases.' },
    { title: 'Professional Integration', desc: 'Capture professional/medical info for tailored recommendations.' }
  ]

  const [posIndex, setPosIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setPosIndex((i) => (i + 1) % positives.length)
    }, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="home-page">
      <header className="home-header">
        <div>
          <h1>Welcome, {user.name.split(' ')[0]}</h1>
          <p className="positive">{positives[posIndex]}</p>
        </div>

        <div className="header-actions">
          <Link to="/profile" className="profile-link">Profile</Link>
          <button className="logout-small" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <section className="quotes">
        {quotes.map((q, i) => (
          <div key={i} className={`quote ${i < 5 ? 'top' : ''}`}>{q}</div>
        ))}
      </section>

      <section className="features">
        {features.map((f, i) => (
          <div key={i} className="feature-card">
            <h4>{f.title}</h4>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>

      <main className="home-main">
        <aside className="input-area">
          <div className="mode-toggle">
            <button className={mode === 'text' ? 'active' : ''} onClick={() => setMode('text')}>📝 Text</button>
            <button className={mode === 'voice' ? 'active' : ''} onClick={() => setMode('voice')}>🎤 Voice</button>
          </div>

          {mode === 'text' && <TextJournal onSubmit={onJournalSubmit} loading={loading} />}
          {mode === 'voice' && <VoiceRecorder onAnalyze={onVoiceAnalyze} loading={loading} />}
        </aside>

        <section className="dashboard-area">
          <Dashboard riskScore={riskScore} signals={signals} trendData={trendData} />
          <CrisisResources riskScore={riskScore} />
        </section>
      </main>
    </div>
  )
}
