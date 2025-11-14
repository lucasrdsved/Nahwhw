/**
 * Creates a promise that resolves after a given delay to simulate network latency in the mocks.
 *
 * @param ms - Number of milliseconds to wait before resolving. Defaults to 200 ms.
 * @returns A promise that resolves once the timeout completes.
 */
export const delay = (ms = 200): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Determines whether the code is running in a browser context where `window` is available.
 *
 * @returns `true` when executed in the browser, otherwise `false` (e.g. in SSR or tests).
 */
export const hasWindow = (): boolean => typeof window !== 'undefined';

const memoryStorage = new Map<string, string>();

export const storage = {
  /**
   * Retrieves a persisted string value for the provided key from the active storage backend.
   *
   * @param key - Unique storage key to look up.
   * @returns The stored value if present, otherwise `null`.
   */
  get(key: string): string | null {
    if (hasWindow()) {
      return window.localStorage.getItem(key);
    }
    return memoryStorage.get(key) ?? null;
  },
  /**
   * Persists a string value under the given key in the active storage backend.
   *
   * @param key - Unique storage key.
   * @param value - Stringified value to persist.
   * @returns Nothing.
   */
  set(key: string, value: string): void {
    if (hasWindow()) {
      window.localStorage.setItem(key, value);
    } else {
      memoryStorage.set(key, value);
    }
  },
  /**
   * Removes the stored value identified by the provided key from the active storage backend.
   *
   * @param key - Unique storage key to remove.
   * @returns Nothing.
   */
  remove(key: string): void {
    if (hasWindow()) {
      window.localStorage.removeItem(key);
    } else {
      memoryStorage.delete(key);
    }
  },
};

/**
 * Reads a JSON-serialised value from storage and parses it to the requested type.
 *
 * @typeParam T - Expected return type of the parsed JSON payload.
 * @param key - Storage key containing the JSON string.
 * @returns The parsed value or `null` if the key is missing or parsing fails.
 */
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

/**
 * Serialises a value to JSON and stores it under the given key.
 *
 * @param key - Storage key to persist the value under.
 * @param value - Arbitrary value to serialise and save.
 * @returns Nothing.
 */
export const writeJSON = (key: string, value: unknown): void => {
  try {
    storage.set(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to persist JSON to storage', error);
  }
};

/**
 * Creates a deep clone of the provided JSON-compatible value.
 *
 * @typeParam T - Inferred type of the value being cloned.
 * @param value - JSON-compatible value to clone.
 * @returns A deep copy of the provided value.
 */
export const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

/**
 * Generates a short pseudo-random identifier suitable for mock entities.
 *
 * @param prefix - String prefix used to identify the entity type.
 * @returns A unique identifier composed of the prefix and a random suffix.
 */
export const generateId = (prefix: string): string => `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
