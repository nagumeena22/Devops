import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import './VoiceRecorder.css'

export default function VoiceRecorder({ onAnalyze, loading }) {
  const [recording, setRecording] = useState(false)
  const [status, setStatus] = useState('Ready to record')
  const [transcript, setTranscript] = useState('')
  const [busy, setBusy] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setStatus('Speech Recognition not supported in this browser')
      return
    }
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    let interimTranscript = ''

    recognition.onstart = () => {
      setStatus('Listening...')
    }

    recognition.onresult = (event) => {
      interimTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript_i = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          setTranscript((prev) => (prev ? prev + ' ' + transcript_i : transcript_i))
        } else {
          interimTranscript += transcript_i
        }
      }
    }

    recognition.onerror = (event) => {
      setStatus(`Error: ${event.error}`)
    }

    recognition.onend = () => {
      setRecording(false)
      setStatus('Recording stopped')
    }

    recognitionRef.current = recognition
  }, [])

  async function startRecording() {
    if (recording) return
    setTranscript('')
    setRecording(true)
    recognitionRef.current.start()
  }

  function stopRecording() {
    if (!recording) return
    recognitionRef.current.stop()
    setRecording(false)
  }

  async function analyzeTranscript() {
    if (!transcript.trim()) {
      alert('No transcript to analyze')
      return
    }
    try {
      setBusy(true)
      if (onAnalyze) await onAnalyze(transcript)
    } catch (err) {
      console.error('Analyze error', err)
      alert('Failed to analyze: ' + err.message)
    } finally {
      setBusy(false)
    }
  }

  function clearTranscript() {
    setTranscript('')
    setStatus('Ready to record')
  }

  return (
    <div className="voice-recorder">
      <h2>🎤 Voice Recorder</h2>
      <p>Speak to record your thoughts for mental health analysis.</p>

      <div className="recorder-controls">
        <button
          onClick={() => (recording ? stopRecording() : startRecording())}
          className={`recorder-button ${recording ? 'recording' : 'idle'}`}
          disabled={loading || busy}
        >
          {recording ? '⏹️ Stop Recording' : '🎬 Start Recording'}
        </button>
        <div className="status-display">
          <strong>Status:</strong> <span className={`status-text ${recording ? 'active' : ''}`}>{status}</span>
        </div>
      </div>

      {transcript && (
        <div className="transcript-box">
          <h3>Transcript</h3>
          <div className="transcript-text">{transcript}</div>
          <div className="transcript-actions">
            <button onClick={analyzeTranscript} className="analyze-button" disabled={loading || busy}>
              {busy ? 'Analyzing...' : 'Analyze Transcript'}
            </button>
            <button onClick={clearTranscript} className="clear-button" disabled={recording}>
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
