#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Utility functions
const toPascalCase = (str) => {
  return str.replace(/(?:^|-)([a-z])/g, (_, char) => char.toUpperCase());
};

const toKebabCase = (str) => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

// Generate random port starting from 3002
const generatePort = () => {
  return 3002 + Math.floor(Math.random() * 100);
};

// Template functions
const createPackageJson = (sdkName, description, port) => ({
  name: '@izion/' + sdkName + '-sdk',
  version: '1.0.0',
  description: description,
  main: 'dist/index.js',
  scripts: {
    build: 'tsc',
    dev: 'vite --port ' + port + ' --host',
    preview: 'vite preview --port ' + port,
    test: 'echo "No tests specified"'
  },
  dependencies: {
    react: '^18.2.0',
    'react-dom': '^18.2.0',
    'react-router-dom': '^6.8.0'
  },
  devDependencies: {
    '@types/react': '^18.2.0',
    '@types/react-dom': '^18.2.0',
    '@vitejs/plugin-react': '^4.2.0',
    typescript: '^5.3.0',
    vite: '^5.0.0'
  }
});

const createViteConfig = (sdkName, port) => `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@izion/shared': resolve(__dirname, '../../utils/shared'),
      '@izion/security': resolve(__dirname, '../../utils/security'),
      '@izion/api': resolve(__dirname, '../../utils/api'),
      '@izion/ui': resolve(__dirname, '../../utils/ui'),
    }
  },
  server: {
    port: ${port},
    host: true,
    open: true
  },
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '${toPascalCase(sdkName)}SDK',
      fileName: '${sdkName}-sdk'
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})`;

const createMainTsx = () => `import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)`;

const createAppTsx = (sdkName) => {
  const pascalName = toPascalCase(sdkName);
  const emoji = getSDKEmoji(sdkName);
  
  return `import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { ${pascalName}SDK } from './${sdkName}-sdk'
import Dashboard from './pages/Dashboard'
import ${pascalName}s from './pages/${pascalName}s'
import Settings from './pages/Settings'
import './App.scss'

const sdk = new ${pascalName}SDK({
  apiKey: 'demo-api-key',
  baseURL: 'https://api.example.com',
  enableSecurity: true
})

function App() {
  const location = useLocation()

  return (
    <div className="${sdkName}-app">
      <header className="app-header">
        <h1>${emoji} ${pascalName} SDK</h1>
        <nav className="app-nav">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            Dashboard
          </Link>
          <Link 
            to="/${sdkName}s" 
            className={location.pathname === '/${sdkName}s' ? 'active' : ''}
          >
            ${pascalName}s
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
          <Route path="/${sdkName}s" element={<${pascalName}s sdk={sdk} />} />
          <Route path="/settings" element={<Settings sdk={sdk} />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>🚀 Izion ${pascalName} SDK v1.0.0</p>
      </footer>
    </div>
  )
}

export default App`;
};

const createSDKClass = (sdkName) => {
  const pascalName = toPascalCase(sdkName);
  
  return `interface ${pascalName}Config {
  apiKey: string
  baseURL: string
  enableSecurity?: boolean
}

export class ${pascalName}SDK {
  private config: ${pascalName}Config

  constructor(config: ${pascalName}Config) {
    this.config = config

    if (config.enableSecurity) {
      this.initSecurity()
    }
  }

  private initSecurity() {
    console.log('🔒 ${pascalName} SDK Security initialized')
  }

  async process${pascalName}(data: any) {
    try {
      console.log('Processing ${sdkName}:', { data, timestamp: Date.now() })
      return { success: true, id: \`\${Date.now()}\` }
    } catch (error) {
      console.error('${pascalName} processing failed:', error)
      throw error
    }
  }

  getVersion() {
    return '1.0.0'
  }
}`;
};

const createDashboardPage = (sdkName) => {
  const pascalName = toPascalCase(sdkName);
  const emoji = getSDKEmoji(sdkName);
  
  return `interface PageProps {
  sdk: any
}

function Dashboard({ sdk }: PageProps) {
  return (
    <div className="dashboard-page">
      <h2>${emoji} ${pascalName} Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total ${pascalName}s</h3>
          <p className="stat-value">1,234</p>
        </div>
        <div className="stat-card">
          <h3>Success Rate</h3>
          <p className="stat-value">98.5%</p>
        </div>
        <div className="stat-card">
          <h3>Active Users</h3>
          <p className="stat-value">5,678</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard`;
};

