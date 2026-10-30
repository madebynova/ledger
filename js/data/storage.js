export const STORAGE_KEY = "ledger.data";

export class CorruptedStorageError extends Error {
  constructor(key, cause) {
    super(`Saved data for "${key}" is not valid JSON.`);
    this.name = "CorruptedStorageError";
    this.cause = cause;
  }
}

export function createStorage(key = STORAGE_KEY) {
  if (typeof key !== "string" || key.length === 0) {
    throw new TypeError("A non-empty storage key is required.");
  }

  return {
    async load() {
      const savedText = window.localStorage.getItem(key);

      if (savedText === null) {
        return null;
      }

      try {
        return JSON.parse(savedText);
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new CorruptedStorageError(key, error);
        }

        throw error;
      }
    },

    async save(value) {
      const savedText = JSON.stringify(value);

      if (savedText === undefined) {
        throw new TypeError("Only JSON-compatible data can be saved.");
      }

      window.localStorage.setItem(key, savedText);
    },

    async clear() {
      window.localStorage.removeItem(key);
    },
  };
}
