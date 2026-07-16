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

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : Number(user.id)
    ? new Date(Number(user.id)).toLocaleDateString()
    : 'Unknown'

  // Role-specific welcome messages and icons
  const getRoleInfo = () => {
    switch (user.role) {
      case 'admin':
        return {
          icon: '👨‍💼',
          welcome: `Welcome, Admin ${user.name.split(' ')[0]}!`,
          subtitle: 'System Administrator',
          description: 'You have full system access and control over all platform operations.'
        }
      case 'therapist':
        return {
          icon: '👨‍⚕️',
          welcome: `Welcome, Dr. ${user.name.split(' ')[0]}!`,
          subtitle: 'Licensed Therapist',
          description: 'You can provide professional mental health support to users.'
        }
      case 'user':
        return {
          icon: '👤',
          welcome: `Welcome, ${user.name.split(' ')[0]}!`,
          subtitle: 'User Account',
          description: 'Your mental health companion for daily support and insights.'
        }
      default:
        return {
          icon: '👤',
          welcome: `Welcome, ${user.name}!`,
          subtitle: 'User',
          description: 'Welcome to MindGuard AI'
        }
    }
  }

  const roleInfo = getRoleInfo()

  // Role-specific sections
  const renderRoleSpecificInfo = () => {
    switch (user.role) {
      case 'therapist':
        return (
          <div className="role-specific-info">
            <h3>Professional Information</h3>
            <ul>
              <li><strong>License:</strong> {user.license || 'Not provided'}</li>
              <li><strong>Specialization:</strong> {user.specialization || 'Not specified'}</li>
              <li><strong>Experience:</strong> {user.yearsOfExperience || 'Not specified'} years</li>
              <li><strong>Verification:</strong> {user.verificationDocument || 'Pending'}</li>
            </ul>
          </div>
        )
      case 'admin':
        return (
          <div className="role-specific-info">
            <h3>Admin Information</h3>
            <ul>
              <li><strong>Department:</strong> {user.department || 'Not specified'}</li>
              <li><strong>Access Level:</strong> Full System Access</li>
              <li><strong>Status:</strong> Active Administrator</li>
            </ul>
          </div>
        )
      case 'user':
        return (
          <div className="role-specific-info">
            <h3>Health Profile</h3>
            <ul>
              <li><strong>Age:</strong> {user.age || 'Not provided'}</li>
              <li><strong>Gender:</strong> {user.gender || 'Not provided'}</li>
              {user.mentalHealthConcerns && (
                <li><strong>Concerns:</strong> {user.mentalHealthConcerns}</li>
              )}
            </ul>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* Welcome Section */}
        <div className="profile-welcome-section">
          <div className="welcome-icon">{roleInfo.icon}</div>
          <h1 className="welcome-title">{roleInfo.welcome}</h1>
          <p className="welcome-subtitle">{roleInfo.subtitle}</p>
          <p className="welcome-description">{roleInfo.description}</p>
        </div>

        <div className="profile-header">
          <div className="avatar">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
          <div>
            <h2>{user.name}</h2>
            <p className="muted">{user.role.charAt(0).toUpperCase() + user.role.slice(1)} • Member since {memberSince}</p>
          </div>
        </div>

        <div className="profile-body">
          <h3>Account Details</h3>
          <ul>
            <li><strong>Email:</strong> {user.email}</li>
            <li><strong>Role:</strong> <span className="role-badge">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span></li>
            <li><strong>Member since:</strong> {memberSince}</li>
          </ul>

          {/* Role-specific information */}
          {renderRoleSpecificInfo()}

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
            {user.role === 'admin' ? (
              <Link to="/admin" className="back-button">← Back to Admin Console</Link>
            ) : user.role === 'therapist' ? (
              <Link to="/therapist" className="back-button">← Back to Therapist Hub</Link>
            ) : (
              <Link to="/" className="back-button">← Back to Wellness Portal</Link>
            )}
            <button className="logout-button" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  )
}