const createMainPage = (sdkName) => {
  const pascalName = toPascalCase(sdkName);
  const emoji = getSDKEmoji(sdkName);
  
  return `interface PageProps {
  sdk: any
}

function ${pascalName}s({ sdk }: PageProps) {
  const handle${pascalName} = () => {
    console.log('Processing ${sdkName}...', sdk)
  }

  return (
    <div className="${sdkName}s-page">
      <h2>${emoji} ${pascalName} Management</h2>
      <div className="${sdkName}-form">
        <div className="form-group">
          <label>Title</label>
          <input type="text" placeholder="Enter title" />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea placeholder="Enter description"></textarea>
        </div>
        <div className="form-group">
          <label>Status</label>
          <select>
            <option>Active</option>
            <option>Inactive</option>
            <option>Pending</option>
          </select>
        </div>
        <button onClick={handle${pascalName}} className="btn-primary">
          Process ${pascalName}
        </button>
      </div>
    </div>
  )
}

export default ${pascalName}s`;
};

const createSettingsPage = (sdkName) => {
  const pascalName = toPascalCase(sdkName);
  
  return `interface PageProps {
  sdk: any
}

function Settings({ sdk }: PageProps) {
  return (
    <div className="settings-page">
      <h2>⚙️ ${pascalName} SDK Settings</h2>
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

export default Settings`;
};

const createAppScss = (sdkName) => {
  return `// Global styles
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  line-height: 1.6;
  color: #333;
  background: #f8f9fa;
}

// App styles
.${sdkName}-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);

  h1 {
    font-size: 1.8rem;
    font-weight: 700;
  }
}

.app-nav {
  display: flex;
  gap: 2rem;

  a {
    color: rgba(255,255,255,0.8);
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    font-weight: 500;

    &:hover, &.active {
      background: rgba(255,255,255,0.2);
      color: white;
    }
  }
}

.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  background: #2c3e50;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}

// Page styles
.dashboard-page, .${sdkName}s-page, .settings-page {
  h2 {
    margin-bottom: 2rem;
    color: #2c3e50;
    font-size: 2rem;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }

  h3 {
    color: #7f8c8d;
    font-size: 1rem;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .stat-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: #2c3e50;
  }
}

// Form styles
.${sdkName}-form, .settings-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  max-width: 500px;
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #2c3e50;
  }

  input, select, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: #667eea;
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }

  input[type="checkbox"] {
    width: auto;
    margin-right: 0.5rem;
  }
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
}`;
};

const createIndexScss = () => `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`;

const createIndexHtml = (sdkName) => {
  const pascalName = toPascalCase(sdkName);
  const emoji = getSDKEmoji(sdkName);
  
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${emoji} ${pascalName} SDK - Izion</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
};

const createTsConfig = () => ({
  extends: '../../tsconfig.json',
  compilerOptions: {
    outDir: './dist',
    rootDir: './src'
  },
  include: ['src/**/*']
});

// Emoji mapping
function getSDKEmoji(sdkName) {
  const emojiMap = {
    payment: '💳',
    bank: '🏦',
    game: '🎮',
    social: '👥',
    chat: '💬',
    auth: '🔐',
    analytics: '📊',
    notification: '🔔',
    email: '📧',
    shopping: '🛒',
    booking: '📅',
    media: '🎵',
    map: '🗺️',
    file: '📁',
    search: '🔍'
  };
  return emojiMap[sdkName] || '🚀';
}

