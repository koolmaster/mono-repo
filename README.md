# Izion SDK Monorepo

A high-security monorepo for web SDKs with React, TypeScript, and advanced security features. This monorepo supports multiple SDK packages (payment, bank, game, etc.) with shared components, utilities, and security features.

## 🚀 Features

- **High Security**: Anti-debugging, F12 blocking, context menu disabling
- **Multi-SDK Support**: Easy creation and management of multiple SDK packages
- **Modern Tech Stack**: React, TypeScript, Vite, Turborepo, pnpm workspaces
- **Comprehensive Testing**: Unit tests with Vitest, E2E tests with Playwright
- **Manual Testing**: Storybook for component development and testing
- **Automation**: Husky, Changesets, ESLint, Prettier
- **AWS Deployment**: CodePipeline, CodeBuild, CodeCommit integration

## 📁 Project Structure

```
izion-sdk/
├── .github/                    # GitHub workflows and templates
├── packages/                   # Shared packages
│   ├── shared/                # Common utilities, types, constants
│   ├── ui/                    # Shared UI components
│   ├── api/                   # API client with interceptors
│   └── security/              # Advanced security features
├── sdks/                      # Individual SDK packages
│   ├── payment/               # Payment processing SDK
│   ├── bank/                  # Banking services SDK
│   └── game/                  # Gaming features SDK
├── apps/                      # Example applications
├── tools/                     # Build tools and utilities
├── scripts/                   # Automation scripts
│   └── create-sdk.js          # Template generator for new SDKs
├── package.json               # Root package configuration
├── turbo.json                 # Turborepo configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

### 📦 Packages Overview

#### `/packages/shared`
**Mục đích**: Chứa các utilities, types, constants, và helper functions được chia sẻ giữa các SDK
**Nội dung**:
- Type definitions (IzionConfig, ApiResponse, BaseSDKOptions)
- Utility functions (UUID generation, error formatting, validation)
- Storage management (LocalStorage wrapper với encryption)
- Security utilities (basic encryption/decryption)
- Constants và enums chung

#### `/packages/ui`
**Mục đích**: Shared UI components được sử dụng trong tất cả các SDK
**Nội dung**:
- Button, Input, Modal, Loader components
- Layout components (Header, Sidebar, Grid)
- Form components với validation
- Theme provider và styling utilities
- Storybook stories cho manual testing

#### `/packages/api`
**Mục đích**: API client với interceptors, authentication, và error handling
**Nội dung**:
- Axios instance với pre-configured interceptors
- Request/response encryption/decryption
- Automatic retry logic với exponential backoff
- Token refresh mechanism
- Error handling và logging

#### `/packages/security`
**Mục đích**: Advanced security features để ngăn chặn developer tools và debugging
**Nội dung**:
- Anti-debugger detection
- F12, right-click, keyboard shortcuts blocking
- Console obfuscation
- Developer tools detection
- Content protection mechanisms

### 🎯 SDK Packages

#### `/sdks/payment`
**Mục đích**: SDK cho payment processing
**Features**:
- Payment form components
- Credit card validation
- Payment gateway integration
- Transaction history
- Secure payment processing

#### `/sdks/bank`
**Mục đích**: SDK cho banking services
**Features**:
- Account management
- Transaction processing
- Balance inquiries
- Banking security features
- Financial reporting

#### `/sdks/game`
**Mục đích**: SDK cho gaming features
**Features**:
- Game state management
- Player authentication
- Leaderboards
- In-game purchases
- Game analytics

## 🛠️ Tech Stack

### Core Technologies
- **React 18**: UI framework với modern features
- **TypeScript**: Type safety và developer experience
- **Vite**: Fast build tool và development server
- **SCSS**: CSS preprocessing với variables và mixins

### Monorepo Management
- **pnpm workspaces**: Efficient package management
- **Turborepo**: Build system optimization và caching
- **Changesets**: Version management và release automation

### Security & Quality
- **ESLint**: Code linting với security rules
- **Prettier**: Code formatting
- **Husky**: Git hooks automation
- **Vitest**: Unit testing framework
- **Playwright**: End-to-end testing

### Development Tools
- **Storybook**: Component development và manual testing
- **TypeScript**: Static type checking
- **SCSS**: Styling với preprocessing
- **Axios**: HTTP client với interceptors

### Deployment & CI/CD
- **AWS CodePipeline**: Continuous integration
- **AWS CodeBuild**: Build automation
- **AWS CodeCommit**: Source control

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd izion-sdk

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### Development
```bash
# Start development mode for all packages
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Lint code
pnpm lint

