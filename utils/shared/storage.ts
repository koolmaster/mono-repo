import { IZION_CONSTANTS } from './index';

export class StorageManager {
  private prefix: string;

  constructor(prefix: string = IZION_CONSTANTS.STORAGE_PREFIX) {
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  set(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(this.getKey(key), serializedValue);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  get<T = any>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key));
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.getKey(key));
  }

  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  exists(key: string): boolean {
    return localStorage.getItem(this.getKey(key)) !== null;
  }
}

export const storage = new StorageManager();
