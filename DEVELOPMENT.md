# 🛠️ Hướng dẫn phát triển chi tiết

## 📋 Mục lục

- [🎯 Quy trình phát triển](#-quy-trình-phát-triển)
- [🏗️ Kiến trúc chi tiết](#️-kiến-trúc-chi-tiết)
- [🔧 Cách tạo SDK mới](#-cách-tạo-sdk-mới)
- [📦 Quản lý packages](#-quản-lý-packages)
- [🔒 Tính năng bảo mật](#-tính-năng-bảo-mật)
- [🧪 Testing và Quality](#-testing-và-quality)
- [🚀 Build và Deployment](#-build-và-deployment)

## 🎯 Quy trình phát triển

### 1. Khởi tạo môi trường

```bash
# Clone repository
git clone <repository-url>
cd izion-sdk

# Cài đặt dependencies
pnpm install

# Build tất cả packages
pnpm build

# Verify setup
pnpm test
```

### 2. Development workflow

```bash
# 1. Xem hướng dẫn commands
pnpm dev-help

# 2. Build shared packages nếu có thay đổi
pnpm build

# 3. Phát triển SDK cụ thể 
pnpm dev:payment    # Payment SDK
pnpm dev:bank       # Bank SDK
pnpm dev:game       # Game SDK  
pnpm dev:social     # Social SDK

# 4. Hoặc phát triển tất cả SDK cùng lúc
pnpm dev:all-sdks

# 5. Test changes
pnpm test

# 6. Format và lint
pnpm format
pnpm lint
```

**⚠️ Lưu ý quan trọng:**
- **Shared packages** (`packages/`) chỉ là thư viện dùng chung - chỉ cần build khi thay đổi
- **SDK packages** (`sdks/`) là ứng dụng thực tế - chạy dev để phát triển
- Khi thay đổi shared package → phải build lại → rồi mới dev SDK

### 3. Tạo feature mới

```bash
# Tạo branch mới
git checkout -b feature/payment-integration

# Phát triển feature...

# Test trước khi commit
pnpm test
pnpm lint
pnpm build

# Commit với conventional commits
git commit -m "feat(payment): add credit card processing"

# Push và tạo PR
git push origin feature/payment-integration
```

## 🏗️ Kiến trúc chi tiết

### Dependency Graph

```
┌─────────────────┐
│   SDK Packages  │
│   payment/      │
│   bank/         │  ← depends on
│   game/         │
└─────────────────┘
         ↓
┌─────────────────┐
│ Shared Packages │
│ api/            │
│ ui/             │  ← depends on
│ security/       │
└─────────────────┘
         ↓
┌─────────────────┐
│     shared/     │
│   (base layer)  │
└─────────────────┘
```

### Package Responsibilities

#### 📦 @izion/shared
**Role**: Foundation layer
**Exports**:
- `IzionConfig`: Main configuration interface
- `ApiResponse<T>`: Generic API response type
- `SecurityManager`: Security utilities
- `StorageManager`: Browser storage wrapper
- `ValidationUtils`: Form validation helpers

#### 🔒 @izion/security
**Role**: Security enforcement
**Features**:
- Anti-debugging mechanisms
- Developer tools detection
- Console obfuscation
- Keyboard shortcuts blocking

#### 🌐 @izion/api
**Role**: HTTP client layer
**Features**:
- Axios instance with interceptors
- Automatic retry logic
- Request/response encryption
- Token management

#### 🎨 @izion/ui
**Role**: UI component library
**Components**:
- Button with variants
- Theme system
- Future: Forms, Modals, etc.

## � **Cách sử dụng:**

### Xem hướng dẫn commands:
```bash
pnpm dev-help
```

### Phát triển SDK:
```bash
# Chỉ các SDK mới cần chạy dev (không phải shared packages)
pnpm dev:payment    # Payment SDK
pnpm dev:bank       # Bank SDK  
pnpm dev:game       # Game SDK
pnpm dev:social     # Social SDK
pnpm dev:all-sdks   # Tất cả SDK cùng lúc
```

### Build shared packages:
```bash
# Khi thay đổi shared packages, cần build:
pnpm build

# Hoặc build specific package:
pnpm build --filter=@izion/shared
```

## 📦 Quản lý packages

### Thêm dependencies

```bash
# Thêm dependency cho workspace root
pnpm add typescript -w -D

# Thêm dependency cho package cụ thể
pnpm add axios --filter=@izion/api

# Thêm workspace dependency
pnpm add @izion/shared --filter=@izion/payment-sdk

# Thêm peer dependency
pnpm add react --filter=@izion/ui --save-peer
```

### Package linking

```bash
# Link local packages (tự động với workspace:*)
# Ví dụ trong package.json:
{
  "dependencies": {
    "@izion/shared": "workspace:*"
  }
}

# Build dependency order (tự động với Turborepo)
# Trong turbo.json:
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
```

### Version management

```bash
# Bump version cho tất cả packages
pnpm changeset

# Bump version cho package cụ thể
pnpm changeset add --package=@izion/payment-sdk

# Release new versions
pnpm changeset version
pnpm changeset publish
```

## 🔒 Tính năng bảo mật

### 1. Anti-Debugging Setup

```typescript
import { AntiDebugger } from '@izion/security';

const antiDebugger = AntiDebugger.getInstance();
antiDebugger.initialize({
  enableKeyBlocking: true,        // Block F12, Ctrl+Shift+I, etc.
  enableConsoleProtection: true,  // Obfuscate console
  enableDevToolsDetection: true,  // Detect dev tools
  enableContextMenu: false,       // Disable right-click
  enableTextSelection: false      // Disable text selection
});
```

### 2. API Security

```typescript
import { ApiClient } from '@izion/api';
import { SecurityManager } from '@izion/shared';

const apiClient = new ApiClient({
  baseURL: 'https://api.example.com',
  enableEncryption: true,
  encryptionKey: process.env.ENCRYPTION_KEY
});

// Tất cả requests sẽ được mã hóa tự động
const response = await apiClient.post('/sensitive-data', {
  creditCard: '4111111111111111'
});
```

### 3. Storage Security

```typescript
import { storage } from '@izion/shared';

// Secure storage operations
storage.setItem('user-token', 'jwt-token', { encrypt: true });
const token = storage.getItem('user-token', { decrypt: true });

// Auto-cleanup on page unload
storage.setItem('session-data', data, { 
  encrypt: true, 
  autoCleanup: true 
});
```

## 🧪 Testing và Quality

### 1. Unit Testing với Vitest

```bash
# Chạy tất cả tests
pnpm test

# Chạy tests cho package cụ thể
pnpm test --filter=@izion/shared

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

**Test file example**:
```typescript
// packages/shared/src/__tests__/storage.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../storage';

describe('StorageManager', () => {
  beforeEach(() => {
    storage.clear();
  });

  it('should store and retrieve data', () => {
    storage.setItem('test-key', 'test-value');
    expect(storage.getItem('test-key')).toBe('test-value');
  });

  it('should encrypt sensitive data', () => {
    storage.setItem('secret', 'sensitive-data', { encrypt: true });
    const raw = localStorage.getItem('secret');
    expect(raw).not.toBe('sensitive-data');
    expect(storage.getItem('secret', { decrypt: true })).toBe('sensitive-data');
  });
});
```

### 2. E2E Testing với Playwright

```bash
# Chạy E2E tests
pnpm test:e2e

# Chạy với UI mode
pnpm test:e2e:ui

# Chạy specific test
pnpm test:e2e --grep="payment flow"
```

**E2E test example**:
```typescript
// tests/e2e/payment.spec.ts
import { test, expect } from '@playwright/test';

test('payment SDK security features', async ({ page }) => {
  await page.goto('/payment-demo');
  
  // Verify F12 is blocked
  await page.keyboard.press('F12');
  const devToolsOpen = await page.evaluate(() => {
    return window.outerHeight - window.innerHeight > 200;
  });
  expect(devToolsOpen).toBe(false);

  // Test payment form
  await page.fill('[data-testid="card-number"]', '4111111111111111');
  await page.click('[data-testid="submit-payment"]');
  
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
});
```

### 3. Component Testing với Storybook

```bash
# Start Storybook
pnpm storybook

# Build static Storybook
pnpm build-storybook

# Test stories
pnpm test:storybook
```

**Story example**:
```typescript
// packages/ui/src/components/Button/Button.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const PaymentButton: Story = {
  args: {
    variant: 'primary',
    children: 'Pay Now',
    onClick: () => alert('Payment initiated'),
  },
};
```

## 🚀 Build và Deployment

### 1. Local Build

```bash
# Build tất cả packages
pnpm build

# Build theo dependency order
pnpm build --filter=@izion/shared
pnpm build --filter=@izion/api
pnpm build --filter=@izion/payment-sdk

# Build với cache
pnpm build --force  # Ignore cache
```

### 2. Production Build

**Build script**:
```bash
#!/bin/bash
# scripts/build-production.sh

set -e

echo "🧹 Cleaning..."
pnpm clean

echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

echo "🔍 Type checking..."
pnpm typecheck

echo "🧪 Running tests..."
pnpm test:ci

echo "🏗️ Building packages..."
pnpm build

echo "✅ Build completed successfully!"
```

### 3. AWS CodeBuild

**buildspec.yml**:
```yaml
version: 0.2

phases:
  install:
    runtime-versions:
      nodejs: 18
    commands:
      - npm install -g pnpm@8
      
  pre_build:
    commands:
      - echo "Installing dependencies..."
      - pnpm install --frozen-lockfile
      
  build:
    commands:
      - echo "Running type check..."
      - pnpm typecheck
      - echo "Running tests..."
      - pnpm test:ci
      - echo "Building packages..."
      - pnpm build
      
  post_build:
    commands:
      - echo "Build completed on `date`"
      
artifacts:
  files:
    - 'packages/*/dist/**/*'
    - 'sdks/*/dist/**/*'
  name: izion-sdk-build-$(date +%Y-%m-%d)
  
cache:
  paths:
    - node_modules/**/*
    - packages/*/node_modules/**/*
    - sdks/*/node_modules/**/*
```

### 4. Package Publishing

```bash
# Publish tất cả packages changed
pnpm changeset publish

# Publish package cụ thể
pnpm publish --filter=@izion/payment-sdk

# Publish với tag
pnpm publish --filter=@izion/payment-sdk --tag beta

# Dry run
pnpm publish --filter=@izion/payment-sdk --dry-run
```

### 5. Environment Configuration

**Development**:
```bash
# .env.development
NODE_ENV=development
API_URL=https://dev-api.izion.com
ENABLE_SECURITY=false
DEBUG_MODE=true
ENCRYPTION_KEY=dev-key-123
```

**Production**:
```bash
# .env.production
NODE_ENV=production
API_URL=https://api.izion.com
ENABLE_SECURITY=true
DEBUG_MODE=false
ENCRYPTION_KEY=${AWS_SECRET_ENCRYPTION_KEY}
```

### 6. Monitoring và Debugging

**Build monitoring**:
```typescript
// scripts/build-monitor.js
const { execSync } = require('child_process');

function buildWithMetrics() {
  const start = Date.now();
  
  try {
    execSync('pnpm build', { stdio: 'inherit' });
    const duration = Date.now() - start;
    console.log(`✅ Build completed in ${duration}ms`);
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

buildWithMetrics();
```

---

## 📝 Best Practices

1. **Always run tests before committing**
2. **Use conventional commits for better changelogs**
3. **Keep packages focused and single-purpose**
4. **Document new features and breaking changes**
5. **Use TypeScript strictly - no `any` types**
6. **Test security features in isolated environments**
7. **Keep dependencies up to date**
8. **Use Turborepo cache for faster builds**

## 🆘 Troubleshooting

### Build Issues

```bash
# Clear cache và rebuild
pnpm clean
rm -rf node_modules
pnpm install
pnpm build

# Debug specific package
pnpm build --filter=@izion/api --verbose

# Check dependency graph
pnpm list --depth=0
```

### Security Issues

```bash
# Disable security for development
export DISABLE_SECURITY=true
pnpm dev

# Test security features
node scripts/test-security.js
```

### Performance Issues

```bash
# Analyze bundle sizes
pnpm build --analyze

# Profile build time
pnpm build --profile

# Check for circular dependencies
pnpm madge --circular packages/*/src
```