# Format code
pnpm format
```

## 📋 Available Scripts

### Root Level Scripts
- `pnpm dev` - Start development mode cho tất cả packages
- `pnpm build` - Build tất cả packages
- `pnpm test` - Run unit tests cho tất cả packages
- `pnpm test:e2e` - Run E2E tests
- `pnpm lint` - Lint code trong tất cả packages
- `pnpm format` - Format code với Prettier
- `pnpm clean` - Clean build artifacts
- `pnpm create-sdk <name>` - Tạo SDK mới từ template

### Individual Package Scripts
Trong mỗi package/SDK directory:
- `pnpm dev` - Development mode cho package đó
- `pnpm build` - Build package đó
- `pnpm test` - Run tests cho package đó
- `pnpm storybook` - Start Storybook (cho UI packages)

## 🔧 Creating New SDKs

Sử dụng script template để tạo SDK mới:

```bash
# Create new SDK
pnpm create-sdk <sdk-name> [description]

# Examples
pnpm create-sdk payment "Payment processing SDK"
pnpm create-sdk ecommerce "E-commerce features SDK"
pnpm create-sdk analytics "Analytics and tracking SDK"
```

Script sẽ tự động tạo:
- Package structure với src/, components/, context/, styles/
- package.json với dependencies và scripts
- TypeScript configuration
- Basic React components
- README với documentation
- Test setup

## 🔒 Security Features

### Developer Tools Blocking
- F12 key blocking
- Right-click context menu disabled
- Ctrl+Shift+I, Ctrl+U, Ctrl+Shift+C blocking
- Developer tools detection với automatic redirect

### Data Protection
- Request/response encryption
- Secure storage với encryption
- API key protection
- Session management với auto-refresh

### Content Protection
- Text selection disabled
- Drag and drop disabled
- Console obfuscation
- Anti-debugging techniques

## 🧪 Testing Strategy

### Unit Testing (Vitest)
- Test individual components và functions
- Mock external dependencies
- Code coverage reporting
- Fast feedback loop

### E2E Testing (Playwright)
- Test complete user workflows
- Cross-browser testing
- Visual regression testing
- Performance monitoring

### Manual Testing (Storybook)
- Interactive component development
- Visual testing của UI components
- Documentation và examples
- Design system validation

## 📚 Development Guidelines

### Code Organization
- Mỗi SDK có riêng context, components, styles
- Shared utilities trong packages/shared
- Reusable UI components trong packages/ui
- API logic tập trung trong packages/api

### Security Best Practices
- Luôn encrypt sensitive data
- Validate inputs ở cả client và server
- Sử dụng security headers
- Regular security audits

### Performance Optimization
- Code splitting cho từng SDK
- Tree shaking để remove unused code
- Bundle size monitoring
- Caching strategies

## 🚀 Deployment

### AWS CodePipeline Setup
1. Connect repository với CodeCommit
2. Configure build stages trong CodeBuild
3. Set up deployment targets
4. Configure environment variables

### Environment Configuration
- Development: Local development với hot reload
- Staging: Testing environment với production-like setup
- Production: Optimized builds với security features enabled

### Domain Setup
Mỗi SDK có thể deploy trên domain riêng:
- payment.izion.com
- bank.izion.com  
- game.izion.com

## 📋 Roadmap

### Phase 1: Foundation ✅
- [x] Monorepo setup với Turborepo
- [x] Basic packages (shared, ui, api, security)
- [x] SDK template generator
- [x] Security features implementation

### Phase 2: Enhancement 🚧
- [ ] Advanced Storybook setup
- [ ] Comprehensive test coverage
- [ ] Performance optimization
- [ ] Documentation website

### Phase 3: Production 📅
- [ ] AWS deployment pipeline
- [ ] Monitoring và logging
- [ ] Error tracking
- [ ] Performance analytics

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Make changes và test thoroughly
4. Commit với conventional commit format
5. Push và create Pull Request

### Commit Convention
```
type(scope): description

feat(payment): add credit card validation
fix(security): resolve F12 blocking issue
docs(readme): update installation guide
```

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- **Issues**: Create GitHub issue với detailed description
- **Documentation**: Check package README files
- **Security**: Report security issues privately

---

**Built with ❤️ by Izion Team**
