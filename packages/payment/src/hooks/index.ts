// Export all hooks
export * from './useValidation';
export * from './usePayment';
export * from './useFormatting';

// Re-export commonly used hooks with shorter names
export { useValidation as useValidator } from './useValidation';
export { usePayment as usePaymentProcessor } from './usePayment';
export { useFormatting as useFormatter } from './useFormatting';
