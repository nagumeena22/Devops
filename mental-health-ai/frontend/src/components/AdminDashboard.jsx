import React, { useEffect, useMemo, useState } from 'react'
import AdminNav from './AdminNav'
import './AdminDashboard.css'

const loadStoredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('mindguard_users') || '[]')
  } catch {
    return []
  }
}

const getJournalCount = (user) => {
  const key = `mindguard_journal_${user.id || user.email}`
  const stored = localStorage.getItem(key)
  if (!stored) return 0
  try {
    return JSON.parse(stored).length || 0
  } catch {
    return 0
  }
}

export default function AdminDashboard({ user, onLogout }) {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const firstName = user.name ? user.name.split(' ')[0] : 'Admin'

  useEffect(() => {
    const stored = loadStoredUsers()
    const sorted = stored.sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))
    setUsers(sorted)
    if (!selectedUser && sorted.length) setSelectedUser(sorted[0])
  }, [selectedUser])

  const userSummary = useMemo(() => {
    const userOnly = users.filter((item) => item.role === 'user')
    const therapistCount = users.filter((item) => item.role === 'therapist').length
    const averageScore = userOnly.length
      ? Math.round(userOnly.reduce((sum, item) => sum + (item.riskScore || 0), 0) / userOnly.length)
      : 0
    return {
      totalUsers: userOnly.length,
      therapistCount,
      highestScore: userOnly.reduce((max, item) => Math.max(max, item.riskScore || 0), 0),
      avgScore: averageScore
    }
  }, [users])

  return (
    <div className="admin-dashboard-page">
      <AdminNav user={user} onLogout={onLogout} />
      <div className="staff-header">
        <span className="badge admin">System Admin</span>
        <h1>Welcome back, Admin {firstName}</h1>
        <p>Comprehensive oversight of users, therapists, and system-wide wellness trends.</p>
      </div>

      <section className="staff-stats-grid">
        <div className="stat-card">
          <span>Active Users</span>
          <strong>{userSummary.totalUsers}</strong>
        </div>
        <div className="stat-card">
          <span>Therapists</span>
          <strong>{userSummary.therapistCount}</strong>
        </div>
        <div className="stat-card">
          <span>Network Risk Avg</span>
          <strong>{userSummary.avgScore}%</strong>
        </div>
      </section>

      <main className="staff-layout">
        <section className="staff-sidebar">
          <div className="sidebar-header">
            <h3>Directory</h3>
          </div>
          <div className="patient-list">
            {users.length ? (
              users.map((item) => (
                <button
                  key={item.email || item.id}
                  className={`patient-item ${selectedUser?.email === item.email ? 'active' : ''}`}
                  onClick={() => setSelectedUser(item)}
                >
                  <div className="patient-info">
                    <strong>{item.name}</strong>
                    <span>{item.role.toUpperCase()}</span>
                  </div>
                  <div className="patient-score">
                    {item.role === 'user' ? `${item.riskScore ?? 0}%` : '—'}
                  </div>
                </button>
              ))
            ) : (
              <div className="empty-state">No users found.</div>
            )}
          </div>
        </section>

        <section className="patient-detail">
          {selectedUser ? (
            <div className="detail-container">
              <div className="detail-header">
                <div>
                  <h2>{selectedUser.name}</h2>
                  <p>Role: <strong>{selectedUser.role.toUpperCase()}</strong> | Joined: {new Date(selectedUser.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
                {selectedUser.role === 'user' && (
                  <div className={`risk-pill ${(selectedUser.riskScore || 0) > 70 ? 'high' : 'low'}`}>
                    Risk: {selectedUser.riskScore || 0}%
                  </div>
                )}
              </div>

              <div className="detail-grid">
                <div className="detail-card">
                  <h4>Account Stats</h4>
                  <p>Email: <strong>{selectedUser.email}</strong></p>
                  <p>Total Entries: <strong>{getJournalCount(selectedUser)}</strong></p>
                </div>
                {selectedUser.role === 'therapist' && (
                  <div className="detail-card">
                    <h4>Professional Info</h4>
                    <p>License: <strong>{selectedUser.license || 'Verified'}</strong></p>
                    <p>Specialty: <strong>{selectedUser.specialization || 'General'}</strong></p>
                  </div>
                )}
              </div>

              {selectedUser.role === 'user' && (
                <div className="analysis-section">
                  <h4>Privacy-First Analysis</h4>
                  <div className="privacy-alert">
                    <p>🔒 Journal privacy is enforced. Admin accounts cannot view entry transcripts. Only scores and signals are visible for system monitoring.</p>
                  </div>
                  <div className="score-viz">
                    <span>Risk Analysis Progress</span>
                    <div className="score-bar">
                      <div className="score-fill" style={{ width: `${selectedUser.riskScore || 0}%`, background: '#6366f1' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-detail">Select a user to view system details.</div>
          )}
        </section>
      </main>
    </div>
  )
}
