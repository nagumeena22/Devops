import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import './Dashboard.css'

const RISK_COLORS = {
  'No Risk': 'green',
  'Mild Risk': 'yellow',
  'Moderate Risk': 'orange',
  'High Risk': 'red',
}

function getRiskColor(score) {
  if (score >= 70) return 'red'
  if (score >= 40) return 'yellow'
  return 'green'
}

export default function Dashboard({
  riskScore = 0,
  signals = [],
  trendData = [],
}) {
  const color = getRiskColor(riskScore)

  return (
    <div className="dashboard">
      {/* ================= RISK SUMMARY ================= */}
      <div className="risk-card">
        <div className="risk-title">Current Mental Health Risk</div>
        <div className={`risk-score ${color}`}>{riskScore}%</div>

        <div className="progress-bar">
          <div
            className={`progress-fill ${color}`}
            style={{ width: `${riskScore}%` }}
          />
        </div>
      </div>

      {/* ================= TREND CHART ================= */}
      <div className="chart-card">
        <h3>Weekly Risk Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trendData}>
            <XAxis dataKey="day" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="risk"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ================= WARNING SIGNALS ================= */}
      <div className="signals-card">
        <h3>Warning Signals</h3>

        {signals.length ? (
          <ul className="signals-list">
            {signals.map((s, idx) => (
              <li key={idx} className="signal-item">
                <span
                  className="signal-dot"
                  style={{
                    backgroundColor:
                      RISK_COLORS[s.label] ?? '#9ca3af',
                  }}
                />
                <span className="signal-label">{s.label}</span>
                <span className="signal-prob">
                  {(s.probability * 100).toFixed(2)}%
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-signals">
            No immediate warning signals detected 🌱
          </div>
        )}
      </div>

      {/* ================= HIGH RISK ALERT ================= */}
      {riskScore >= 70 && (
        <div className="alert-box">
          <h4>⚠️ High Risk Detected</h4>
          <p>Immediate support is strongly recommended.</p>
          <button className="alert-button">
            Connect to Crisis Counselor
          </button>
        </div>
      )}
    </div>
  )
}
