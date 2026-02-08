import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Home from './components/Home'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Profile from './components/Profile'
import './App.css'

function MainApp() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('mindguard_currentUser') || 'null')
  )

  const [mode, setMode] = useState('text')
  const [riskScore, setRiskScore] = useState(30)
  const [signals, setSignals] = useState([])
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

  async function handleAnalyze(text) {
    try {
      setLoading(true)
      const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:8000'
      const res = await axios.post(`${apiBase}/analyze-text`, { text }).catch(() => null)
      if (res && res.data) {
        const { risk: score, probabilities, labels } = res.data
        setRiskScore(score)
        const s = (probabilities || []).map((p, i) => ({
          label: labels && labels[i] ? labels[i] : `Class ${i}`,
          probability: p
        }))
        setSignals(s)
        const next = [...trendData.slice(1), { day: `Day ${trendData.length + 1}`, risk: score }]
        setTrendData(next)
      } else {
        // If backend not available, simulate small random change
        const simulated = Math.min(100, Math.max(0, riskScore + (Math.random() * 20 - 10)))
        setRiskScore(Math.round(simulated))
      }
    } catch (err) {
      console.error(err)
      alert('Analysis failed. See console.')
    } finally {
      setLoading(false)
    }
  }

  async function handleJournalSubmit(text) {
    await handleAnalyze(text)
  }

  async function handleVoiceAnalyze(text) {
    await handleAnalyze(text)
  }

  function handleLogin(user) {
    setCurrentUser(user)
    localStorage.setItem('mindguard_currentUser', JSON.stringify(user))
    navigate('/')
  }

  function handleRegister(user) {
    setCurrentUser(user)
    localStorage.setItem('mindguard_currentUser', JSON.stringify(user))
    navigate('/')
  }

  function handleLogout() {
    setCurrentUser(null)
    localStorage.removeItem('mindguard_currentUser')
    navigate('/login')
  }

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/signup" element={<SignUp onRegister={handleRegister} />} />
      <Route
        path="/profile"
        element={
          currentUser ? (
            <Profile user={currentUser} onLogout={handleLogout} riskScore={riskScore} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/"
        element={
          currentUser ? (
            <Home
              user={currentUser}
              onLogout={handleLogout}
              mode={mode}
              setMode={setMode}
              riskScore={riskScore}
              signals={signals}
              trendData={trendData}
              onJournalSubmit={handleJournalSubmit}
              onVoiceAnalyze={handleVoiceAnalyze}
              loading={loading}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  )
}
