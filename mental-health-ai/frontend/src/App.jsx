import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Home from './components/Home'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Profile from './components/Profile'
import LandingPage from './components/LandingPage'
import JournalPage from './components/JournalPage'
import HistoryPage from './components/HistoryPage'
import TipsPage from './components/TipsPage'
import ChatPage from './components/ChatPage'
import DashboardPage from './components/DashboardPage'
import AdminDashboard from './components/AdminDashboard'
import TherapistDashboard from './components/TherapistDashboard'
import BlockedAccess from './components/BlockedAccess'
import './App.css'

const loadStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('mindguard_currentUser') || 'null')
  } catch {
    return null
  }
}

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

const syncStoredUser = (user) => {
  const users = loadStoredUsers()
  const exists = users.some((item) => item.email === user.email)
  const updatedUsers = exists ? users.map((item) => item.email === user.email ? { ...item, ...user } : item) : [...users, user]
  saveStoredUsers(updatedUsers)
  localStorage.setItem('mindguard_currentUser', JSON.stringify(user))
}

function MainApp() {
  const navigate = useNavigate()
  const storedUser = loadStoredUser()
  const [currentUser, setCurrentUser] = useState(storedUser)

  const [mode, setMode] = useState('text')
  const [riskScore, setRiskScore] = useState(storedUser?.riskScore ?? 30)
  const [mood, setMood] = useState(storedUser?.mood || 'Stable')
  const [riskAlert, setRiskAlert] = useState('')
  const [signals, setSignals] = useState(storedUser?.signals ? storedUser.signals.map((signal) => ({ label: signal, probability: 0.5 })) : [])
  const [analysisPopup, setAnalysisPopup] = useState(null)
  const [trendData, setTrendData] = useState([
    { day: 'Day 1', risk: 25 },
    { day: 'Day 2', risk: 35 },
    { day: 'Day 3', risk: 45 },
    { day: 'Day 4', risk: 55 },
    { day: 'Day 5', risk: 65 },
    { day: 'Day 6', risk: 75 },
    { day: 'Day 7', risk: 85 }
  ])
  const [loading, setLoading] = useState(false)

  const isUser = currentUser?.role === 'user'
  const isAdmin = currentUser?.role === 'admin'
  const isTherapist = currentUser?.role === 'therapist'

  function detectMoodFromText(text) {
    const normalized = text.toLowerCase()
    const scores = {
      anxious: 80,
      nervous: 80,
      worried: 75,
      stressed: 70,
      sad: 70,
      down: 70,
      depressed: 85,
      hopeless: 90,
      calm: 20,
      happy: 20,
      good: 20,
      relaxed: 25,
      supported: 25,
      grateful: 15
    }

    const matched = Object.keys(scores).filter((word) => normalized.includes(word))
    if (!matched.length) return { label: 'Neutral', moodScore: 40 }

    const average = matched.reduce((sum, key) => sum + scores[key], 0) / matched.length
    if (average >= 75) return { label: 'High Risk', moodScore: average }
    if (average >= 55) return { label: 'Anxious / Unsure', moodScore: average }
    if (average >= 35) return { label: 'Low', moodScore: average }
    return { label: 'Calm', moodScore: average }
  }

  function generateAIResponse(mood, riskScore, signals) {
    const high = [
      "I'm really sorry you're feeling this way. You're not alone. Would you like to talk more about it?",
      "It sounds like you're going through a tough time. I'm here to listen. Please reach out for support.",
      "Your feelings matter, and so do you. Consider connecting with someone you trust or a professional."
    ]
    const moderate = [
      "I can see you're managing some stress right now. Let's talk through what's on your mind.",
      "You're doing well by acknowledging how you feel. Keep sharing and tracking your journey.",
      "It's okay to feel uncertain sometimes. I'm here to support you every step of the way."
    ]
    const low = [
      "That's wonderful! Keep up the good work and continue nurturing this positive momentum.",
      "Your mood looks stable right now. Keep journaling to maintain this healthy state of mind.",
      "You're doing great. Remember to celebrate the small wins and keep being kind to yourself."
    ]

    let responses = low
    if (riskScore >= 70) responses = high
    else if (riskScore >= 40) responses = moderate

    return responses[Math.floor(Math.random() * responses.length)]
  }

  async function handleAnalyze(text, type = 'text') {
    try {
      setLoading(true)
      const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:5000'
      const res = await axios.post(`${apiBase}/api/analyze`, { text }).catch(() => null)
      let score = riskScore
      const moodResult = detectMoodFromText(text)
      setMood(moodResult.label)

      if (res && res.data) {
        const { riskScore: newScore, signals } = res.data
        score = newScore
        setRiskScore(score)
        const s = (signals || []).map((signal) => ({
          label: signal,
          probability: 0.5
        }))
        setSignals(s)
        const next = [...trendData.slice(1), { day: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), risk: score }]
        setTrendData(next)
      } else {
        const simulated = Math.min(100, Math.max(0, riskScore + (Math.random() * 20 - 10)))
        score = Math.round(simulated)
        setRiskScore(score)
      }

      if (score >= 70) {
        setRiskAlert('High risk detected — please consider reaching out or using the support tools.')
      } else if (score >= 40) {
        setRiskAlert('Moderate risk detected — keep tracking and consider calming practices.')
      } else {
        setRiskAlert('Mood looks stable. Keep journaling to maintain progress.')
      }

      const journalEntry = {
        userEmail: currentUser?.email || 'anonymous',
        type,
        textEntry: text,
        riskScore: score,
        signals: res?.data?.signals || [],
        sentiment: moodResult.label
      }

      await axios.post(`${apiBase}/api/journals`, journalEntry).catch((err) => {
        console.error('Failed to save journal entry:', err)
      })

      const aiResponse = generateAIResponse(moodResult.label, score, journalEntry.signals)

      setAnalysisPopup({
        mood: moodResult.label,
        riskScore: score,
        riskAlert,
        signals: journalEntry.signals,
        entryType: type,
        aiResponse
      })

      const storageKey = `mindguard_journal_${currentUser?.id || currentUser?.email}`
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const entries = JSON.parse(stored)
        if (entries.length > 0) {
          entries[0] = { ...entries[0], mood: moodResult.label, riskScore: score, signals: journalEntry.signals }
          localStorage.setItem(storageKey, JSON.stringify(entries))
        }
      }

      if (currentUser?.role === 'user') {
        const updatedUser = { ...currentUser, riskScore: score, mood: moodResult.label, signals: journalEntry.signals.slice(0, 5), alert: score >= 70 ? 'High risk' : score >= 40 ? 'Moderate risk' : 'Low risk' }
        setCurrentUser(updatedUser)
        syncStoredUser(updatedUser)
      }
    } catch (err) {
      console.error(err)
      alert('Analysis failed. See console.')
    } finally {
      setLoading(false)
    }
  }

  async function handleJournalSubmit(text) {
    await handleAnalyze(text, 'text')
  }

  async function handleVoiceAnalyze(text) {
    await handleAnalyze(text, 'voice')
  }

  function handleLogin(user) {
    setCurrentUser(user)
    syncStoredUser(user)
    navigate('/')
  }

  function handleRegister(user) {
    setCurrentUser(user)
    syncStoredUser(user)
    navigate('/')
  }

  function handleLogout() {
    setCurrentUser(null)
    localStorage.removeItem('mindguard_currentUser')
    navigate('/login')
  }

  const requireUser = (element) => {
    if (!currentUser) return <Navigate to="/login" />
    if (!isUser) return <Navigate to="/blocked" />
    return element
  }

  const requireAdmin = (element) => {
    if (!currentUser) return <Navigate to="/login" />
    if (!isAdmin) return <Navigate to="/blocked" />
    return element
  }

  const requireTherapist = (element) => {
    if (!currentUser) return <Navigate to="/login" />
    if (!isTherapist) return <Navigate to="/blocked" />
    return element
  }

  const requireStaff = (element) => {
    if (!currentUser) return <Navigate to="/login" />
    if (isUser) return <Navigate to="/blocked" />
    return element
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/signup" element={currentUser ? <Navigate to="/" /> : <SignUp onRegister={handleRegister} />} />
        <Route path="/profile" element={requireAuth(<Profile user={currentUser} onLogout={handleLogout} riskScore={riskScore} />)} />
        <Route path="/journal" element={requireUser(<JournalPage user={currentUser} onJournalSubmit={handleJournalSubmit} onVoiceAnalyze={handleVoiceAnalyze} onLogout={handleLogout} />)} />
        <Route path="/history" element={requireUser(<HistoryPage user={currentUser} onLogout={handleLogout} />)} />
        <Route path="/tips" element={requireUser(<TipsPage user={currentUser} onLogout={handleLogout} />)} />
        <Route path="/chat" element={requireUser(<ChatPage user={currentUser} onLogout={handleLogout} />)} />
        <Route path="/dashboard" element={requireUser(<DashboardPage user={currentUser} riskScore={riskScore} signals={signals} trendData={trendData} onLogout={handleLogout} />)} />
        <Route path="/admin" element={requireAdmin(<AdminDashboard user={currentUser} onLogout={handleLogout} />)} />
        <Route path="/therapist" element={requireTherapist(<TherapistDashboard user={currentUser} onLogout={handleLogout} />)} />
        <Route path="/blocked" element={<BlockedAccess user={currentUser} onLogout={handleLogout} />} />
        <Route path="/" element={
          currentUser ? (
            isUser ? (
              <Home user={currentUser} onLogout={handleLogout} mode={mode} setMode={setMode} riskScore={riskScore} mood={mood} riskAlert={riskAlert} signals={signals} trendData={trendData} onJournalSubmit={handleJournalSubmit} onVoiceAnalyze={handleVoiceAnalyze} loading={loading} />
            ) : isAdmin ? (
              <Navigate to="/admin" />
            ) : isTherapist ? (
              <Navigate to="/therapist" />
            ) : (
              <Navigate to="/blocked" />
            )
          ) : (
            <LandingPage />
          )
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {analysisPopup && (
        <div className="analysis-modal-backdrop" onClick={() => setAnalysisPopup(null)}>
          <div className="analysis-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Analysis complete</h2>
            <p><strong>Entry type:</strong> {analysisPopup.entryType === 'voice' ? 'Voice journal' : 'Text journal'}</p>
            <div className="analysis-summary">
              <div>
                <span>Mood</span>
                <strong>{analysisPopup.mood}</strong>
              </div>
              <div>
                <span>Risk score</span>
                <strong>{analysisPopup.riskScore}%</strong>
              </div>
            </div>
            <p className="analysis-alert">{analysisPopup.riskAlert}</p>
            {analysisPopup.signals?.length ? (
              <div className="analysis-signals">
                <strong>Detected signals:</strong>
                <span>{analysisPopup.signals.join(', ')}</span>
              </div>
            ) : (
              <p>No immediate warning signals detected.</p>
            )}
            <div className="analysis-ai-response">
              <div className="ai-icon">🤖</div>
              <p>{analysisPopup.aiResponse}</p>
            </div>
            <button type="button" onClick={() => setAnalysisPopup(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  )
}

const requireAuth = (element) => {
  const user = loadStoredUser()
  return user ? element : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  )
}
