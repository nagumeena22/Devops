import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Auth.css'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    // Retrieve user from localStorage
    const users = JSON.parse(localStorage.getItem('mindguard_users') || '[]')
    const user = users.find(u => u.email === email && u.password === password)

    if (user) {
      localStorage.setItem('mindguard_currentUser', JSON.stringify(user))
      setError('')
      onLogin(user)
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1>🧠 MindGuard AI</h1>
          <p>Welcome Back</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-button">
            Login
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link className="link-button" to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
