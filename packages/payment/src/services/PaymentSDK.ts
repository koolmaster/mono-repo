import { PaymentConfig, PaymentData, PaymentResult } from '../types';
import { PaymentAPI, createPaymentAPI } from '../services';
import { validatePaymentData } from '../utils/validation';
import { formatCurrency } from '../utils/formatting';
import { storage } from '../utils/storage';
import { utils } from '../utils/helpers';
import { security } from '../lib/security';

export class PaymentSDK {
  private config: PaymentConfig;
  private apiClient: PaymentAPI;
  private isInitialized: boolean = false;

  constructor(config: PaymentConfig) {
    this.config = {
      theme: 'light',
      language: 'en',
      currency: 'USD',
      enableSecurity: false,
      timeout: 30000,
      retryAttempts: 3,
      ...config
    };

    // Initialize API client using our service layer
    this.apiClient = createPaymentAPI(this.config);

    this.initializeSDK();
  }

  private async initializeSDK(): Promise<void> {
    try {
      // Apply security if enabled
      if (this.config.enableSecurity) {
        this.initSecurity();
      }

      // Load stored session
      await this.loadSession();
      
      this.isInitialized = true;
      console.log('💳 Payment SDK initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Payment SDK:', error);
    }
  }

  private initSecurity(): void {
    console.log('🔒 Initializing Payment SDK Security...');
    security.initializeAll();
  }

  private async loadSession(): Promise<void> {
    try {
      const sessionData = storage.getPaymentSession();
      if (sessionData) {
        console.log('📂 Loaded payment session');
        // Restore session if valid
      }
    } catch (error) {
      console.warn('Could not load payment session:', error);
    }
  }

  // Process payment with full validation and API integration
  async processPayment(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      if (!this.isInitialized) {
        throw new Error('SDK not initialized');
      }

      // Validate payment data using our validation utility
      const validation = validatePaymentData(paymentData);
      if (!validation.isValid) {
        return {
          success: false,
          error: Object.values(validation.errors || {}).join(', ')
        };
      }

      // Generate transaction ID
      const transactionId = utils.generateId('txn');

      // Prepare payment data
      const completePaymentData: PaymentData = {
        ...paymentData,
        customerId: paymentData.customerId || this.config.customerId,
        currency: paymentData.currency || this.config.currency || 'USD',
        metadata: {
          ...paymentData.metadata,
          sdk_version: this.getVersion(),
          timestamp: new Date().toISOString()
        }
      };

      // Store transaction data
      storage.set(`payment_${transactionId}`, {
        ...completePaymentData,
        transactionId,
        status: 'pending',
        createdAt: Date.now()
      });

      console.log('💳 Processing payment:', completePaymentData);

      // Make API call using our service layer
      const result = await this.apiClient.createPayment(completePaymentData);

      // Update stored data with result
      storage.set(`payment_${transactionId}`, {
        ...completePaymentData,
        transactionId,
        status: 'completed',
        result,
        completedAt: Date.now()
      });

      return {
        ...result,
        transactionId
      };

    } catch (error: any) {
      console.error('💥 Payment processing failed:', error);
      
      return {
        success: false,
        error: error.message || 'Payment failed'
      };
    }
  }

  // Get payment status
  async getPaymentStatus(transactionId: string): Promise<{ status: string }> {
    try {
      return await this.apiClient.getPaymentStatus(transactionId);
    } catch (error) {
      console.error('Failed to get payment status:', error);
      throw error;
    }
  }

  // Cancel payment
  async cancelPayment(transactionId: string): Promise<{ success: boolean }> {
    try {
      const result = await this.apiClient.cancelPayment(transactionId);
      
      // Clear stored data
      storage.remove(`payment_${transactionId}`);
      
      return result;
    } catch (error) {
      console.error('Failed to cancel payment:', error);
      throw error;
    }
  }

  // Refund payment
  async refundPayment(transactionId: string, amount?: number, reason?: string): Promise<{ success: boolean; refundId: string }> {
    try {
      return await this.apiClient.refundPayment(transactionId, amount, reason);
    } catch (error) {
      console.error('Failed to refund payment:', error);
      throw error;
    }
  }

  // Get payment history
  async getPaymentHistory(filters?: {
    page?: number;
    limit?: number;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    customerId?: string;
  }): Promise<any> {
    try {
      return await this.apiClient.getPaymentHistory(filters);
    } catch (error) {
      console.error('Failed to get payment history:', error);
      throw error;
    }
  }

  // Format currency for display using our formatting utility
  formatCurrency(amount: number, currency?: string): string {
    return formatCurrency(amount, currency || this.config.currency || 'USD');
  }

  // Get exchange rates
  async getExchangeRates(baseCurrency?: string): Promise<Record<string, number>> {
    try {
      return await this.apiClient.getExchangeRates(baseCurrency || this.config.currency || 'USD');
    } catch (error) {
      console.error('Failed to get exchange rates:', error);
      throw error;
    }
  }

  // Get payment methods
  async getPaymentMethods(): Promise<Array<any>> {
    try {
      return await this.apiClient.getPaymentMethods();
    } catch (error) {
      console.error('Failed to get payment methods:', error);
      throw error;
    }
  }

  // Get account information
  async getAccountInfo(): Promise<any> {
    try {
      return await this.apiClient.getAccountInfo();
    } catch (error) {
      console.error('Failed to get account info:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: 'ok' | 'error'; timestamp: string; version: string }> {
    try {
      return await this.apiClient.healthCheck();
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        version: this.getVersion()
      };
    }
  }

  // Clear all payment data
  clearSession(): void {
    storage.clearPaymentSession();
    console.log('🗑️ Payment session cleared');
  }

  // Get SDK configuration
  getConfig(): PaymentConfig {
    return { ...this.config };
  }

  // Update configuration
  updateConfig(newConfig: Partial<PaymentConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Recreate API client with new config
    this.apiClient = createPaymentAPI(this.config);
    
    console.log('⚙️ Payment SDK config updated');
  }

  // Get SDK version
  getVersion(): string {
    return '1.0.0';
  }

  // Check if SDK is initialized
  isReady(): boolean {
    return this.isInitialized;
  }

  // Get current theme
  getTheme(): 'light' | 'dark' {
    return this.config.theme || 'light';
  }

  // Set theme
  setTheme(theme: 'light' | 'dark'): void {
    this.config.theme = theme;
    storage.setTheme(theme);
  }

  // Get current language
  getLanguage(): string {
    return this.config.language || 'en';
  }

  // Set language
  setLanguage(language: string): void {
    this.config.language = language;
    storage.setLanguage(language);
  }

  // Cleanup resources
  destroy(): void {
    this.clearSession();
    this.isInitialized = false;
    console.log('💳 Payment SDK destroyed');
  }
}
