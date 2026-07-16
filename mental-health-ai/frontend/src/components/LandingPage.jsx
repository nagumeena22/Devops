import React from 'react'
import { Link } from 'react-router-dom'
import './LandingPage.css'

export default function LandingPage() {
  const features = [
    {
      title: 'Smart Journaling',
      text: 'Leverage AI-powered text and voice analysis to understand your emotional patterns.',
      icon: '🧠'
    },
    {
      title: 'Progress Tracking',
      text: 'Visualize your journey with detailed history and interactive mood calendars.',
      icon: '📈'
    },
    {
      title: 'Actionable Insights',
      text: 'Receive data-driven wellness scores and personalized signals for better self-care.',
      icon: '✨'
    },
    {
      title: 'Supportive AI Chat',
      text: 'A safe space to talk through your thoughts with a gentle, non-judgmental AI companion.',
      icon: '🛡️'
    }
  ]

  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="landing-brand">MindGuard AI</div>
        <div className="landing-nav-actions">
          <Link to="/login" className="nav-btn-text">Login</Link>
          <Link to="/signup" className="nav-btn-primary">Get Started</Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="hero-content">
          <div className="hero-status-pill">More than login — real wellbeing insights</div>
          <h1>See what MindGuard AI really does for your mind.</h1>
          <p>
            MindGuard AI is built to detect mood shifts, identify risk signals like anxiety and depression, and store your emotional history so you can spot trends early.
          </p>
          <div className="hero-cta-group">
            <Link to="/signup" className="hero-btn-primary">Create free account</Link>
            <Link to="/login" className="hero-btn-secondary">View sample dashboard</Link>
          </div>
        </div>
        <div className="hero-illustration">
          <div className="glass-card main-card">
            <div className="card-header">
              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>
            </div>
            <div className="card-body">
              <div className="skeleton-line long"></div>
              <div className="skeleton-line medium"></div>
              <div className="skeleton-line short"></div>
              <div className="skeleton-chart"></div>
            </div>
          </div>
          <div className="glass-card floating-card-1">
            <div className="floating-content">
              <span>Mood detection</span>
              <strong>Calm</strong>
            </div>
          </div>
          <div className="glass-card floating-card-2">
            <div className="floating-content">
              <span>Risk score</span>
              <strong>28% Low</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-preview">
        <div className="section-header">
          <h2>What MindGuard AI actually does</h2>
          <p>Live sample insights show mood detection, risk alerts, and trend tracking — not just a login screen.</p>
        </div>
        <div className="preview-grid">
          <div className="preview-card">
            <span className="preview-label">Mood detection</span>
            <h3>Calm</h3>
            <p>Reads journal language to understand how you are feeling and stores mood over time.</p>
          </div>
          <div className="preview-card">
            <span className="preview-label">Risk analysis</span>
            <h3>28% Low</h3>
            <p>Detects depression and anxiety signals in your writing and warns you when risk rises.</p>
          </div>
          <div className="preview-card">
            <span className="preview-label">Dashboard preview</span>
            <h3>Signals & history</h3>
            <p>Access a dashboard view of your mood, risk score, recent signals, and recommended next steps.</p>
          </div>
        </div>
      </section>

      <section className="landing-features">
        <div className="section-header">
          <h2>Professional tools for mental clarity</h2>
          <p>Designed by experts to provide a seamless wellness experience.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-item">
              <div className="feature-icon-box">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <h3>Ready to prioritize your wellness?</h3>
          <p>Join MindGuard AI and start building a healthier, more mindful routine today.</p>
          <Link to="/signup" className="footer-btn">Create Free Account</Link>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 MindGuard AI. Built for wellness, powered by intelligence.</p>
        </div>
      </footer>
    </div>
  )
}
