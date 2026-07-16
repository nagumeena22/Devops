import React, { useEffect, useMemo, useState } from 'react'
import TherapistNav from './TherapistNav'
import './TherapistDashboard.css'

const loadStoredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('mindguard_users') || '[]')
  } catch {
    return []
  }
}

const getJournalSummary = (user) => {
  const key = `mindguard_journal_${user.id || user.email}`
  const stored = localStorage.getItem(key)
  if (!stored) return { count: 0, lastEntry: null }
  try {
    const entries = JSON.parse(stored)
    return {
      count: entries.length,
      lastEntry: entries.length ? entries[0].createdAt : null
    }
  } catch {
    return { count: 0, lastEntry: null }
  }
}

export default function TherapistDashboard({ user, onLogout }) {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const lastName = user.name ? user.name.split(' ').pop() : 'Specialist'

  useEffect(() => {
    const stored = loadStoredUsers()
    // Therapists only see 'user' role accounts
    const patients = stored.filter(u => u.role === 'user')
    const sorted = patients.sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))
    setUsers(sorted)
    if (!selectedUser && sorted.length) setSelectedUser(sorted[0])
  }, [selectedUser])

  const stats = useMemo(() => {
    const highRisk = users.filter(u => (u.riskScore || 0) > 70).length
    const moderateRisk = users.filter(u => (u.riskScore || 0) > 40 && (u.riskScore || 0) <= 70).length
    return { highRisk, moderateRisk, totalPatients: users.length }
  }, [users])

  return (
    <div className="therapist-dashboard">
      <TherapistNav user={user} onLogout={onLogout} />
      
      <div className="staff-header">
        <span className="badge">Therapist Overview</span>
        <h1>Welcome back, Dr. {lastName}</h1>
        <p>Monitor real-time risk scores and emotional signals from your patients.</p>
      </div>

      <section className="staff-stats-grid">
        <div className="stat-card high-risk">
          <span>High Risk Patients</span>
          <strong>{stats.highRisk}</strong>
        </div>
        <div className="stat-card moderate-risk">
          <span>Moderate Risk</span>
          <strong>{stats.moderateRisk}</strong>
        </div>
        <div className="stat-card total-patients">
          <span>Total Patients</span>
          <strong>{stats.totalPatients}</strong>
        </div>
      </section>

      <main className="staff-layout">
        <aside className="staff-sidebar">
          <div className="sidebar-header">
            <h3>Patient List</h3>
          </div>
          <div className="patient-list">
            {users.map(patient => (
              <button 
                key={patient.email}
                className={`patient-item ${selectedUser?.email === patient.email ? 'active' : ''} ${patient.riskScore > 70 ? 'urgent' : ''}`}
                onClick={() => setSelectedUser(patient)}
              >
                <div className="patient-info">
                  <strong>{patient.name}</strong>
                  <span>Score: {patient.riskScore || 0}%</span>
                </div>
                <div className="patient-indicator" />
              </button>
            ))}
          </div>
        </aside>

        <section className="patient-detail">
          {selectedUser ? (
            <div className="detail-container">
              <div className="detail-header">
                <div>
                  <h2>{selectedUser.name}</h2>
                  <p>Patient Profile & Analysis</p>
                </div>
                <div className={`risk-pill ${(selectedUser.riskScore || 0) > 70 ? 'high' : (selectedUser.riskScore || 0) > 40 ? 'mod' : 'low'}`}>
                  {(selectedUser.riskScore || 0) > 70 ? 'High Priority' : (selectedUser.riskScore || 0) > 40 ? 'Monitoring' : 'Stable'}
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-card">
                  <h4>Wellness Score</h4>
                  <div className="score-viz">
                    <span className="score-val">{selectedUser.riskScore || 0}%</span>
                    <div className="score-bar">
                      <div className="score-fill" style={{ width: `${selectedUser.riskScore || 0}%`, background: (selectedUser.riskScore || 0) > 70 ? '#ef4444' : '#10b981' }} />
                    </div>
                  </div>
                </div>

                <div className="detail-card">
                  <h4>Engagement</h4>
                  <p>Journal Entries: <strong>{getJournalSummary(selectedUser).count}</strong></p>
                  <p>Last Entry: <strong>{getJournalSummary(selectedUser).lastEntry ? new Date(getJournalSummary(selectedUser).lastEntry).toLocaleDateString() : 'Never'}</strong></p>
                </div>
              </div>

              <div className="analysis-section">
                <h4>Confidential Analysis</h4>
                <div className="privacy-alert">
                  <p>⚠️ Journal content is kept private to protect patient trust. Only AI-generated emotional signals are displayed.</p>
                </div>
                
                <div className="signals-grid">
                   <div className="signal-card">
                      <h5>Detected Signals</h5>
                      <div className="signal-list">
                        {/* Simulated signals since they are in localStorage on patient side usually */}
                        {(selectedUser.riskScore || 0) > 70 ? (
                           <>
                             <span className="signal-tag">Severe Anxiety</span>
                             <span className="signal-tag">Withdrawal Symptoms</span>
                           </>
                        ) : (
                           <span className="signal-tag">Normal Emotional Variance</span>
                        )}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-detail">
              <p>Select a patient to view their wellness analysis.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
