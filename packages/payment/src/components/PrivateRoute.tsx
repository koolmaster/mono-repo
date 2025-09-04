import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

interface PrivateRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  allowedOrigins?: string[]
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  requireAuth = true,
  allowedOrigins = []
}) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const location = useLocation()

  useEffect(() => {
    const checkAuthorization = () => {
      // Get URL parameters
      const urlParams = new URLSearchParams(location.search)
      const apiKey = urlParams.get('apiKey')
      const origin = urlParams.get('origin') || document.referrer
      const token = urlParams.get('token')

      // If auth is not required, allow access
      if (!requireAuth) {
        setIsAuthorized(true)
        return
      }

      // Check API key
      if (!apiKey || apiKey.length < 10) {
        console.error('❌ Invalid or missing API key')
        setIsAuthorized(false)
        return
      }

      // Check allowed origins if specified
      if (allowedOrigins.length > 0 && origin) {
        const isOriginAllowed = allowedOrigins.some(allowedOrigin => 
          origin.includes(allowedOrigin)
        )
        
        if (!isOriginAllowed) {
          console.error('❌ Origin not allowed:', origin)
          setIsAuthorized(false)
          return
        }
      }

      // Additional token validation
      if (token) {
        try {
          // Simple token validation (in real app, verify with backend)
          const decoded = atob(token)
          const tokenData = JSON.parse(decoded)
          
          if (tokenData.exp && Date.now() > tokenData.exp * 1000) {
            console.error('❌ Token expired')
            setIsAuthorized(false)
            return
          }
        } catch (error) {
          console.error('❌ Invalid token format')
          setIsAuthorized(false)
          return
        }
      }

      console.log('✅ Authorization successful')
      setIsAuthorized(true)
    }

    checkAuthorization()
  }, [location.search, requireAuth, allowedOrigins])

  // Show loading while checking authorization
  if (isAuthorized === null) {
    return (
      <div className="auth-loading">
        <div className="spinner"></div>
        <p>🔐 Verifying access...</p>
      </div>
    )
  }

  // Redirect to unauthorized page if not authorized
  if (!isAuthorized) {
    return <Navigate to="/unauthorized" replace />
  }

  // Render protected content
  return <>{children}</>
}

export default PrivateRoute
