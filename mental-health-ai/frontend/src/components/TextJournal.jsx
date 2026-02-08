import React, { useState } from 'react'
import './TextJournal.css'

export default function TextJournal({ onSubmit = () => {}, loading = false }) {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (text.trim()) {
      onSubmit(text)
      setText('')
    }
  }

  return (
    <div className="text-journal">
      <h2>📝 Write Your Journal Entry</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts and feelings... Your entry is analyzed for mental health insights."
          disabled={loading}
        />
        <div className="button-group">
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading || !text.trim()}
          >
            {loading ? '⏳ Analyzing...' : '🔍 Analyze Entry'}
          </button>
        </div>
      </form>
    </div>
  )
}