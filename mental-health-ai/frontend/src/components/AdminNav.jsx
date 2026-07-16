import React from 'react'
import { NavLink } from 'react-router-dom'
import './AdminNav.css'

export default function AdminNav({ user, onLogout }) {
  return (
    <nav className="admin-nav">
      <div className="admin-brand">
        <div>
          <strong>MindGuard Admin</strong>
          <p>Manage user insights</p>
        </div>
      </div>
      <div className="admin-links">
        <NavLink to="/admin" className={({ isActive }) => isActive ? 'admin-link active' : 'admin-link'}>
          User Overview
        </NavLink>
      </div>
      <div className="admin-meta">
        <span>{user?.name?.split(' ')[0]}</span>
        <button className="admin-logout" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  )
}
