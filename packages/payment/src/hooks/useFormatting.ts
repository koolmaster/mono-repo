import { useCallback, useMemo } from 'react';
import { formatCurrency, formatDate, formatNumber, formatRelativeTime } from '../utils/formatting';
import { storage } from '../utils/storage';

export interface UseFormattingOptions {
  locale?: string;
  currency?: string;
  timezone?: string;
}

export interface UseFormattingReturn {
  // Currency formatting
  currency: (amount: number, currencyCode?: string) => string;
  
  // Date formatting
  date: (date: Date | string, format?: 'short' | 'medium' | 'long' | 'full') => string;
  shortDate: (date: Date | string) => string;
  longDate: (date: Date | string) => string;
  dateTime: (date: Date | string) => string;
  relativeTime: (date: Date | string) => string;
  
  // Number formatting
  number: (value: number, options?: any) => string;
  percentage: (value: number, decimals?: number) => string;
  
  // Utility formatting
  fileSize: (bytes: number, decimals?: number) => string;
  truncate: (text: string, length?: number, suffix?: string) => string;
  capitalize: (text: string) => string;
  
  // Current settings
  currentLocale: string;
  currentCurrency: string;
  currentTimezone: string;
}

export const useFormatting = (options: UseFormattingOptions = {}): UseFormattingReturn => {
  const currentLocale = useMemo(() => {
    return options.locale || storage.getLanguage() || navigator.language || 'en-US';
  }, [options.locale]);

  const currentCurrency = useMemo(() => {
    return options.currency || storage.getUserPreferences()?.currency || 'USD';
  }, [options.currency]);

  const currentTimezone = useMemo(() => {
    return options.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  }, [options.timezone]);

  // Currency formatting
  const currency = useCallback((amount: number, currencyCode?: string): string => {
    return formatCurrency(amount, currencyCode || currentCurrency, currentLocale);
  }, [currentCurrency, currentLocale]);

  // Date formatting
  const date = useCallback((date: Date | string, format?: 'short' | 'medium' | 'long' | 'full'): string => {
    return formatDate(date, format);
  }, []);

  const shortDate = useCallback((date: Date | string): string => {
    return formatDate(date, 'short');
  }, []);

  const longDate = useCallback((date: Date | string): string => {
    return formatDate(date, 'long');
  }, []);

  const dateTime = useCallback((date: Date | string): string => {
    return formatDate(date, 'medium');
  }, []);

  const relativeTime = useCallback((date: Date | string): string => {
    return formatRelativeTime(date);
  }, []);

  // Number formatting
  const number = useCallback((value: number, options?: any): string => {
    return formatNumber(value, options);
  }, []);

  const percentage = useCallback((value: number, decimals: number = 2): string => {
    return `${(value * 100).toFixed(decimals)}%`;
  }, []);

  // Utility formatting
  const fileSize = useCallback((bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  }, []);

  const truncate = useCallback((text: string, length: number = 50, suffix: string = '...'): string => {
    if (text.length <= length) return text;
    return text.substring(0, length - suffix.length) + suffix;
  }, []);

  const capitalize = useCallback((text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }, []);

  return {
    // Currency formatting
    currency,
    
    // Date formatting
    date,
    shortDate,
    longDate,
    dateTime,
    relativeTime,
    
    // Number formatting
    number,
    percentage,
    
    // Utility formatting
    fileSize,
    truncate,
    capitalize,
    
    // Current settings
    currentLocale,
    currentCurrency,
    currentTimezone,
  };
};
