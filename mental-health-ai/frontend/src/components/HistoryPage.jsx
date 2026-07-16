import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AppNav from './AppNav'
import './HistoryPage.css'

export default function HistoryPage({ user, onLogout }) {
  const [entries, setEntries] = useState([])
  const [selectedDate, setSelectedDate] = useState('')

  const storageKey = `mindguard_journal_${user?.id || user?.email}`

  useEffect(() => {
    if (!user) return
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      setEntries(JSON.parse(stored))
    }
  }, [storageKey, user])

  const groupedByDate = useMemo(() => {
    return entries.reduce((map, entry) => {
      const dateKey = new Date(entry.createdAt).toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
      if (!map[dateKey]) map[dateKey] = []
      map[dateKey].push(entry)
      return map
    }, {})
  }, [entries])

  const sortedDates = Object.keys(groupedByDate).sort(
    (a, b) => new Date(groupedByDate[b][0].createdAt) - new Date(groupedByDate[a][0].createdAt)
  )

  useEffect(() => {
    if (!selectedDate && sortedDates.length) {
      setSelectedDate(sortedDates[0])
    }
  }, [selectedDate, sortedDates])

  const selectedEntries = groupedByDate[selectedDate] || []

  return (
    <div className="history-page">
      <AppNav user={user} onLogout={onLogout} />
      <div className="history-header">
        <div>
          <span className="small-label">Calendar History</span>
          <h1>See each day separately in one organized view.</h1>
          <p>Review how you felt, what you wrote, and the voice moments you captured.</p>
        </div>
        <Link to="/journal" className="history-back-button">Back to Journal</Link>
      </div>

      <section className="history-grid">
        <aside className="history-calendar">
          <div className="calendar-legend">
            <h2>Dates with entries</h2>
            <p>Choose a day to inspect details.</p>
          </div>
          {sortedDates.length ? (
            <div className="calendar-list">
              {sortedDates.map((dateKey) => (
                <button
                  key={dateKey}
                  className={`calendar-day ${selectedDate === dateKey ? 'active' : ''}`}
                  onClick={() => setSelectedDate(dateKey)}
                >
                  <strong>{dateKey}</strong>
                  <span>{groupedByDate[dateKey].length} entries</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="empty-state">No journal history found yet. Add a few entries to begin.</div>
          )}
        </aside>

        <article className="history-detail">
          <div className="detail-header">
            <h2>{selectedDate || 'Select a date'}</h2>
            <p>{selectedEntries.length ? `${selectedEntries.length} recorded journal item(s)` : 'Pick a day to review your entries.'}</p>
          </div>

          {selectedEntries.length ? (
            selectedEntries.map((entry) => (
              <div key={entry.id} className="history-entry-card">
                <div className="entry-top">
                  <span className="entry-chip">{entry.type === 'voice' ? 'Voice' : 'Text'}</span>
                  <span>{new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {entry.mood && (
                  <div className="entry-mood-badge">
                    <strong>Mood:</strong> {entry.mood}
                  </div>
                )}
                <p>{entry.content}</p>
              </div>
            ))
          ) : (
            <div className="empty-state">Select a date to show its entries here.</div>
          )}}
        </article>
      </section>
    </div>
  )
}
