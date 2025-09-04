// Export all services
export * from './PaymentAPI';
export * from './PaymentSDK';

// Create factory function for easy instantiation
import { PaymentAPI } from './PaymentAPI';
import { PaymentSDK } from './PaymentSDK';
import { PaymentConfig } from '../types';

export const createPaymentAPI = (config: PaymentConfig): PaymentAPI => {
  return new PaymentAPI(config);
};

export const createPaymentSDK = (config: PaymentConfig): PaymentSDK => {
  return new PaymentSDK(config);
};

// Service types
export interface ServiceConfig {
  retryAttempts?: number;
  retryDelay?: number;
  enableCaching?: boolean;
  cacheTimeout?: number;
}

// Default service configuration
export const DEFAULT_SERVICE_CONFIG: ServiceConfig = {
  retryAttempts: 3,
  retryDelay: 1000,
  enableCaching: true,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
};
