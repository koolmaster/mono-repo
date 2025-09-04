import { VALIDATION_PATTERNS, SUPPORTED_CURRENCIES } from '../constants';
import type { PaymentData, ValidationError } from '../types';

export const validateEmail = (email: string): boolean => {
  return VALIDATION_PATTERNS.EMAIL.test(email);
};

export const validatePhone = (phone: string): boolean => {
  return VALIDATION_PATTERNS.PHONE.test(phone.replace(/\s/g, ''));
};

export const validateApiKey = (apiKey: string): boolean => {
  return Boolean(apiKey && apiKey.length >= 32 && VALIDATION_PATTERNS.API_KEY.test(apiKey));
};

export const validateAmount = (amount: number): boolean => {
  return typeof amount === 'number' && amount > 0 && amount <= 1000000;
};

export const validateCurrency = (currency: string): boolean => {
  return SUPPORTED_CURRENCIES.some(c => c.code === currency.toUpperCase());
};

export const validateRequired = (value: any, fieldName: string): ValidationError | null => {
  if (value === null || value === undefined || value === '') {
    return {
      field: fieldName,
      message: `${fieldName} is required`,
      code: 'REQUIRED_FIELD'
    };
  }
  return null;
};

export const validateLength = (
  value: string,
  min: number,
  max: number,
  fieldName: string
): ValidationError | null => {
  if (value.length < min || value.length > max) {
    return {
      field: fieldName,
      message: `${fieldName} must be between ${min} and ${max} characters`,
      code: 'INVALID_LENGTH'
    };
  }
  return null;
};

export const validateUrl = (url: string, fieldName: string): ValidationError | null => {
  try {
    new URL(url);
    return null;
  } catch {
    return {
      field: fieldName,
      message: `${fieldName} must be a valid URL`,
      code: 'INVALID_URL'
    };
  }
};

export interface PaymentValidationResult {
  isValid: boolean;
  errors?: Record<string, string>;
  validationErrors?: ValidationError[];
}

export const validatePaymentData = (data: PaymentData): PaymentValidationResult => {
  const errors: ValidationError[] = [];

  // Validate amount
  const amountError = validateRequired(data.amount, 'amount');
  if (amountError) {
    errors.push(amountError);
  } else if (!validateAmount(data.amount)) {
    errors.push({
      field: 'amount',
      message: 'Amount must be a positive number between 0.01 and 1,000,000',
      code: 'INVALID_AMOUNT'
    });
  }

  // Validate currency
  const currencyError = validateRequired(data.currency, 'currency');
  if (currencyError) {
    errors.push(currencyError);
  } else if (!validateCurrency(data.currency)) {
    errors.push({
      field: 'currency',
      message: 'Invalid currency code',
      code: 'INVALID_CURRENCY'
    });
  }

  // Validate email if provided
  if (data.customerEmail) {
    if (!validateEmail(data.customerEmail)) {
      errors.push({
        field: 'customerEmail',
        message: 'Invalid email address',
        code: 'INVALID_EMAIL'
      });
    }
  }

  // Validate description length
  if (data.description) {
    const lengthError = validateLength(data.description, 0, 500, 'description');
    if (lengthError) {
      errors.push(lengthError);
    }
  }

  return {
    isValid: errors.length === 0,
    validationErrors: errors,
    errors: errors.reduce((acc, error) => {
      acc[error.field] = error.message;
      return acc;
    }, {} as Record<string, string>)
  };
};

export const validateFormField = (
  value: any,
  rules: Array<{
    type: 'required' | 'email' | 'phone' | 'url' | 'length' | 'custom';
    message?: string;
    min?: number;
    max?: number;
    validator?: (value: any) => boolean;
  }>,
  fieldName: string
): ValidationError[] => {
  const errors: ValidationError[] = [];

  rules.forEach(rule => {
    try {
      switch (rule.type) {
        case 'required':
          const requiredError = validateRequired(value, fieldName);
          if (requiredError) {
            errors.push({
              ...requiredError,
              message: rule.message || requiredError.message
            });
          }
          break;

        case 'email':
          if (value && !validateEmail(value)) {
            errors.push({
              field: fieldName,
              message: rule.message || `${fieldName} must be a valid email`,
              code: 'INVALID_EMAIL'
            });
          }
          break;

        case 'phone':
          if (value && !validatePhone(value)) {
            errors.push({
              field: fieldName,
              message: rule.message || `${fieldName} must be a valid phone number`,
              code: 'INVALID_PHONE'
            });
          }
          break;

        case 'url':
          if (value) {
            const urlError = validateUrl(value, fieldName);
            if (urlError) {
              errors.push({
                ...urlError,
                message: rule.message || urlError.message
              });
            }
          }
          break;

        case 'length':
          if (value && rule.min !== undefined && rule.max !== undefined) {
            const lengthError = validateLength(value, rule.min, rule.max, fieldName);
            if (lengthError) {
              errors.push({
                ...lengthError,
                message: rule.message || lengthError.message
              });
            }
          }
          break;

        case 'custom':
          if (rule.validator && !rule.validator(value)) {
            errors.push({
              field: fieldName,
              message: rule.message || `${fieldName} is invalid`,
              code: 'CUSTOM_VALIDATION_FAILED'
            });
          }
          break;
      }
    } catch (error) {
      errors.push({
        field: fieldName,
        message: 'Validation error occurred',
        code: 'VALIDATION_ERROR'
      });
    }
  });

  return errors;
};