// Main function to create SDK
function createSDK() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node scripts/create-sdk-simple.js <sdk-name> [description]');
    console.log('Example: node scripts/create-sdk-simple.js auth "Authentication SDK"');
    process.exit(1);
  }

  const sdkName = toKebabCase(args[0]);
  const description = args[1] || 'Izion ' + toPascalCase(sdkName) + ' SDK';
  const port = generatePort();
  const sdkPath = path.join(__dirname, '..', 'packages', sdkName);

  console.log('🚀 Creating new SDK: ' + sdkName);
  console.log('📁 Path: ' + sdkPath);
  console.log('🌐 Port: ' + port);

  // Check if SDK already exists
  if (fs.existsSync(sdkPath)) {
    console.error('❌ SDK "' + sdkName + '" already exists!');
    process.exit(1);
  }

  try {
    // Create directory structure
    console.log('📂 Creating directories...');
    fs.mkdirSync(sdkPath, { recursive: true });
    fs.mkdirSync(path.join(sdkPath, 'src'), { recursive: true });
    fs.mkdirSync(path.join(sdkPath, 'src', 'pages'), { recursive: true });

    // Create package.json
    console.log('📦 Creating package.json...');
    fs.writeFileSync(
      path.join(sdkPath, 'package.json'),
      JSON.stringify(createPackageJson(sdkName, description, port), null, 2)
    );

    // Create vite.config.ts
    console.log('⚡ Creating vite.config.ts...');
    fs.writeFileSync(
      path.join(sdkPath, 'vite.config.ts'),
      createViteConfig(sdkName, port)
    );

    // Create tsconfig.json
    console.log('🔧 Creating tsconfig.json...');
    fs.writeFileSync(
      path.join(sdkPath, 'tsconfig.json'),
      JSON.stringify(createTsConfig(), null, 2)
    );

    // Create main files
    console.log('📝 Creating main files...');
    fs.writeFileSync(path.join(sdkPath, 'src', 'main.tsx'), createMainTsx());
    fs.writeFileSync(path.join(sdkPath, 'src', 'App.tsx'), createAppTsx(sdkName));
    fs.writeFileSync(path.join(sdkPath, 'src', sdkName + '-sdk.ts'), createSDKClass(sdkName));

    // Create pages
    console.log('📄 Creating pages...');
    fs.writeFileSync(path.join(sdkPath, 'src', 'pages', 'Dashboard.tsx'), createDashboardPage(sdkName));
    fs.writeFileSync(path.join(sdkPath, 'src', 'pages', toPascalCase(sdkName) + 's.tsx'), createMainPage(sdkName));
    fs.writeFileSync(path.join(sdkPath, 'src', 'pages', 'Settings.tsx'), createSettingsPage(sdkName));

    // Create styles
    console.log('🎨 Creating styles...');
    fs.writeFileSync(path.join(sdkPath, 'src', 'App.scss'), createAppScss(sdkName));
    fs.writeFileSync(path.join(sdkPath, 'src', 'index.scss'), createIndexScss());

    // Create HTML
    console.log('🌐 Creating index.html...');
    fs.writeFileSync(path.join(sdkPath, 'index.html'), createIndexHtml(sdkName));

    // Create main SDK export
    console.log('📤 Creating main export...');
    const mainContent = 'export { ' + toPascalCase(sdkName) + 'SDK } from "./' + sdkName + '-sdk";\nexport default ' + toPascalCase(sdkName) + 'SDK;';
    fs.writeFileSync(path.join(sdkPath, 'src', 'index.ts'), mainContent);

    // Create README
    console.log('📚 Creating README...');
    const pascalName = toPascalCase(sdkName);
    const emoji = getSDKEmoji(sdkName);
    const readme = '# ' + emoji + ' ' + pascalName + ' SDK\n\n' + description + '\n\n## Development\n\n```bash\npnpm dev:' + sdkName + ' # → http://localhost:' + port + '\n```\n\n## Usage\n\n```typescript\nimport { ' + pascalName + 'SDK } from "@izion/' + sdkName + '-sdk";\n\nconst sdk = new ' + pascalName + 'SDK({\n  apiKey: "your-api-key",\n  baseURL: "https://api.example.com",\n  enableSecurity: true\n});\n```\n\n## Features\n\n- ✅ React Router với navigation\n- ✅ SCSS styling\n- ✅ TypeScript support\n- ✅ Vite dev server\n- ✅ Security integration\n- ✅ API client ready';

    fs.writeFileSync(path.join(sdkPath, 'README.md'), readme);

    console.log('');
    console.log('✅ SDK "' + sdkName + '" created successfully!');
    console.log('📁 Location: ' + sdkPath);
    console.log('🌐 Dev server: http://localhost:' + port);
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Add dev script to root package.json:');
    console.log('   "dev:' + sdkName + '": "pnpm dev --filter=@izion/' + sdkName + '-sdk"');
    console.log('2. Install dependencies: pnpm install');
    console.log('3. Start development: pnpm dev:' + sdkName);
    
  } catch (error) {
    console.error('❌ Error creating SDK:', error);
    process.exit(1);
  }
}

// Run the script
createSDK();
