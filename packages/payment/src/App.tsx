import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { PaymentSDK } from './payment-sdk'
import Dashboard from './pages/Dashboard'
import Payments from './pages/Payments'
import Settings from './pages/Settings'
import './App.scss'

const sdk = new PaymentSDK({
  apiKey: 'demo-api-key',
  baseURL: 'https://api.example.com',
  enableSecurity: true
})

function App() {
  const location = useLocation()

  return (
    <div className="payment-app">
      <header className="app-header">
        <h1>💳 Payment SDK</h1>
        <nav className="app-nav">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            Dashboard
          </Link>
          <Link 
            to="/payments" 
            className={location.pathname === '/payments' ? 'active' : ''}
          >
            Payments
          </Link>
          <Link 
            to="/settings" 
            className={location.pathname === '/settings' ? 'active' : ''}
          >
            Settings
          </Link>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard sdk={sdk} />} />
          <Route path="/payments" element={<Payments sdk={sdk} />} />
          <Route path="/settings" element={<Settings sdk={sdk} />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>🚀 Izion Payment SDK v1.0.0</p>
      </footer>
    </div>
  )
}

export default App
