export const PAYMENT_CONSTANTS = {
  // API
  DEFAULT_TIMEOUT: 30000,
  MAX_RETRY_ATTEMPTS: 3,
  API_VERSION: 'v1',
  
  // Validation
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 1000000,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_API_KEY_LENGTH: 32,
  
  // UI
  DEFAULT_CURRENCY: 'USD',
  DEFAULT_LANGUAGE: 'en',
  DEFAULT_THEME: 'light',
  
  // Security
  F12_BLOCK_MESSAGE: 'Developer tools are disabled for security reasons',
  RIGHT_CLICK_BLOCK_MESSAGE: 'Right-click is disabled on payment forms',
  
  // Storage
  STORAGE_PREFIX: 'izion_payment_',
  SESSION_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
  
  // Embed
  IFRAME_MIN_HEIGHT: 400,
  IFRAME_MAX_HEIGHT: 800,
  POPUP_WIDTH: 800,
  POPUP_HEIGHT: 600,
} as const;

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
] as const;

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
] as const;

export const PAYMENT_METHODS = [
  { type: 'card', name: 'Credit/Debit Card', icon: '💳' },
  { type: 'bank_transfer', name: 'Bank Transfer', icon: '🏦' },
  { type: 'e_wallet', name: 'E-Wallet', icon: '📱' },
  { type: 'crypto', name: 'Cryptocurrency', icon: '₿' },
] as const;

export const PAYMENT_STATUSES = [
  { value: 'pending', label: 'Pending', color: '#ffc107', icon: '⏳' },
  { value: 'processing', label: 'Processing', color: '#17a2b8', icon: '⚡' },
  { value: 'completed', label: 'Completed', color: '#28a745', icon: '✅' },
  { value: 'failed', label: 'Failed', color: '#dc3545', icon: '❌' },
  { value: 'cancelled', label: 'Cancelled', color: '#6c757d', icon: '🚫' },
  { value: 'refunded', label: 'Refunded', color: '#fd7e14', icon: '↩️' },
  { value: 'expired', label: 'Expired', color: '#6f42c1', icon: '⏰' },
] as const;

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/',
  PAYMENTS: '/payments',
  SETTINGS: '/settings',
  UNAUTHORIZED: '/unauthorized',
} as const;

export const LOCAL_STORAGE_KEYS = {
  PAYMENT_SESSION: 'payment_session',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  API_CACHE: 'api_cache',
} as const;

export const API_ENDPOINTS = {
  PAYMENTS: '/payments',
  PAYMENT_STATUS: (id: string) => `/payments/${id}`,
  PAYMENT_CANCEL: (id: string) => `/payments/${id}/cancel`,
  PAYMENT_REFUND: (id: string) => `/payments/${id}/refund`,
  PAYMENT_HISTORY: '/payments/history',
  STATS: '/stats',
  CONFIG: '/config',
} as const;

export const POST_MESSAGE_TYPES = {
  PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
  PAYMENT_ERROR: 'PAYMENT_ERROR',
  PAYMENT_START: 'PAYMENT_START',
  PAYMENT_CANCEL: 'PAYMENT_CANCEL',
  CONFIG_UPDATE: 'PAYMENT_CONFIG_UPDATE',
  IFRAME_READY: 'IFRAME_READY',
  THEME_CHANGE: 'THEME_CHANGE',
  RESIZE_REQUEST: 'RESIZE_REQUEST',
} as const;

export const SECURITY_RULES = {
  BLOCKED_KEYS: ['F12', 'I', 'J', 'U'],
  BLOCKED_KEY_COMBINATIONS: [
    { ctrl: true, shift: true, key: 'I' }, // DevTools
    { ctrl: true, shift: true, key: 'J' }, // Console
    { ctrl: true, key: 'U' }, // View Source
    { key: 'F12' }, // DevTools
  ],
  SENSITIVE_SELECTORS: [
    '.payment-form',
    '.payment-sensitive',
    '.sensitive-field',
    '.api-key-field',
  ],
} as const;

export const THEME_COLORS = {
  light: {
    primary: '#667eea',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40',
  },
  dark: {
    primary: '#7c3aed',
    secondary: '#64748b',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#06b6d4',
    light: '#1f2937',
    dark: '#f9fafb',
  },
} as const;

export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  API_KEY: /^[a-zA-Z0-9]{32,}$/,
  CARD_NUMBER: /^[0-9]{13,19}$/,
  CVV: /^[0-9]{3,4}$/,
  POSTAL_CODE: /^[A-Za-z0-9\s\-]{3,10}$/,
} as const;

export const ERROR_CODES = {
  // Authentication
  INVALID_API_KEY: 'INVALID_API_KEY',
  UNAUTHORIZED_ORIGIN: 'UNAUTHORIZED_ORIGIN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Validation
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  INVALID_CURRENCY: 'INVALID_CURRENCY',
  INVALID_EMAIL: 'INVALID_EMAIL',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  
  // Payment
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  PAYMENT_DECLINED: 'PAYMENT_DECLINED',
  PAYMENT_TIMEOUT: 'PAYMENT_TIMEOUT',
  
  // Network
  NETWORK_ERROR: 'NETWORK_ERROR',
  API_ERROR: 'API_ERROR',
  CONNECTION_TIMEOUT: 'CONNECTION_TIMEOUT',
  
  // System
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  MAINTENANCE_MODE: 'MAINTENANCE_MODE',
} as const;
