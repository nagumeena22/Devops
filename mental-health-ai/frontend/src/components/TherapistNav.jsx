import React from 'react'
import { NavLink } from 'react-router-dom'
import './TherapistNav.css'

export default function TherapistNav({ user, onLogout }) {
  return (
    <nav className="therapist-nav">
      <div className="therapist-brand">
        <div>
          <strong>MindGuard Care</strong>
          <p>Therapist Workspace</p>
        </div>
      </div>
      <div className="therapist-links">
        <NavLink to="/therapist" className={({ isActive }) => isActive ? 'staff-link active' : 'staff-link'}>
          Patient Overview
        </NavLink>
      </div>
      <div className="therapist-meta">
        <div className="user-info">
          <span>{user?.name}</span>
          <small>{user?.specialization || 'Mental Health Professional'}</small>
        </div>
        <button className="staff-logout" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  )
}
