import React, { useState } from 'react'
import './Auth.css'

export default function SignUp({ onRegister }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Individual')
  const [occupation, setOccupation] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name || !email || !password) {
      setError('Please fill all required fields')
      return
    }

    const users = JSON.parse(localStorage.getItem('mindguard_users') || '[]')
    if (users.find(u => u.email === email)) {
      setError('User with this email already exists')
      return
    }

    const user = { id: Date.now(), name, email, password, role, occupation }
    users.push(user)
    localStorage.setItem('mindguard_users', JSON.stringify(users))
    localStorage.setItem('mindguard_currentUser', JSON.stringify(user))
    setError('')
    if (onRegister) onRegister(user)
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1>🧠 MindGuard AI</h1>
          <p>Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a password" />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option>Individual</option>
              <option>Healthcare Professional</option>
              <option>Medical Professional</option>
            </select>
          </div>

          <div className="form-group">
            <label>Occupation / Qualification (optional)</label>
            <input value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder="e.g., Therapist, RN, Student" />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-button">Sign Up</button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
    </div>
  )
}
