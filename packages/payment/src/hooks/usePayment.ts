import { useState, useCallback, useEffect, useRef } from 'react';
import { PaymentData, PaymentResult, PaymentConfig, PaymentStatus } from '../types';
import { validatePaymentData } from '../utils/validation';
import { storage } from '../utils/storage';

export interface UsePaymentOptions {
  config: PaymentConfig;
  onSuccess?: (result: PaymentResult) => void;
  onError?: (error: string) => void;
  onStatusChange?: (status: PaymentStatus) => void;
  autoSave?: boolean;
}

export interface UsePaymentReturn {
  // State
  paymentData: Partial<PaymentData>;
  isProcessing: boolean;
  isValid: boolean;
  errors: Record<string, string>;
  currentStatus: PaymentStatus;
  
  // Actions
  updatePaymentData: (data: Partial<PaymentData>) => void;
  processPayment: () => Promise<PaymentResult>;
  clearPayment: () => void;
  validatePayment: () => boolean;
  saveToStorage: () => void;
  loadFromStorage: () => void;
  
  // Setters
  setAmount: (amount: number) => void;
  setCurrency: (currency: string) => void;
  setDescription: (description: string) => void;
  setCustomerEmail: (email: string) => void;
}

export const usePayment = (options: UsePaymentOptions): UsePaymentReturn => {
  const { config, onSuccess, onError, onStatusChange, autoSave = true } = options;
  
  const [paymentData, setPaymentData] = useState<Partial<PaymentData>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStatus, setCurrentStatus] = useState<PaymentStatus>('pending');
  
  const processingRef = useRef<AbortController | null>(null);

  // Auto-save to storage when payment data changes
  useEffect(() => {
    if (autoSave && Object.keys(paymentData).length > 0) {
      storage.setPaymentSession(paymentData);
    }
  }, [paymentData, autoSave]);

  // Update status and notify
  const updateStatus = useCallback((status: PaymentStatus) => {
    setCurrentStatus(status);
    onStatusChange?.(status);
  }, [onStatusChange]);

  // Validate payment data
  const validatePayment = useCallback((): boolean => {
    try {
      const result = validatePaymentData(paymentData as PaymentData);
      setErrors(result.errors || {});
      return result.isValid;
    } catch (error) {
      console.error('Payment validation error:', error);
      setErrors({ general: 'Validation failed' });
      return false;
    }
  }, [paymentData]);

  // Update payment data
  const updatePaymentData = useCallback((data: Partial<PaymentData>) => {
    setPaymentData(prev => ({ ...prev, ...data }));
    // Clear relevant errors when data is updated
    if (data.amount !== undefined) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.amount;
        return newErrors;
      });
    }
  }, []);

  // Process payment
  const processPayment = useCallback(async (): Promise<PaymentResult> => {
    // Cancel any existing processing
    if (processingRef.current) {
      processingRef.current.abort();
    }

    // Create new abort controller
    processingRef.current = new AbortController();
    
    setIsProcessing(true);
    updateStatus('processing');

    try {
      // Validate before processing
      if (!validatePayment()) {
        throw new Error('Payment validation failed');
      }

      // Simulate API call (replace with actual payment API)
      const response = await fetch(`${config.baseURL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(paymentData),
        signal: processingRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Payment failed: ${response.statusText}`);
      }

      const result: PaymentResult = await response.json();

      if (result.success) {
        updateStatus('completed');
        storage.clearPaymentSession();
        onSuccess?.(result);
      } else {
        updateStatus('failed');
        onError?.(result.error || 'Payment failed');
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
      
      if (error instanceof Error && error.name === 'AbortError') {
        updateStatus('cancelled');
        return {
          success: false,
          error: 'Payment was cancelled',
          status: 'cancelled'
        };
      }

      updateStatus('failed');
      onError?.(errorMessage);
      
      return {
        success: false,
        error: errorMessage,
        status: 'failed'
      };
    } finally {
      setIsProcessing(false);
      processingRef.current = null;
    }
  }, [paymentData, config, validatePayment, updateStatus, onSuccess, onError]);

  // Clear payment data
  const clearPayment = useCallback(() => {
    setPaymentData({});
    setErrors({});
    setCurrentStatus('pending');
    storage.clearPaymentSession();
  }, []);

  // Save to storage
  const saveToStorage = useCallback(() => {
    storage.setPaymentSession(paymentData);
  }, [paymentData]);

  // Load from storage
  const loadFromStorage = useCallback(() => {
    const savedData = storage.getPaymentSession();
    if (savedData) {
      setPaymentData(savedData);
    }
  }, []);

  // Convenience setters
  const setAmount = useCallback((amount: number) => {
    updatePaymentData({ amount });
  }, [updatePaymentData]);

  const setCurrency = useCallback((currency: string) => {
    updatePaymentData({ currency });
  }, [updatePaymentData]);

  const setDescription = useCallback((description: string) => {
    updatePaymentData({ description });
  }, [updatePaymentData]);

  const setCustomerEmail = useCallback((customerEmail: string) => {
    updatePaymentData({ customerEmail });
  }, [updatePaymentData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (processingRef.current) {
        processingRef.current.abort();
      }
    };
  }, []);

  const isValid = Object.keys(errors).length === 0 && 
                  paymentData.amount !== undefined && 
                  paymentData.currency !== undefined;

  return {
    // State
    paymentData,
    isProcessing,
    isValid,
    errors,
    currentStatus,
    
    // Actions
    updatePaymentData,
    processPayment,
    clearPayment,
    validatePayment,
    saveToStorage,
    loadFromStorage,
    
    // Setters
    setAmount,
    setCurrency,
    setDescription,
    setCustomerEmail,
  };
};
