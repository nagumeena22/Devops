import React from 'react'
import { Link } from 'react-router-dom'
import AppNav from './AppNav'
import Dashboard from './Dashboard'
import CrisisResources from './CrisisResources'
import './DashboardPage.css'

export default function DashboardPage({ user, riskScore, signals, trendData, onLogout }) {
  return (
    <div className="dashboard-page">
      <AppNav user={user} onLogout={onLogout} />
      <header className="dashboard-hero">
        <div>
          <span className="small-label">Wellness Dashboard</span>
          <h1>Deeply organized date-wise insights for your journey.</h1>
          <p>Track progress, discover your patterns, and access quick actions from one place.</p>
        </div>
        <Link to="/history" className="hero-link">View Calendar History</Link>
      </header>

      <section className="dashboard-summary">
        <article className="dashboard-stat">
          <h3>Current risk score</h3>
          <strong>{riskScore}%</strong>
          <p>A quick indicator of current mental health risk based on recent entries.</p>
        </article>
        <article className="dashboard-stat">
          <h3>Recent signals</h3>
          <p>{signals.length ? signals.slice(0, 3).map((s) => s.label).join(', ') : 'No immediate warning signals'}</p>
        </article>
        <article className="dashboard-stat">
          <h3>Next step</h3>
          <p>Write a journal or review your calendar to strengthen daily habits.</p>
        </article>
      </section>

      <div className="dashboard-wrapper">
        <Dashboard riskScore={riskScore} signals={signals} trendData={trendData} />
        <div style={{ marginTop: '3rem' }}>
          <CrisisResources riskScore={riskScore} />
        </div>
      </div>
    </div>
  )
}
