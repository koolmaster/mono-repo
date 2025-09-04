export interface PaymentConfig {
  apiKey: string;
  baseURL: string;
  enableSecurity?: boolean;
  theme?: 'light' | 'dark';
  language?: string;
  currency?: string;
  customerId?: string;
  allowedOrigins?: string[];
  timeout?: number;
  retryAttempts?: number;
}

export interface PaymentData {
  amount: number;
  currency: string;
  description?: string;
  customerEmail?: string;
  customerId?: string;
  metadata?: Record<string, any>;
  paymentMethod?: PaymentMethod;
  billingAddress?: BillingAddress;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  error?: string;
  redirectUrl?: string;
  status?: PaymentStatus;
  timestamp?: string;
}

export interface PaymentMethod {
  type: 'card' | 'bank_transfer' | 'e_wallet' | 'crypto';
  provider?: string;
  details?: Record<string, any>;
}

export interface BillingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface PaymentHistory {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description?: string;
  customerEmail?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface PaymentValidationResult {
  isValid: boolean;
  errors?: Record<string, string>;
  validationErrors?: ValidationError[];
}

export type PaymentStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'cancelled' 
  | 'refunded' 
  | 'expired';

export type PaymentTheme = 'light' | 'dark' | 'auto';

export type PaymentLanguage = 'en' | 'vi' | 'es' | 'fr' | 'de' | 'ja' | 'ko';

export type Currency = 
  | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD' 
  | 'CHF' | 'CNY' | 'VND' | 'THB' | 'SGD' | 'KRW';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: ValidationError[];
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface PaymentStats {
  totalTransactions: number;
  totalRevenue: number;
  successRate: number;
  averageAmount: number;
  pendingPayments: number;
  todayRevenue: number;
  monthlyRevenue: number;
  topCurrencies: Array<{
    currency: string;
    amount: number;
    count: number;
  }>;
}

export interface EmbedConfig {
  embedMode: boolean;
  hideHeader: boolean;
  hideFooter: boolean;
  customStyles?: string;
  allowPostMessage: boolean;
  parentOrigin?: string;
}

export interface SecurityConfig {
  enableAntiDebug: boolean;
  blockF12: boolean;
  preventRightClick: boolean;
  preventTextSelection: boolean;
  enableCSP: boolean;
  trustedOrigins: string[];
}
