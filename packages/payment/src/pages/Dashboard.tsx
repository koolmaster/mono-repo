import React from 'react'

interface PageProps {
  sdk: any
}

function Dashboard({ sdk }: PageProps) {
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

export default Dashboard
