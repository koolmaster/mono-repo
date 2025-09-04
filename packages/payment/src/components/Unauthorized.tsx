import React from 'react'

const Unauthorized: React.FC = () => {
  return (
    <div className="unauthorized-page">
      <div className="unauthorized-content">
        <div className="error-icon">🚫</div>
        <h1>Access Denied</h1>
        <p>You are not authorized to access this payment portal.</p>
        <div className="error-details">
          <h3>Possible reasons:</h3>
          <ul>
            <li>Invalid or missing API key</li>
            <li>Request from unauthorized origin</li>
            <li>Expired access token</li>
            <li>Insufficient permissions</li>
          </ul>
        </div>
        <div className="contact-info">
          <p>If you believe this is an error, please contact support.</p>
          <button 
            onClick={() => window.history.back()}
            className="btn-secondary"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized
