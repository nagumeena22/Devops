import React from 'react'
import { Link } from 'react-router-dom'
import './BlockedAccess.css'

export default function BlockedAccess({ user, onLogout }) {
  const roleName = user?.role || 'Guest'
  
  return (
    <div className="blocked-page">
      <div className="blocked-card card-glass">
        <div className="blocked-icon">🔒</div>
        <h1>Access Restricted</h1>
        <p>
          Your current role as <strong>{roleName.toUpperCase()}</strong> does not have permission to access this area.
        </p>
        <p className="blocked-hint">
          {user?.role === 'admin' || user?.role === 'therapist' 
            ? "Staff members are restricted from the user wellness portal to maintain system integrity and user privacy."
            : "If you believe this is an error, please contact your system administrator."}
        </p>
        <div className="blocked-actions">
          {user?.role === 'admin' ? (
            <Link to="/admin" className="hero-btn-primary">Go to Admin Console</Link>
          ) : user?.role === 'therapist' ? (
            <Link to="/therapist" className="hero-btn-primary">Go to Therapist Hub</Link>
          ) : (
            <Link to="/" className="hero-btn-primary">Go to Wellness Portal</Link>
          )}
          <button className="hero-btn-secondary" onClick={onLogout}>Logout</button>
        </div>
      </div>
    </div>
  )
}
