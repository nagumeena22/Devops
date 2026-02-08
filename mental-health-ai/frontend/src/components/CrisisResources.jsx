import React from 'react'
import './CrisisResources.css'

export default function CrisisResources({ riskScore }) {
  const resources = [
    { name: '988 Suicide & Crisis Lifeline', phone: '988 (call or text)', link: 'https://988lifeline.org', color: '#dc2626' },
    { name: 'Crisis Text Line', phone: 'Text HOME to 741741', link: 'https://www.crisistextline.org', color: '#2563eb' },
    { name: 'BetterHelp', desc: 'Online Therapy Platform', link: 'https://www.betterhelp.com', color: '#7c3aed' },
    { name: 'SAMHSA Helpline', phone: '1-800-662-4357 (free, confidential, 24/7)', link: 'https://www.samhsa.gov', color: '#059669' },
    { name: 'International Association for Suicide Prevention', desc: 'Worldwide resources', link: 'https://www.iasp.info/resources/Crisis_Centres/', color: '#d97706' }
  ]

  if (riskScore < 40) return null

  const riskLevel = riskScore >= 70 ? 'HIGH' : 'MODERATE'
  const message = riskScore >= 70 
    ? "⚠️ We're concerned about your mental health. Please reach out for immediate support."
    : "📢 We've noticed signs that suggest you might benefit from professional support."

  return (
    <div className={`crisis-container risk-${riskLevel.toLowerCase()}`}>
      <div className="crisis-warning">
        <h3>{message}</h3>
      </div>

      <div className="resources-grid">
        {resources.map((res, i) => (
          <a 
            key={i} 
            href={res.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="resource-card"
            style={{ borderLeftColor: res.color }}
          >
            <div className="resource-header">
              <h4>{res.name}</h4>
            </div>
            {res.phone && <p className="resource-contact">{res.phone}</p>}
            {res.desc && <p className="resource-desc">{res.desc}</p>}
            <span className="resource-link">Visit →</span>
          </a>
        ))}
      </div>

      <div className="breathing-section">
        <h4>Quick Calming Exercise</h4>
        <p>Try this 5-minute breathing exercise: Breathe in for 4 counts, hold for 4, exhale for 4. Repeat 5 times.</p>
      </div>
    </div>
  )
}
