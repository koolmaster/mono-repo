import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { IzionConfig, ApiResponse, SecurityManager, storage } from '@izion/shared';

export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  skipEncryption?: boolean;
  retryCount?: number;
  _retry?: boolean;
  _isRetry?: boolean;
}

export class ApiClient {
  private axiosInstance: AxiosInstance;
  private config: IzionConfig;
  private securityManager: SecurityManager;

  constructor(config: IzionConfig) {
    this.config = config;
    this.securityManager = new SecurityManager(config.security.encryptionKey);
    
    this.axiosInstance = axios.create({
      baseURL: config.apiUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'X-SDK-Version': '1.0.0',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const requestConfig = config as RequestConfig;
        
        // Add API key to headers
        if (!requestConfig.skipAuth) {
          config.headers['Authorization'] = `Bearer ${this.config.apiKey}`;
        }

        // Add request timestamp
        config.headers['X-Request-Time'] = Date.now().toString();

        // Encrypt sensitive data
        if (!requestConfig.skipEncryption && config.data) {
          try {
            const encryptedData = this.securityManager.encrypt(
              JSON.stringify(config.data)
            );
            config.data = { encrypted: encryptedData };
            config.headers['X-Encrypted'] = 'true';
          } catch (error) {
            console.warn('Failed to encrypt request data:', error);
          }
        }

        // Add session info
        const sessionId = storage.get('sessionId');
        if (sessionId) {
          config.headers['X-Session-ID'] = sessionId;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Decrypt response data if encrypted
        if (response.headers['x-encrypted'] === 'true' && response.data?.encrypted) {
          try {
            const decryptedData = this.securityManager.decrypt(response.data.encrypted);
            response.data = JSON.parse(decryptedData);
          } catch (error) {
            console.warn('Failed to decrypt response data:', error);
          }
        }

        // Update session if provided
        const newSessionId = response.headers['x-new-session-id'];
        if (newSessionId) {
          storage.set('sessionId', newSessionId);
        }

        return response;
      },
      async (error) => {
        const originalRequest = error.config as RequestConfig;

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            await this.refreshAuth();
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            // Redirect to login or handle auth failure
            this.handleAuthFailure();
            return Promise.reject(refreshError);
          }
        }

        // Retry logic for network errors
        if (this.shouldRetry(error) && !originalRequest._isRetry) {
          const retryCount = originalRequest.retryCount || 3;
          originalRequest._isRetry = true;
          
          for (let i = 0; i < retryCount; i++) {
            try {
              await this.delay(Math.pow(2, i) * 1000); // Exponential backoff
              return await this.axiosInstance(originalRequest);
            } catch (retryError) {
              if (i === retryCount - 1) {
                return Promise.reject(retryError);
              }
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private shouldRetry(error: any): boolean {
    return (
      !error.response ||
      error.response.status >= 500 ||
      error.code === 'NETWORK_ERROR' ||
      error.code === 'TIMEOUT'
    );
  }

  private async refreshAuth(): Promise<void> {
    const refreshToken = storage.get('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await this.axiosInstance.post('/auth/refresh', {
        refreshToken,
      }, {
        skipAuth: true,
      } as RequestConfig);

      const { accessToken, refreshToken: newRefreshToken } = response.data;
      
      storage.set('accessToken', accessToken);
      storage.set('refreshToken', newRefreshToken);
      
      // Update the config with new token
      this.config.apiKey = accessToken;
    } catch (error) {
      storage.remove('accessToken');
      storage.remove('refreshToken');
      throw error;
    }
  }

  private handleAuthFailure(): void {
    storage.clear();
    // Emit auth failure event or redirect
    window.dispatchEvent(new CustomEvent('izion:auth-failure'));
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public methods
  async get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get(url, config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post(url, data, config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put(url, data, config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete(url, config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.patch(url, data, config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): ApiResponse {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    const code = error.response?.data?.code || error.code;
    
    return {
      success: false,
      error: message,
      code,
    };
  }

  // Utility methods
  setAuthToken(token: string): void {
    this.config.apiKey = token;
    storage.set('accessToken', token);
  }

  clearAuth(): void {
    storage.remove('accessToken');
    storage.remove('refreshToken');
    storage.remove('sessionId');
  }

  getConfig(): IzionConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<IzionConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (newConfig.apiUrl) {
      this.axiosInstance.defaults.baseURL = newConfig.apiUrl;
    }
  }
}
