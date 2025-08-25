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

// Main function to create SDK
function createSDK() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node scripts/create-sdk.js <sdk-name> [description]');
    console.log('Example: node scripts/create-sdk.js payment "Payment processing SDK"');
    process.exit(1);
  }

  const sdkName = toKebabCase(args[0]);
  const description = args[1] || 'Izion ' + toPascalCase(sdkName) + ' SDK';
  const sdkPath = path.join(__dirname, '..', 'sdks', sdkName);

  console.log('Creating new SDK: ' + sdkName);
  console.log('Path: ' + sdkPath);

  // Check if SDK already exists
  if (fs.existsSync(sdkPath)) {
    console.error('SDK "' + sdkName + '" already exists!');
    process.exit(1);
  }

  try {
    // Create directory structure
    console.log('Creating directories...');
    fs.mkdirSync(sdkPath, { recursive: true });
    fs.mkdirSync(path.join(sdkPath, 'src'), { recursive: true });
    fs.mkdirSync(path.join(sdkPath, 'src', 'components'), { recursive: true });
    fs.mkdirSync(path.join(sdkPath, 'src', 'context'), { recursive: true });
    fs.mkdirSync(path.join(sdkPath, 'src', 'styles'), { recursive: true });

    // Create package.json
    console.log('Creating package.json...');
    const packageJson = {
      name: '@izion/' + sdkName + '-sdk',
      version: '1.0.0',
      description: description,
      main: 'dist/index.js',
      scripts: {
        build: 'tsc',
        dev: 'vite --port ' + (3001 + Math.floor(Math.random() * 10)) + ' --host',
        preview: 'vite preview --port ' + (3001 + Math.floor(Math.random() * 10)),
        test: 'echo "No tests specified"'
      },
      dependencies: {
        '@izion/shared': 'workspace:*',
        '@izion/security': 'workspace:*',
        '@izion/api': 'workspace:*',
        '@izion/ui': 'workspace:*',
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
    };

    fs.writeFileSync(
      path.join(sdkPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Create basic TypeScript config
    console.log('Creating tsconfig.json...');
    const tsConfig = {
      extends: '../../tsconfig.json',
      compilerOptions: {
        outDir: './dist',
        rootDir: './src'
      },
      include: ['src/**/*']
    };
    
    fs.writeFileSync(
      path.join(sdkPath, 'tsconfig.json'),
      JSON.stringify(tsConfig, null, 2)
    );

    // Create main SDK file
    console.log('Creating main SDK file...');
    const pascalName = toPascalCase(sdkName);
    const mainContent = 'export class ' + pascalName + 'SDK {\n  constructor() {\n    console.log("' + pascalName + ' SDK initialized");\n  }\n}\n\nexport default ' + pascalName + 'SDK;';
    
    fs.writeFileSync(path.join(sdkPath, 'src', 'index.ts'), mainContent);

    // Create README
    console.log('Creating README...');
    const readme = '# ' + toPascalCase(sdkName) + ' SDK\n\n' + description + '\n\n## Installation\n\n```bash\npnpm install @izion/' + sdkName + '-sdk\n```\n\n## Usage\n\n```typescript\nimport { ' + pascalName + 'SDK } from "@izion/' + sdkName + '-sdk";\n\nconst sdk = new ' + pascalName + 'SDK();\n```';

    fs.writeFileSync(path.join(sdkPath, 'README.md'), readme);

    console.log('✅ SDK "' + sdkName + '" created successfully!');
    console.log('📁 Location: ' + sdkPath);
    console.log('');
    console.log('Next steps:');
    console.log('1. cd sdks/' + sdkName);
    console.log('2. pnpm install');
    console.log('3. pnpm build');
    
  } catch (error) {
    console.error('Error creating SDK:', error);
    process.exit(1);
  }
}

// Run the script
createSDK();
