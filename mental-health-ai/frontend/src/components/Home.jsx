import React from 'react'
import { Link } from 'react-router-dom'
import AppNav from './AppNav'
import './Home.css'

export default function Home({ user, onLogout, riskScore, mood, riskAlert, signals }) {
  const firstName = user.name ? user.name.split(' ')[0] : 'User'

  const features = [
    { 
      title: 'Personal Journal', 
      desc: 'Capture your thoughts through text or voice. Every entry is a step toward clarity.', 
      link: '/journal',
      icon: '📝',
      color: '#6366f1'
    },
    { 
      title: 'Journey History', 
      desc: 'Look back at your progress. Review past entries and emotional trends over time.', 
      link: '/history',
      icon: '📅',
      color: '#8b5cf6'
    },
    { 
      title: 'Wellness Insights', 
      desc: 'Deep dive into your emotional data. Track scores and identify patterns.', 
      link: '/dashboard',
      icon: '📊',
      color: '#ec4899'
    },
    { 
      title: 'Supportive Tips', 
      desc: 'Find curated suggestions and calming techniques for your daily routine.', 
      link: '/tips',
      icon: '💡',
      color: '#f59e0b'
    },
    { 
      title: 'AI Companion', 
      desc: 'Chat with our supportive AI anytime you need someone to listen or guide you.', 
      link: '/chat',
      icon: '💬',
      color: '#10b981'
    }
  ]

  return (
    <div className="home-container">
      <AppNav user={user} onLogout={onLogout} />

      <main className="home-content">
        <header className="home-hero">
          <div className="hero-badge">MindGuard AI Portal</div>
          <h1>Welcome back, {firstName}</h1>
          <p className="hero-subtitle">Mood detection, risk alerts, and wellbeing insights tailored to your journey.</p>
        </header>

        <section className="home-status-grid">
          <article className="status-card">
            <span>Current mood</span>
            <strong>{mood}</strong>
            <p>Your latest entry was analyzed for emotional tone and context.</p>
          </article>
          <article className="status-card">
            <span>Risk detection</span>
            <strong>{riskScore}%</strong>
            <p>{riskAlert}</p>
          </article>
          <article className="status-card">
            <span>Recent signals</span>
            <strong>{signals.length ? signals.slice(0, 3).map((s) => s.label).join(', ') : 'No warnings'}</strong>
            <p>Watch for depression, anxiety, or emotional stress signals.</p>
          </article>
        </section>

        <section className="what-section">
          <div className="what-intro">
            <h2>What MindGuard AI actually does</h2>
            <p>We combine journal entries, voice notes, and wellbeing analytics to detect mood and highlight risk so you can act before things worsen.</p>
          </div>
          <div className="what-cards">
            <article className="what-card">
              <h3>Mood detection</h3>
              <p>Automatic sentiment reading from text and voice entries, with live state tracking and trend updates.</p>
            </article>
            <article className="what-card">
              <h3>Risk detection</h3>
              <p>Risk analysis surfaces depression/anxiety signals and gives you an alert when elevated risk appears.</p>
            </article>
            <article className="what-card">
              <h3>Dashboard preview</h3>
              <p>See your mood, risk score, and recent signals at a glance — plus quick access to journaling and support tools.</p>
            </article>
          </div>
        </section>

        <section className="feature-grid">
          {features.map((feature) => (
            <Link key={feature.title} to={feature.link} className="feature-card" style={{ '--accent': feature.color }}>
              <div className="feature-icon-wrapper">
                <span className="feature-icon">{feature.icon}</span>
              </div>
              <div className="feature-info">
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
              <div className="feature-arrow">→</div>
            </Link>
          ))}
        </section>

        <section className="home-footer">
          <div className="quotes-ticker">
            <div className="quotes-track">
              {['“The greatest wealth is health.” — Virgil', '“Healing takes time, and asking for help is a courageous step.”', '“Small steps still move you forward.”', '“You deserve care and kindness.”'].concat(['“The greatest wealth is health.” — Virgil', '“Healing takes time, and asking for help is a courageous step.”', '“Small steps still move you forward.”', '“You deserve care and kindness.”']).map((q, i) => (
                <span key={i} className="quote-item">{q}</span>
              ))}
            </div>
          </div>
          
          <div className="daily-goal">
            <h4>Today's Mindful Moment</h4>
            <p>Take 5 deep breaths and focus on one thing you're grateful for today.</p>
          </div>
        </section>
      </main>
    </div>
  )
}
