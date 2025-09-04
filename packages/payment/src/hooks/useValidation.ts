import { useState, useCallback, useRef } from 'react';
import { PaymentData, PaymentValidationResult } from '../types';
import { validatePaymentData, validateEmail } from '../utils/validation';

export interface UseValidationOptions {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  debounceMs?: number;
}

export interface UseValidationReturn {
  errors: Record<string, string>;
  isValid: boolean;
  isValidating: boolean;
  validate: (data: any) => Promise<boolean>;
  validateField: (field: string, value: any, rules?: any) => Promise<boolean>;
  clearErrors: () => void;
  clearFieldError: (field: string) => void;
  setFieldError: (field: string, error: string) => void;
}

export const useValidation = (
  options: UseValidationOptions = {}
): UseValidationReturn => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const {
    debounceMs = 300
  } = options;

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  }, []);

  const validateField = useCallback(async (
    field: string, 
    value: any, 
    rules?: any
  ): Promise<boolean> => {
    try {
      let isValid = true;
      let errorMessage = '';

      // Basic validation rules
      if (rules?.required && !value) {
        isValid = false;
        errorMessage = `${field} is required`;
      } else if (field === 'email' && value && !validateEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }

      if (!isValid) {
        setFieldError(field, errorMessage);
        return false;
      } else {
        clearFieldError(field);
        return true;
      }
    } catch (error) {
      console.error('Field validation error:', error);
      setFieldError(field, 'Validation error occurred');
      return false;
    }
  }, [setFieldError, clearFieldError]);

  const validate = useCallback(async (data: any): Promise<boolean> => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    return new Promise((resolve) => {
      const doValidation = async () => {
        setIsValidating(true);
        try {
          // If it's payment data, use specific validation
          if (data && typeof data === 'object' && ('amount' in data || 'currency' in data)) {
            const result: PaymentValidationResult = validatePaymentData(data as PaymentData);
            
            if (result.errors && Object.keys(result.errors).length > 0) {
              setErrors(result.errors);
              resolve(false);
            } else {
              clearErrors();
              resolve(true);
            }
          } else {
            // Generic object validation
            let isValid = true;

            for (const [key, value] of Object.entries(data)) {
              const fieldValid = await validateField(key, value);
              if (!fieldValid) {
                isValid = false;
              }
            }

            resolve(isValid);
          }
        } catch (error) {
          console.error('Validation error:', error);
          setErrors({ general: 'Validation failed' });
          resolve(false);
        } finally {
          setIsValidating(false);
        }
      };

      if (debounceMs > 0) {
        timeoutRef.current = setTimeout(doValidation, debounceMs);
      } else {
        doValidation();
      }
    });
  }, [validateField, clearErrors, debounceMs]);

  const isValid = Object.keys(errors).length === 0;

  return {
    errors,
    isValid,
    isValidating,
    validate,
    validateField,
    clearErrors,
    clearFieldError,
    setFieldError,
  };
};
