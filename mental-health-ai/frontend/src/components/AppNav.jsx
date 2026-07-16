import React from 'react'
import { NavLink } from 'react-router-dom'
import './AppNav.css'

export default function AppNav({ user, onLogout }) {
  return (
    <nav className="app-nav">
      <div className="app-brand">
        <span>MindGuard AI</span>
        <small>User Experience</small>
      </div>

      <div className="app-links">
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Home</NavLink>
        <NavLink to="/journal" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Journal</NavLink>
        <NavLink to="/history" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>History</NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Dashboard</NavLink>
        <NavLink to="/tips" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Tips</NavLink>
        <NavLink to="/chat" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Chat</NavLink>
      </div>

      <div className="app-user">
        <span>{user?.name?.split(' ')[0]}</span>
        <button className="logout-button" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  )
}
