// Payment SDK Pages
import React from 'react'

interface PageProps {
  sdk: any
}

export function Dashboard({ sdk }: PageProps) {
  return (
    <div className="dashboard-page">
      <h2>📊 Payment Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Transactions</h3>
          <p className="stat-value">1,234</p>
        </div>
        <div className="stat-card">
          <h3>Revenue</h3>
          <p className="stat-value">$12,345</p>
        </div>
        <div className="stat-card">
          <h3>Success Rate</h3>
          <p className="stat-value">98.5%</p>
        </div>
      </div>
    </div>
  )
}

export function Payments({ sdk }: PageProps) {
  const handlePayment = () => {
    console.log('Processing payment...', sdk)
  }

  return (
    <div className="payments-page">
      <h2>💰 Process Payment</h2>
      <div className="payment-form">
        <div className="form-group">
          <label>Amount</label>
          <input type="number" placeholder="Enter amount" />
        </div>
        <div className="form-group">
          <label>Currency</label>
          <select>
            <option>USD</option>
            <option>EUR</option>
            <option>VND</option>
          </select>
        </div>
        <button onClick={handlePayment} className="btn-primary">
          Process Payment
        </button>
      </div>
    </div>
  )
}

export function Settings({ sdk }: PageProps) {
  return (
    <div className="settings-page">
      <h2>⚙️ SDK Settings</h2>
      <div className="settings-form">
        <div className="form-group">
          <label>API Key</label>
          <input type="password" value="demo-api-key" readOnly />
        </div>
        <div className="form-group">
          <label>Base URL</label>
          <input type="url" value="https://api.example.com" readOnly />
        </div>
        <div className="form-group">
          <label>Security</label>
          <input type="checkbox" checked readOnly />
          <span>Enable Anti-Debug Protection</span>
        </div>
      </div>
    </div>
  )
}
