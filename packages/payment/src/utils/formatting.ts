import { SUPPORTED_CURRENCIES } from '../constants';

export const formatCurrency = (
  amount: number, 
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback formatting
    const currencyInfo = SUPPORTED_CURRENCIES.find(c => c.code === currency.toUpperCase());
    const symbol = currencyInfo?.symbol || currency;
    return `${symbol}${amount.toFixed(2)}`;
  }
};

export const formatNumber = (
  value: number,
  options: {
    decimals?: number;
    thousandsSeparator?: string;
    decimalSeparator?: string;
  } = {}
): string => {
  const {
    decimals = 2,
    thousandsSeparator = ',',
    decimalSeparator = '.'
  } = options;

  const parts = value.toFixed(decimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
  return parts.join(decimalSeparator);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatDate = (
  date: string | Date,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium',
  locale: string = 'en-US'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const optionsMap: Record<string, Intl.DateTimeFormatOptions> = {
    short: { 
      year: '2-digit', 
      month: 'short', 
      day: 'numeric' 
    },
    medium: { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    },
    long: { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    },
    full: { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
  };

  return new Intl.DateTimeFormat(locale, optionsMap[format]).format(dateObj);
};

export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(targetDate, 'short');
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';

  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

export const formatPhoneNumber = (phone: string, format: 'international' | 'national' = 'national'): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (format === 'international' && !cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }
  
  // Simple US phone number formatting
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
};

export const truncateText = (text: string, maxLength: number, suffix: string = '...'): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const camelToTitle = (camelCase: string): string => {
  return camelCase
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

export const kebabToTitle = (kebabCase: string): string => {
  return kebabCase
    .split('-')
    .map(word => capitalizeFirst(word))
    .join(' ');
};
