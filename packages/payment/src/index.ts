// Export all types
export * from './types';

// Export all constants
export * from './constants';

// Export utilities (excluding conflicting types)
export {
  validatePaymentData,
  validateEmail,
  validatePhone,
  validateApiKey,
  validateAmount,
  validateCurrency
} from './utils/validation';

export {
  formatCurrency,
  formatDate,
  formatNumber,
  formatRelativeTime
} from './utils/formatting';

export {
  storage,
  sessionStorage
} from './utils/storage';

export {
  utils
} from './utils/helpers';

// Export all hooks
export * from './hooks';

// Export all services
export * from './services';

// Export library utilities
export * from './lib';

// Export main SDK class (from services)
export { PaymentSDK } from './services/PaymentSDK';
export { createPaymentSDK } from './services';

// Default export
export { PaymentSDK as default } from './services/PaymentSDK';

// Version
export const VERSION = '1.0.0';