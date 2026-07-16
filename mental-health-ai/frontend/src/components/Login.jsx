import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './Auth.css'

const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:5000'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    try {
      setError('')
      setLoading(true)
      const response = await axios.post(`${apiBase}/api/auth/login`, {
        email,
        password,
        role
      })

      const user = response.data.user
      localStorage.setItem('mindguard_currentUser', JSON.stringify(user))
      localStorage.setItem('mindguard_userRole', user.role)
      onLogin(user)
    } catch (err) {
      setError(err?.response?.data?.error || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const getRoleIcon = (r) => {
    switch (r) {
      case 'admin':
        return '👨‍💼'
      case 'therapist':
        return '👨‍⚕️'
      case 'user':
        return '👤'
      default:
        return '👤'
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
            <label>Select Your Role</label>
            <div className="role-selector">
              {['user', 'therapist', 'admin'].map((r) => (
                <div key={r} className="role-option">
                  <input
                    type="radio"
                    id={`role-${r}`}
                    value={r}
                    checked={role === r}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <label htmlFor={`role-${r}`} className="role-label">
                    <span className="role-icon">{getRoleIcon(r)}</span>
                    <span className="role-name">{r.charAt(0).toUpperCase() + r.slice(1)}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

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

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
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
