import { createStorage } from "../js/data/storage.js";
import { createStore, SCHEMA_VERSION } from "../js/data/store.js";

const result = document.querySelector("#test-result");

if (!(result instanceof HTMLElement)) {
  throw new Error("The data foundation test is missing its result element.");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function runTest() {
  const testSuffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const testStorage = createStorage(`ledger.test.${testSuffix}`);
  const corruptedStorage = createStorage(`ledger.test.corrupt.${testSuffix}`);
  let testPassed = false;
  let failureMessage = "";

  try {
    const testStore = createStore(testStorage);
    const initialState = await testStore.initialize();
    assert(initialState.schemaVersion === SCHEMA_VERSION, "The store should initialize with the current schema version.");

    const savedRecord = await testStore.createRecord({
      name: "Sample reference",
      category: "general",
    });
    const loadedRecord = await testStore.getRecord(savedRecord.id);

    assert(loadedRecord !== null, "The saved record should be retrievable by its ID.");
    assert(loadedRecord.name === "Sample reference", "The saved record should retain its name.");
    assert(loadedRecord.category === "general", "The saved record should retain its category.");
    assert(typeof loadedRecord.id === "string" && loadedRecord.id.length > 0, "The record should have a unique ID.");
    assert(Date.parse(loadedRecord.createdAt) > 0, "The record should have a createdAt timestamp.");
    assert(Date.parse(loadedRecord.updatedAt) > 0, "The record should have an updatedAt timestamp.");

    const updatedRecord = await testStore.updateRecord(savedRecord.id, { name: "Updated reference" });
    assert(updatedRecord.id === savedRecord.id, "Updating a record should preserve its ID.");
    assert(updatedRecord.createdAt === savedRecord.createdAt, "Updating a record should preserve its createdAt timestamp.");
    assert(updatedRecord.name === "Updated reference", "Updating a record should save its changes.");

    const reloadedRecord = await createStore(testStorage).getRecord(savedRecord.id);
    assert(reloadedRecord.name === "Updated reference", "A new store should retrieve saved data from LocalStorage.");

    const concurrentRecords = await Promise.all([
      testStore.createRecord({ name: "First concurrent note" }),
      testStore.createRecord({ name: "Second concurrent note" }),
    ]);
    assert(
      new Set(concurrentRecords.map((record) => record.id)).size === 2,
      "Concurrent records should receive different IDs.",
    );

    const persistedState = await testStorage.load();
    assert(persistedState.records.length === 3, "All records should remain saved after concurrent writes.");
    assert(persistedState.records.some((record) => record.id === savedRecord.id), "The record should be saved in LocalStorage.");
    assert(await testStore.deleteRecord(concurrentRecords[0].id), "An existing record should be deletable.");
    assert(!(await testStore.deleteRecord(concurrentRecords[0].id)), "Deleting an already removed record should report no change.");

    window.localStorage.setItem(`ledger.test.corrupt.${testSuffix}`, "{not valid JSON");
    const recoveredState = await createStore(corruptedStorage).initialize();
    assert(recoveredState.schemaVersion === SCHEMA_VERSION, "Corrupted data should recover to the current schema.");
    assert(recoveredState.records.length === 0, "Corrupted data should recover to an empty record list.");

    testPassed = true;
  } catch (error) {
    failureMessage = error instanceof Error ? error.message : String(error);
    console.error("LEDGER data foundation test failed.", error);
  }

  try {
    await testStorage.clear();
    await corruptedStorage.clear();
  } catch (error) {
    testPassed = false;
    failureMessage = error instanceof Error ? error.message : String(error);
    console.error("LEDGER data foundation test cleanup failed.", error);
  }

  if (testPassed) {
    result.textContent = "PASS — saved and retrieved a general-purpose record, checked its ID and timestamps, and recovered from corrupted saved data.";
    result.dataset.status = "passed";
  } else {
    result.textContent = `FAIL — ${failureMessage}`;
    result.dataset.status = "failed";
  }
}

await runTest();
