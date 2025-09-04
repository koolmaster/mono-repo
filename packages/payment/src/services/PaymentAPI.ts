import { PaymentConfig, PaymentData, PaymentResult, PaymentHistory, APIResponse } from '../types';

export class PaymentAPI {
  private config: PaymentConfig;
  private baseURL: string;
  private apiKey: string;

  constructor(config: PaymentConfig) {
    this.config = config;
    this.baseURL = config.baseURL;
    this.apiKey = config.apiKey;
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'X-API-Version': 'v1',
      'X-SDK-Version': '1.0.0',
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const timeout = this.config.timeout || 30000;
    
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Payment operations
  async createPayment(paymentData: PaymentData): Promise<PaymentResult> {
    const response = await this.makeRequest<PaymentResult>('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });

    if (!response.success) {
      throw new Error(response.error || 'Payment creation failed');
    }

    return response.data!;
  }

  async getPayment(paymentId: string): Promise<PaymentResult> {
    const response = await this.makeRequest<PaymentResult>(`/payments/${paymentId}`, {
      method: 'GET',
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch payment');
    }

    return response.data!;
  }

  async getPaymentStatus(paymentId: string): Promise<{ status: string }> {
    const response = await this.makeRequest<{ status: string }>(`/payments/${paymentId}/status`, {
      method: 'GET',
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch payment status');
    }

    return response.data!;
  }

  async cancelPayment(paymentId: string): Promise<{ success: boolean }> {
    const response = await this.makeRequest<{ success: boolean }>(`/payments/${paymentId}/cancel`, {
      method: 'POST',
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to cancel payment');
    }

    return response.data!;
  }

  async refundPayment(
    paymentId: string, 
    amount?: number, 
    reason?: string
  ): Promise<{ success: boolean; refundId: string }> {
    const response = await this.makeRequest<{ success: boolean; refundId: string }>(
      `/payments/${paymentId}/refund`,
      {
        method: 'POST',
        body: JSON.stringify({ amount, reason }),
      }
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to refund payment');
    }

    return response.data!;
  }

  // Payment history
  async getPaymentHistory(params: {
    page?: number;
    limit?: number;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    customerId?: string;
  } = {}): Promise<{
    payments: PaymentHistory[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    const endpoint = `/payments/history${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await this.makeRequest<{
      payments: PaymentHistory[];
      pagination: any;
    }>(endpoint, {
      method: 'GET',
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch payment history');
    }

    return response.data!;
  }

  // Customer operations
  async getCustomerPayments(customerId: string): Promise<PaymentHistory[]> {
    const response = await this.makeRequest<PaymentHistory[]>(`/customers/${customerId}/payments`, {
      method: 'GET',
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch customer payments');
    }

    return response.data!;
  }

  // Webhook operations
  async verifyWebhook(payload: string, signature: string): Promise<boolean> {
    const response = await this.makeRequest<{ valid: boolean }>('/webhooks/verify', {
      method: 'POST',
      body: JSON.stringify({ payload, signature }),
    });

    return response.success && response.data?.valid === true;
  }

  // Payment methods
  async getPaymentMethods(): Promise<Array<{
    type: string;
    name: string;
    supported: boolean;
    fees?: {
      fixed?: number;
      percentage?: number;
    };
  }>> {
    const response = await this.makeRequest<Array<{
      type: string;
      name: string;
      supported: boolean;
      fees?: any;
    }>>('/payment-methods', {
      method: 'GET',
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch payment methods');
    }

    return response.data!;
  }

  // Currency and rates
  async getExchangeRates(baseCurrency: string = 'USD'): Promise<Record<string, number>> {
    const response = await this.makeRequest<Record<string, number>>(`/rates?base=${baseCurrency}`, {
      method: 'GET',
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch exchange rates');
    }

    return response.data!;
  }

  // Account information
  async getAccountInfo(): Promise<{
    accountId: string;
    balance: number;
    currency: string;
    limits: {
      daily: number;
      monthly: number;
    };
  }> {
    const response = await this.makeRequest<{
      accountId: string;
      balance: number;
      currency: string;
      limits: any;
    }>('/account', {
      method: 'GET',
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch account info');
    }

    return response.data!;
  }

  // Health check
  async healthCheck(): Promise<{
    status: 'ok' | 'error';
    timestamp: string;
    version: string;
  }> {
    const response = await this.makeRequest<{
      status: 'ok' | 'error';
      timestamp: string;
      version: string;
    }>('/health', {
      method: 'GET',
    });

    return response.data || {
      status: 'error',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  }
}
