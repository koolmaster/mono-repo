# 🚀 Izion Payment SDK - Complete React Project Structure

A comprehensive payment SDK built with professional React project architecture, featuring TypeScript, validation utilities, formatting helpers, and React hooks.

## 📁 Project Structure

```
src/
├── 📁 types/          # TypeScript type definitions
│   ├── common.ts      # Common application types
│   ├── payment.ts     # Payment-specific types
│   └── index.ts       # Type exports
├── 📁 constants/      # Configuration and constants
│   └── index.ts       # Payment constants, currencies, patterns
├── 📁 utils/          # Utility functions
│   ├── validation.ts  # Payment validation functions
│   ├── formatting.ts  # Currency, date, number formatting
│   ├── storage.ts     # LocalStorage/SessionStorage helpers
│   ├── helpers.ts     # General utility functions
│   └── index.ts       # Utility exports
├── 📁 hooks/          # React hooks
│   ├── useValidation.ts  # Form validation hook
│   ├── usePayment.ts     # Payment processing hook
│   ├── useFormatting.ts  # Formatting utilities hook
│   └── index.ts          # Hook exports
├── 📁 services/       # API services
│   ├── PaymentAPI.ts  # Payment API client
│   └── index.ts       # Service exports
├── 📁 components/     # React components (planned)
├── 📁 features/       # Feature modules (planned)
├── 📁 lib/           # External library integrations
├── 📁 assets/        # Static assets
│   ├── icons/
│   └── images/
├── 📁 styles/        # CSS/SCSS styles
│   ├── components/
│   ├── pages/
│   └── themes/
└── index.ts          # Main SDK exports
```

## 🛠️ Core Features

### 🔧 TypeScript Type Safety
- **PaymentConfig**: SDK configuration interface
- **PaymentData**: Payment transaction data structure  
- **PaymentResult**: Payment processing results
- **ValidationError**: Validation error handling
- **APIResponse**: Standardized API response format

### 📊 Constants Management
- **Payment Methods**: Credit card, bank transfer, e-wallet, crypto
- **Supported Currencies**: USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY, VND, THB, SGD, KRW
- **Validation Patterns**: Email, phone, API key, URL validation
- **API Endpoints**: Centralized endpoint configuration
- **Error Codes**: Standardized error handling

### ✅ Validation Utilities
```typescript
// Email validation
validateEmail(email: string): boolean

// Payment data validation
validatePaymentData(data: PaymentData): PaymentValidationResult

// Amount validation
validateAmount(amount: number): boolean

// Currency validation
validateCurrency(currency: string): boolean
```

### 🎨 Formatting Utilities
```typescript
// Currency formatting with internationalization
formatCurrency(amount: number, currency?: string, locale?: string): string

// Date formatting with multiple formats
formatDate(date: Date | string, format?: 'short' | 'medium' | 'long' | 'full'): string

// Number formatting with custom options
formatNumber(value: number, options?: object): string

// Relative time formatting
formatRelativeTime(date: Date | string): string
```

### 💾 Storage Management
```typescript
// LocalStorage with automatic prefixing
storage.set(key: string, value: any): void
storage.get<T>(key: string): T | null

// SessionStorage utilities
sessionStorage.set(key: string, value: any): void
sessionStorage.get<T>(key: string): T | null

// Payment-specific storage
storage.setPaymentSession(data: PaymentData): void
storage.getPaymentSession(): PaymentData | null

// Cache management with TTL
storage.setCache(key: string, data: any, ttl?: number): void
storage.getCache(key: string): any | null
```

### 🎣 React Hooks

#### useValidation Hook
```typescript
const {
  errors,
  isValid,
  isValidating,
  validate,
  validateField,
  clearErrors,
  setFieldError
} = useValidation({
  validateOnChange: true,
  debounceMs: 300
});
```

#### usePayment Hook  
```typescript
const {
  paymentData,
  isProcessing,
  isValid,
  errors,
  currentStatus,
  updatePaymentData,
  processPayment,
  clearPayment,
  setAmount,
  setCurrency
} = usePayment({
  config: paymentConfig,
  onSuccess: (result) => console.log('Payment success:', result),
  onError: (error) => console.error('Payment error:', error)
});
```

#### useFormatting Hook
```typescript
const {
  currency,
  date,
  shortDate,
  dateTime,
  number,
  percentage,
  currentLocale,
  currentCurrency
} = useFormatting({
  locale: 'en-US',
  currency: 'USD'
});
```

### 🌐 API Services
```typescript
// Create API client
const api = new PaymentAPI(config);

// Process payment
const result = await api.createPayment(paymentData);

// Get payment status
const status = await api.getPaymentStatus(paymentId);

// Get payment history
const history = await api.getPaymentHistory({
  page: 1,
  limit: 10,
  status: 'completed'
});

// Cancel payment
const cancelResult = await api.cancelPayment(paymentId);

// Refund payment
const refundResult = await api.refundPayment(paymentId, amount, reason);
```

## 📦 Installation & Setup

```bash
# Install dependencies
pnpm install

# Build the project
pnpm run build

# Run type checking
npx tsc --noEmit

# Run in development mode
pnpm run dev
```

## 🚀 Quick Start

```typescript
import { usePayment, PaymentConfig } from '@izion/payment-sdk';

const config: PaymentConfig = {
  apiKey: 'your-api-key',
  baseURL: 'https://api.izion.com',
  currency: 'USD',
  theme: 'light'
};

function PaymentForm() {
  const {
    paymentData,
    updatePaymentData,
    processPayment,
    isProcessing,
    errors
  } = usePayment({
    config,
    onSuccess: (result) => {
      console.log('Payment successful:', result.transactionId);
    }
  });

  return (
    <form>
      <input
        type="number"
        value={paymentData.amount || ''}
        onChange={(e) => updatePaymentData({ amount: Number(e.target.value) })}
        placeholder="Amount"
      />
      <button
        type="button"
        onClick={() => processPayment()}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}
```

## 🌍 Internationalization Support

- **Currencies**: 12+ supported currencies with proper formatting
- **Languages**: English, Vietnamese, Spanish, French, German, Japanese, Korean
- **Date Formats**: Locale-aware date and time formatting
- **Number Formats**: Thousand separators, decimal places by locale

---

**Version**: 1.0.0  
**Last Updated**: August 2024  
**License**: MITyment processing SDK

## Installation

```bash
pnpm install @izion/payment-sdk
```

## Usage

```typescript
import { PaymentSDK } from "@izion/payment-sdk";

const sdk = new PaymentSDK();
```