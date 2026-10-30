import { CorruptedStorageError, createStorage } from "./storage.js";

export const SCHEMA_VERSION = 1;

function createEmptyState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    records: [],
  };
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isTimestamp(value) {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function isValidState(value) {
  if (
    !isObject(value) ||
    value.schemaVersion !== SCHEMA_VERSION ||
    !Array.isArray(value.records)
  ) {
    return false;
  }

  const ids = new Set();

  return value.records.every((record) => {
    if (
      !isObject(record) ||
      typeof record.id !== "string" ||
      record.id.length === 0 ||
      !isTimestamp(record.createdAt) ||
      !isTimestamp(record.updatedAt) ||
      ids.has(record.id)
    ) {
      return false;
    }

    ids.add(record.id);
    return true;
  });
}

function cloneJson(value) {
  const serialized = JSON.stringify(value);

  if (serialized === undefined) {
    throw new TypeError("Records must contain JSON-compatible data.");
  }

  return JSON.parse(serialized);
}

function createRecordId(records) {
  let id;

  do {
    if (typeof globalThis.crypto?.randomUUID === "function") {
      id = globalThis.crypto.randomUUID();
    } else {
      id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    }
  } while (records.some((record) => record.id === id));

  return id;
}

function requireRecordData(value, label) {
  if (!isObject(value)) {
    throw new TypeError(`${label} must be a plain object.`);
  }
}

export function createStore(storage = createStorage()) {
  let state = createEmptyState();
  let initialized = false;
  let mutationQueue = Promise.resolve();

  async function saveNextState(nextState) {
    await storage.save(nextState);
    state = nextState;
    initialized = true;
  }

  function runMutation(mutation) {
    const result = mutationQueue.then(mutation);
    mutationQueue = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }

  async function initialize() {
    if (initialized) {
      return cloneJson(state);
    }

    let savedState;

    try {
      savedState = await storage.load();
    } catch (error) {
      if (!(error instanceof CorruptedStorageError)) {
        throw error;
      }

      console.warn("LEDGER found corrupted saved data and started with an empty workspace.", error);
      state = createEmptyState();
      initialized = true;
      return cloneJson(state);
    }

    if (savedState === null) {
      state = createEmptyState();
    } else if (isValidState(savedState)) {
      state = savedState;
    } else {
      console.warn("LEDGER found saved data with an unsupported or invalid schema and started with an empty workspace.");
      state = createEmptyState();
    }

    initialized = true;
    return cloneJson(state);
  }

  async function getSnapshot() {
    await initialize();
    return cloneJson(state);
  }

  async function getRecords() {
    await initialize();
    return cloneJson(state.records);
  }

  async function getRecord(id) {
    await initialize();
    const record = state.records.find((item) => item.id === id);
    return record ? cloneJson(record) : null;
  }

  async function createRecord(recordData) {
    await initialize();
    requireRecordData(recordData, "Record data");

    return runMutation(async () => {
      const timestamp = new Date().toISOString();
      const record = {
        ...cloneJson(recordData),
        id: createRecordId(state.records),
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      const nextState = {
        ...state,
        records: [...state.records, record],
      };

      await saveNextState(nextState);
      return cloneJson(record);
    });
  }

  async function updateRecord(id, updates) {
    await initialize();
    requireRecordData(updates, "Record updates");

    return runMutation(async () => {
      const currentRecord = state.records.find((record) => record.id === id);

      if (!currentRecord) {
        throw new RangeError(`Cannot update record "${id}" because it does not exist.`);
      }

      const updatedRecord = {
        ...currentRecord,
        ...cloneJson(updates),
        id: currentRecord.id,
        createdAt: currentRecord.createdAt,
        updatedAt: new Date().toISOString(),
      };
      const nextState = {
        ...state,
        records: state.records.map((record) => (
          record.id === id ? updatedRecord : record
        )),
      };

      await saveNextState(nextState);
      return cloneJson(updatedRecord);
    });
  }

  async function deleteRecord(id) {
    await initialize();

    return runMutation(async () => {
      if (!state.records.some((record) => record.id === id)) {
        return false;
      }

      const nextState = {
        ...state,
        records: state.records.filter((record) => record.id !== id),
      };

      await saveNextState(nextState);
      return true;
    });
  }

  return {
    initialize,
    getSnapshot,
    getRecords,
    getRecord,
    createRecord,
    updateRecord,
    deleteRecord,
  };
}

export const store = createStore();
