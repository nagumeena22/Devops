import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AppNav from './AppNav'
import TextJournal from './TextJournal'
import VoiceRecorder from './VoiceRecorder'
import './JournalPage.css'

export default function JournalPage({ user, onJournalSubmit, onVoiceAnalyze, onLogout }) {
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

  const recentEntries = entries
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  function saveEntries(updated) {
    setEntries(updated)
    localStorage.setItem(storageKey, JSON.stringify(updated))
  }

  async function handleTextSubmit(text) {
    const entry = {
      id: Date.now().toString(),
      type: 'text',
      title: 'Text journal',
      content: text,
      createdAt: new Date().toISOString()
    }
    const updated = [entry, ...entries]
    saveEntries(updated)
    if (onJournalSubmit) await onJournalSubmit(text)
  }

  async function handleVoiceEntry(transcript) {
    const entry = {
      id: Date.now().toString(),
      type: 'voice',
      title: 'Voice journal',
      content: transcript,
      createdAt: new Date().toISOString()
    }
    const updated = [entry, ...entries]
    saveEntries(updated)
    if (onVoiceAnalyze) await onVoiceAnalyze(transcript)
  }

  return (
    <div className="journal-page">
      <AppNav user={user} onLogout={onLogout} />
      <div className="journal-hero">
        <div>
          <span className="small-label">Journal Hub</span>
          <h1>Write, record, and revisit every entry in one place.</h1>
          <p>Text and voice journal entries are saved to your personal history and organized by day.</p>
        </div>
        <div className="journal-actions">
          <Link to="/history" className="action-button">Calendar History</Link>
          <Link to="/tips" className="action-button secondary">Daily Tips</Link>
        </div>
      </div>

      <main className="journal-grid">
        <section className="journal-input-panel">
          <TextJournal onSubmit={handleTextSubmit} />
          <VoiceRecorder onAnalyze={handleVoiceEntry} />
        </section>

        <section className="journal-summary-panel">
          <div className="summary-card">
            <h2>Recent Entries</h2>
            {recentEntries.length ? (
              <div className="recent-list">
                {recentEntries.map((entry) => (
                  <article key={entry.id} className="recent-entry">
                    <div className="entry-meta">
                      <span className="entry-type">{entry.type === 'voice' ? '🎤 Voice' : '📝 Text'}</span>
                      <span className="entry-date">
                        {new Date(entry.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p>{entry.content.slice(0, 120)}{entry.content.length > 120 ? '...' : ''}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty-state">No journal entries yet. Start with a text or voice journal today.</p>
            )}
          </div>

          <div className="summary-card calendar-preview">
            <div className="summary-card-header">
              <h2>Activity by Day</h2>
              <p>Tap a date to review entries.</p>
            </div>
            <div className="day-grid">
              {sortedDates.length ? (
                sortedDates.map((dateKey) => (
                  <button
                    type="button"
                    key={dateKey}
                    className={`day-pill ${selectedDate === dateKey ? 'selected' : ''}`}
                    onClick={() => setSelectedDate(dateKey)}
                  >
                    <strong>{dateKey}</strong>
                    <span>{groupedByDate[dateKey].length} entries</span>
                  </button>
                ))
              ) : (
                <p className="empty-state">Your journal calendar will fill up as you add entries.</p>
              )}
            </div>
            {selectedDate && groupedByDate[selectedDate] && (
              <div className="selected-day-detail">
                <h3>{selectedDate}</h3>
                {groupedByDate[selectedDate].map((entry) => (
                  <article key={entry.id} className="detail-entry">
                    <div className="entry-meta">
                      <span>{entry.type === 'voice' ? 'Voice entry' : 'Text entry'}</span>
                      <span>{new Date(entry.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p>{entry.content}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
