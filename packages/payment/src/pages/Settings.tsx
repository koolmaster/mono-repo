interface PageProps {
  sdk: any
}

function Settings({ sdk }: PageProps) {
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

export default Settings
