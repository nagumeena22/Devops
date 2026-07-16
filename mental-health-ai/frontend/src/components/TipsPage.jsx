import React from 'react'
import { Link } from 'react-router-dom'
import AppNav from './AppNav'
import './TipsPage.css'

const tips = [
  {
    title: 'Morning Intention',
    description: 'Start your day by writing one positive intention and one thing you are grateful for.'
  },
  {
    title: 'Mindful Breathing',
    description: 'Take three slow breaths when you feel stressed. Inhale for 4, hold for 4, exhale for 6.'
  },
  {
    title: 'Small Wins',
    description: 'Celebrate a simple success today, even if it is just showing up for yourself.'
  },
  {
    title: 'Grounding Check',
    description: 'List five things you can see, four things you can feel, three things you can hear.'
  },
  {
    title: 'Self-Compassion',
    description: 'Speak to yourself with kindness the way you would speak to a good friend.'
  }
]

export default function TipsPage({ user, onLogout }) {
  return (
    <div className="tips-page">
      <AppNav user={user} onLogout={onLogout} />
      <div className="tips-hero">
        <span className="small-label">Support & Guidance</span>
        <h1>Practical tips to strengthen your routine.</h1>
        <p>Use these suggestions anytime you need a calm reset or gentle direction.</p>
      </div>

      <section className="tips-grid">
        {tips.map((tip) => (
          <article key={tip.title} className="tip-card">
            <h3>{tip.title}</h3>
            <p>{tip.description}</p>
          </article>
        ))}
      </section>

      <div className="tips-footer">
        <p>Want more? Add journal entries and check back tomorrow for fresh motivation.</p>
        <Link to="/journal" className="small-button">Return to Journal</Link>
      </div>
    </div>
  )
}
