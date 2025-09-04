// Utility functions for common operations
export const utils = {
  // Generate unique IDs
  generateId: (prefix: string = 'id'): string => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Debounce function
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(null, args), wait);
    };
  },

  // Throttle function
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Deep clone object
  deepClone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
    if (obj instanceof Array) return obj.map(item => utils.deepClone(item)) as unknown as T;
    if (typeof obj === 'object') {
      const clonedObj = {} as T;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = utils.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
    return obj;
  },

  // Merge objects deeply
  deepMerge: <T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T => {
    if (!sources.length) return target;
    const source = sources.shift();

    if (utils.isObject(target) && utils.isObject(source)) {
      for (const key in source) {
        if (utils.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          if (source[key]) {
            utils.deepMerge(target[key], source[key] as Partial<T[Extract<keyof T, string>]>);
          }
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return utils.deepMerge(target, ...sources);
  },

  // Check if value is object
  isObject: (item: any): boolean => {
    return item && typeof item === 'object' && !Array.isArray(item);
  },

  // Check if value is empty
  isEmpty: (value: any): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  },

  // Capitalize first letter
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // Convert to camelCase
  toCamelCase: (str: string): string => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  },

  // Convert to kebab-case
  toKebabCase: (str: string): string => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  },

  // Truncate string
  truncate: (str: string, length: number = 50, suffix: string = '...'): string => {
    if (str.length <= length) return str;
    return str.substring(0, length - suffix.length) + suffix;
  },

  // Sleep/delay function
  sleep: (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Retry function with exponential backoff
  retry: async <T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    let attempts = 0;
    while (attempts < maxAttempts) {
      try {
        return await fn();
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) throw error;
        await utils.sleep(delay * Math.pow(2, attempts - 1));
      }
    }
    throw new Error('Max retry attempts reached');
  },

  // Convert file size to human readable format
  formatFileSize: (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  },

  // Get file extension
  getFileExtension: (filename: string): string => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  },

  // Check if URL is valid
  isValidUrl: (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  },

  // Get query parameters from URL
  getQueryParams: (url?: string): Record<string, string> => {
    const queryString = url ? url.split('?')[1] : window.location.search.slice(1);
    if (!queryString) return {};
    
    return queryString.split('&').reduce((params, param) => {
      const [key, value] = param.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      return params;
    }, {} as Record<string, string>);
  },

  // Set query parameters to URL
  setQueryParams: (params: Record<string, string>, baseUrl?: string): string => {
    const url = new URL(baseUrl || window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });
    return url.toString();
  },

  // Copy to clipboard
  copyToClipboard: async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'absolute';
        textArea.style.left = '-999999px';
        document.body.prepend(textArea);
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        return true;
      }
    } catch (error) {
      console.warn('Failed to copy to clipboard:', error);
      return false;
    }
  },

  // Download data as file
  downloadAsFile: (data: string, filename: string, type: string = 'text/plain'): void => {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Check if device is mobile
  isMobile: (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  },

  // Check if device is touch enabled
  isTouchDevice: (): boolean => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  // Get browser info
  getBrowserInfo: () => {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';
    else if (ua.includes('Opera')) browser = 'Opera';
    
    return {
      browser,
      userAgent: ua,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
    };
  },

  // Random color generator
  randomColor: (): string => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  },

  // Hash string (simple hash function)
  hashString: (str: string): number => {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  },

  // Convert to base64
  toBase64: (str: string): string => {
    return btoa(unescape(encodeURIComponent(str)));
  },

  // Convert from base64
  fromBase64: (str: string): string => {
    return decodeURIComponent(escape(atob(str)));
  },

  // Environment detection
  getEnvironment: () => {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
      return 'development';
    }
    
    if (hostname.includes('staging') || hostname.includes('test')) {
      return 'staging';
    }
    
    return 'production';
  },

  // Performance measurement
  measurePerformance: (name: string, fn: () => void): number => {
    const start = performance.now();
    fn();
    const end = performance.now();
    const duration = end - start;
    console.log(`${name} took ${duration} milliseconds`);
    return duration;
  },

  // Error boundary helper
  createErrorBoundary: (error: Error, errorInfo: any) => {
    console.error('Error Boundary Caught:', error, errorInfo);
    
    // Log to external service if configured
    const isDevelopment = utils.getEnvironment() === 'development';
    if (!isDevelopment) {
      // Send error to monitoring service in production
      console.log('Error would be sent to monitoring service');
    }
    
    return {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
  },
};
