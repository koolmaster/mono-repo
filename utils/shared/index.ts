// Types
export interface IzionConfig {
  apiUrl: string;
  apiKey: string;
  environment: 'development' | 'production' | 'staging';
  security: {
    encryptionKey: string;
    enableDevToolsBlocking: boolean;
    enableContextMenuBlocking: boolean;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: string;
}

export interface BaseSDKOptions {
  config: IzionConfig;
  debug?: boolean;
}

// Constants
export const IZION_CONSTANTS = {
  SDK_VERSION: '1.0.0',
  API_TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  STORAGE_PREFIX: 'izion_',
} as const;

// Utils
export * from './utils';
export * from './security';
export * from './storage';
export * from './validation';

// Export specific classes and instances
export { SecurityManager } from './security';
export { storage } from './storage';
