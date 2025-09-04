import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useLocation, useSearchParams } from 'react-router-dom'
import { PaymentSDK } from './services/PaymentSDK'
import { Dashboard, Payments, Settings } from './pages'
import PrivateRoute from './components/PrivateRoute'
import Unauthorized from './components/Unauthorized'
import './App.scss'

function App() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [sdk, setSdk] = useState<PaymentSDK | null>(null)
  const [appConfig, setAppConfig] = useState({
    theme: 'light',
    hideHeader: false,
    hideFooter: false,
    customerId: '',
    embedMode: false
  })

  useEffect(() => {
    // Extract configuration from URL parameters
    const apiKey = searchParams.get('apiKey') || 'demo-api-key'
    const baseURL = searchParams.get('baseURL') || 'https://api.example.com'
    const customerId = searchParams.get('customerId') || ''
    const theme = searchParams.get('theme') as 'light' | 'dark' || 'light'
    const hideHeader = searchParams.get('hideHeader') === 'true'
    const hideFooter = searchParams.get('hideFooter') === 'true'
    const embedMode = searchParams.get('embed') === 'true'
    const enableSecurity = searchParams.get('security') !== 'false' // Default true
    
    // Update app configuration
    setAppConfig({
      theme,
      hideHeader,
      hideFooter,
      customerId,
      embedMode
    })

    // Apply theme
    document.documentElement.setAttribute('data-theme', theme)
    
    // Apply embed mode styles
    if (embedMode) {
      document.body.classList.add('embed-mode')
    }

    // Initialize SDK with URL parameters
    const paymentSDK = new PaymentSDK({
      apiKey,
      baseURL,
      enableSecurity,
      theme,
      customerId,
      currency: searchParams.get('currency') || 'USD',
      language: searchParams.get('lang') || 'en'
    })

    setSdk(paymentSDK)

    // Listen for postMessage from parent window (for embed mode)
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'PAYMENT_CONFIG_UPDATE') {
        paymentSDK.updateConfig(event.data.config)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [searchParams])

  // Show loading while SDK initializes
  if (!sdk) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>💳 Initializing Payment SDK...</p>
      </div>
    )
  }

  // Define allowed origins for production
  const allowedOrigins = [
    'localhost',
    'example.com',
    'your-domain.com'
  ]

  return (
    <div className={`payment-app ${appConfig.embedMode ? 'embed-mode' : ''}`}>
      {!appConfig.hideHeader && (
        <header className="app-header">
          <h1>💳 Payment SDK</h1>
          {!appConfig.embedMode && (
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
          )}
        </header>
      )}

      <main className="app-main">
        <Routes>
          {/* Public routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Protected routes */}
          <Route 
            path="/" 
            element={
              <PrivateRoute 
                requireAuth={!searchParams.get('apiKey')?.includes('demo')}
                allowedOrigins={allowedOrigins}
              >
                <Dashboard sdk={sdk} config={appConfig} />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/payments" 
            element={
              <PrivateRoute 
                requireAuth={!searchParams.get('apiKey')?.includes('demo')}
                allowedOrigins={allowedOrigins}
              >
                <Payments sdk={sdk} config={appConfig} />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <PrivateRoute 
                requireAuth={!searchParams.get('apiKey')?.includes('demo')}
                allowedOrigins={allowedOrigins}
              >
                <Settings sdk={sdk} config={appConfig} />
              </PrivateRoute>
            } 
          />
        </Routes>
      </main>

      {!appConfig.hideFooter && (
        <footer className="app-footer">
          <p>🚀 Izion Payment SDK v{sdk.getVersion()}</p>
          {appConfig.embedMode && (
            <small>Embedded Mode • Customer: {appConfig.customerId}</small>
          )}
        </footer>
      )}
    </div>
  )
}

export default App
