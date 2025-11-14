export const delay = (ms = 200): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export const hasWindow = (): boolean => typeof window !== 'undefined';

const memoryStorage = new Map<string, string>();

export const storage = {
  get(key: string): string | null {
    if (hasWindow()) {
      return window.localStorage.getItem(key);
    }
    return memoryStorage.get(key) ?? null;
  },
  set(key: string, value: string): void {
    if (hasWindow()) {
      window.localStorage.setItem(key, value);
    } else {
      memoryStorage.set(key, value);
    }
  },
  remove(key: string): void {
    if (hasWindow()) {
      window.localStorage.removeItem(key);
    } else {
      memoryStorage.delete(key);
    }
  },
};

export const readJSON = <T = unknown>(key: string): T | null => {
  const value = storage.get(key);
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn('Failed to parse JSON from storage', error);
    return null;
  }
};

export const writeJSON = (key: string, value: unknown): void => {
  try {
    storage.set(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to persist JSON to storage', error);
  }
};

export const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const generateId = (prefix: string): string => `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
