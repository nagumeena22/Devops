import React from 'react'
import { Link } from 'react-router-dom'
import './Profile.css'

export default function Profile({ user, onLogout, riskScore = 0 }) {
  const resources = []
  if (riskScore >= 40) {
    resources.push('Crisis hotlines (immediate help)')
    resources.push('Breathing exercises (immediate calming)')
    resources.push('Emergency contacts (social support)')
    resources.push('Professional referrals (long-term help)')
    resources.push('Safety planning (prevention)')
    resources.push('Trend monitoring (awareness)')
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
          <div>
            <h2>{user.name}</h2>
            <p className="muted">{user.role} {user.occupation ? `• ${user.occupation}` : ''}</p>
          </div>
        </div>

        <div className="profile-body">
          <h3>Account Details</h3>
          <ul>
            <li><strong>Email:</strong> {user.email}</li>
            <li><strong>Role:</strong> {user.role}</li>
            {user.occupation && <li><strong>Occupation:</strong> {user.occupation}</li>}
            <li><strong>Member since:</strong> {new Date(user.id).toLocaleDateString()}</li>
          </ul>

          {resources.length > 0 && (
            <div className="resources">
              <h3>Immediate Support</h3>
              <ul>
                {resources.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="profile-actions">
            <Link to="/" className="back-button">← Back to Home</Link>
            <button className="logout-button" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  )
}
