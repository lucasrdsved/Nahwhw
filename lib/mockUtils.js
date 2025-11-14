// @ts-check

export const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const hasWindow = () => typeof window !== 'undefined';

const memoryStorage = new Map();

export const storage = {
  get(key) {
    if (hasWindow()) {
      return window.localStorage.getItem(key);
    }
    return memoryStorage.has(key) ? memoryStorage.get(key) : null;
  },
  set(key, value) {
    if (hasWindow()) {
      window.localStorage.setItem(key, value);
    } else {
      memoryStorage.set(key, value);
    }
  },
  remove(key) {
    if (hasWindow()) {
      window.localStorage.removeItem(key);
    } else {
      memoryStorage.delete(key);
    }
  },
};

export const readJSON = (key) => {
  const value = storage.get(key);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn('Failed to parse JSON from storage', error);
    return null;
  }
};

export const writeJSON = (key, value) => {
  try {
    storage.set(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to persist JSON to storage', error);
  }
};

export const clone = (value) => JSON.parse(JSON.stringify(value));

export const generateId = (prefix) => `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
