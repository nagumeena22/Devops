import React, { useState } from 'react'
import './TextJournal.css'

export default function TextJournal({ onSubmit, loading }) {
  const [text, setText] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) {
      alert('Please enter some text')
      return
    }
    await onSubmit(text)
    setText('')
  }

  return (
    <div className="text-journal">
      <h2>📝 Text Journal</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your thoughts here..."
          disabled={loading}
          rows="6"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>
    </div>
  )
}