import { LOCAL_STORAGE_KEYS, PAYMENT_CONSTANTS } from '../constants';

export const storage = {
  get: <T = any>(key: string): T | null => {
    try {
      const item = localStorage.getItem(`${PAYMENT_CONSTANTS.STORAGE_PREFIX}${key}`);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(`Failed to get item from storage: ${key}`, error);
      return null;
    }
  },

  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(
        `${PAYMENT_CONSTANTS.STORAGE_PREFIX}${key}`, 
        JSON.stringify(value)
      );
    } catch (error) {
      console.warn(`Failed to set item in storage: ${key}`, error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(`${PAYMENT_CONSTANTS.STORAGE_PREFIX}${key}`);
    } catch (error) {
      console.warn(`Failed to remove item from storage: ${key}`, error);
    }
  },

  clear: (): void => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(PAYMENT_CONSTANTS.STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear storage', error);
    }
  },

  // Specific storage methods
  getPaymentSession: () => storage.get(LOCAL_STORAGE_KEYS.PAYMENT_SESSION),
  setPaymentSession: (data: any) => storage.set(LOCAL_STORAGE_KEYS.PAYMENT_SESSION, data),
  clearPaymentSession: () => storage.remove(LOCAL_STORAGE_KEYS.PAYMENT_SESSION),

  getUserPreferences: () => storage.get(LOCAL_STORAGE_KEYS.USER_PREFERENCES),
  setUserPreferences: (prefs: any) => storage.set(LOCAL_STORAGE_KEYS.USER_PREFERENCES, prefs),

  getTheme: () => storage.get(LOCAL_STORAGE_KEYS.THEME) || 'light',
  setTheme: (theme: string) => storage.set(LOCAL_STORAGE_KEYS.THEME, theme),

  getLanguage: () => storage.get(LOCAL_STORAGE_KEYS.LANGUAGE) || 'en',
  setLanguage: (lang: string) => storage.set(LOCAL_STORAGE_KEYS.LANGUAGE, lang),

  // Cache management
  getCache: (key: string) => {
    const cache = storage.get(LOCAL_STORAGE_KEYS.API_CACHE) || {};
    const item = cache[key];
    
    if (!item) return null;
    
    // Check if cache is expired
    if (Date.now() > item.expiry) {
      delete cache[key];
      storage.set(LOCAL_STORAGE_KEYS.API_CACHE, cache);
      return null;
    }
    
    return item.data;
  },

  setCache: (key: string, data: any, ttl: number = 5 * 60 * 1000) => {
    const cache = storage.get(LOCAL_STORAGE_KEYS.API_CACHE) || {};
    cache[key] = {
      data,
      expiry: Date.now() + ttl
    };
    storage.set(LOCAL_STORAGE_KEYS.API_CACHE, cache);
  },

  clearCache: () => storage.remove(LOCAL_STORAGE_KEYS.API_CACHE),
};

export const sessionStorage = {
  get: <T = any>(key: string): T | null => {
    try {
      const item = window.sessionStorage.getItem(`${PAYMENT_CONSTANTS.STORAGE_PREFIX}${key}`);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(`Failed to get item from session storage: ${key}`, error);
      return null;
    }
  },

  set: (key: string, value: any): void => {
    try {
      window.sessionStorage.setItem(
        `${PAYMENT_CONSTANTS.STORAGE_PREFIX}${key}`, 
        JSON.stringify(value)
      );
    } catch (error) {
      console.warn(`Failed to set item in session storage: ${key}`, error);
    }
  },

  remove: (key: string): void => {
    try {
      window.sessionStorage.removeItem(`${PAYMENT_CONSTANTS.STORAGE_PREFIX}${key}`);
    } catch (error) {
      console.warn(`Failed to remove item from session storage: ${key}`, error);
    }
  },

  clear: (): void => {
    try {
      const keys = Object.keys(window.sessionStorage);
      keys.forEach(key => {
        if (key.startsWith(PAYMENT_CONSTANTS.STORAGE_PREFIX)) {
          window.sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear session storage', error);
    }
  },
};
