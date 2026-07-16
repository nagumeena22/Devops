import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './Auth.css'

const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:5000'

const loadStoredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('mindguard_users') || '[]')
  } catch {
    return []
  }
}

const saveStoredUsers = (users) => {
  localStorage.setItem('mindguard_users', JSON.stringify(users))
}

const saveStoredUser = (user) => {
  const users = loadStoredUsers()
  const exists = users.some((item) => item.email === user.email)
  const updatedUsers = exists ? users.map((item) => item.email === user.email ? { ...item, ...user } : item) : [...users, user]
  saveStoredUsers(updatedUsers)
}

export default function SignUp({ onRegister }) {
  const [role, setRole] = useState('user')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // User specific
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [mentalHealthConcerns, setMentalHealthConcerns] = useState('')

  // Therapist specific
  const [license, setLicense] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [yearsOfExperience, setYearsOfExperience] = useState('')
  const [verificationDocument, setVerificationDocument] = useState('')

  // Admin specific
  const [adminCode, setAdminCode] = useState('')
  const [department, setDepartment] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!name || !email || !password) {
      setError('Please fill all required fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    // Role-specific validation
    if (role === 'therapist' && (!license || !specialization)) {
      setError('Therapists must provide license and specialization')
      return
    }

    if (role === 'admin' && !adminCode) {
      setError('Admin registration requires verification code')
      return
    }

    try {
      setLoading(true)
      const payload = {
        name,
        email,
        password,
        role
      }

      if (role === 'user') {
        payload.age = age
        payload.gender = gender
        payload.mentalHealthConcerns = mentalHealthConcerns
      } else if (role === 'therapist') {
        payload.license = license
        payload.specialization = specialization
        payload.yearsOfExperience = yearsOfExperience
        payload.verificationDocument = verificationDocument
      } else if (role === 'admin') {
        payload.adminCode = adminCode
        payload.department = department
      }

      const response = await axios.post(`${apiBase}/api/auth/register`, payload)

      const user = response.data.user
      localStorage.setItem('mindguard_currentUser', JSON.stringify(user))
      localStorage.setItem('mindguard_userRole', user.role)
      saveStoredUser(user)
      if (onRegister) onRegister(user)
    } catch (err) {
      setError(err?.response?.data?.error || 'Registration failed. Please try again.')
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
      <div className="auth-box auth-box-large">
        <div className="auth-header">
          <h1>🧠 MindGuard AI</h1>
          <p>Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Role Selection */}
          <div className="form-group">
            <label>Select Your Role</label>
            <div className="role-selector">
              {['user', 'therapist', 'admin'].map((r) => (
                <div key={r} className="role-option">
                  <input
                    type="radio"
                    id={`signup-role-${r}`}
                    value={r}
                    checked={role === r}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <label htmlFor={`signup-role-${r}`} className="role-label">
                    <span className="role-icon">{getRoleIcon(r)}</span>
                    <span className="role-name">{r.charAt(0).toUpperCase() + r.slice(1)}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Common Fields */}
          <div className="form-group">
            <label>Full Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password (min 6 characters)"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
            />
          </div>

          {/* User Specific Fields */}
          {role === 'user' && (
            <>
              <div className="role-specific-section">
                <h4>Tell us about yourself</h4>
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Your age"
                    min="13"
                    max="120"
                  />
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Mental Health Concerns (optional)</label>
                  <textarea
                    value={mentalHealthConcerns}
                    onChange={(e) => setMentalHealthConcerns(e.target.value)}
                    placeholder="E.g., anxiety, depression, stress..."
                    rows="3"
                  />
                </div>
              </div>
            </>
          )}

          {/* Therapist Specific Fields */}
          {role === 'therapist' && (
            <>
              <div className="role-specific-section">
                <h4>Professional Information</h4>
                <div className="form-group">
                  <label>License Number *</label>
                  <input
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    placeholder="Your professional license number"
                  />
                </div>

                <div className="form-group">
                  <label>Specialization *</label>
                  <select value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
                    <option value="">Select specialization</option>
                    <option value="cognitive-behavioral">Cognitive Behavioral Therapy</option>
                    <option value="psychodynamic">Psychodynamic Therapy</option>
                    <option value="humanistic">Humanistic Therapy</option>
                    <option value="family">Family Therapy</option>
                    <option value="couples">Couples Therapy</option>
                    <option value="trauma">Trauma Therapy</option>
                    <option value="addiction">Addiction Counseling</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Years of Experience</label>
                  <input
                    type="number"
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                    placeholder="Years of professional experience"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Verification Document</label>
                  <input
                    type="text"
                    value={verificationDocument}
                    onChange={(e) => setVerificationDocument(e.target.value)}
                    placeholder="License verification details"
                  />
                </div>
              </div>
            </>
          )}

          {/* Admin Specific Fields */}
          {role === 'admin' && (
            <>
              <div className="role-specific-section">
                <h4>Admin Verification</h4>
                <div className="form-group">
                  <label>Admin Verification Code *</label>
                  <input
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    placeholder="Enter admin verification code"
                  />
                </div>

                <div className="form-group">
                  <label>Department</label>
                  <input
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="E.g., IT, HR, Support"
                  />
                </div>
              </div>
            </>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link className="link-button" to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  )
}
