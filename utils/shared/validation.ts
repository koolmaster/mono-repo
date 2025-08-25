export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const isValidApiKey = (apiKey: string): boolean => {
  return Boolean(apiKey && apiKey.length >= 32 && /^[a-zA-Z0-9]+$/.test(apiKey));
};

export const validateRequired = (value: any, fieldName: string): void => {
  if (value === null || value === undefined || value === '') {
    throw new Error(`${fieldName} is required`);
  }
};

export const validateLength = (
  value: string,
  min: number,
  max: number,
  fieldName: string
): void => {
  if (value.length < min || value.length > max) {
    throw new Error(
      `${fieldName} must be between ${min} and ${max} characters`
    );
  }
};

export const validateUrl = (url: string, fieldName: string): void => {
  try {
    new URL(url);
  } catch {
    throw new Error(`${fieldName} must be a valid URL`);
  }
};

export interface ValidationRule {
  field: string;
  value: any;
  rules: Array<{
    type: 'required' | 'email' | 'phone' | 'url' | 'length' | 'custom';
    message?: string;
    min?: number;
    max?: number;
    validator?: (value: any) => boolean;
  }>;
}

export class Validator {
  static validate(rules: ValidationRule[]): string[] {
    const errors: string[] = [];

    rules.forEach(({ field, value, rules: fieldRules }) => {
      fieldRules.forEach(rule => {
        try {
          switch (rule.type) {
            case 'required':
              validateRequired(value, field);
              break;
            case 'email':
              if (value && !isValidEmail(value)) {
                throw new Error(rule.message || `${field} must be a valid email`);
              }
              break;
            case 'phone':
              if (value && !isValidPhone(value)) {
                throw new Error(rule.message || `${field} must be a valid phone number`);
              }
              break;
            case 'url':
              if (value) {
                validateUrl(value, field);
              }
              break;
            case 'length':
              if (value && rule.min !== undefined && rule.max !== undefined) {
                validateLength(value, rule.min, rule.max, field);
              }
              break;
            case 'custom':
              if (rule.validator && !rule.validator(value)) {
                throw new Error(rule.message || `${field} is invalid`);
              }
              break;
          }
        } catch (error) {
          errors.push(error instanceof Error ? error.message : String(error));
        }
      });
    });

    return errors;
  }
}
