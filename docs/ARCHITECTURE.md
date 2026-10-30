# LEDGER architecture

LEDGER uses small native JavaScript modules. The page, navigation, data store, and browser storage are kept in separate files so each part has a clear responsibility.

## Main parts

### Page and styles

- `index.html` provides the application shell, navigation links, and the empty container where the selected page is rendered.
- `css/tokens.css` defines shared colors, spacing, typography, and corner radii.
- `css/base.css`, `css/layout.css`, `css/components.css`, and `css/pages.css` provide global styles, responsive shell layout, reusable UI styles, and page styles.
- `js/pages/` contains one renderer for each of the five sections. The dashboard content is illustrative; the other sections currently show empty states.
- `js/components/empty-state.js` returns shared markup for the section empty states.

### Startup and navigation

- `js/main.js` imports the page renderers and router, checks that the shell has its required page elements, and initializes the shared store. It then asks the router to render the selected page.
- `js/router.js` reads the URL fragment (for example, `#records`), chooses a known page, updates the active navigation link, and calls the page-render callback. It listens for `hashchange`, so navigation does not reload the document.

### Data and storage

- `js/data/storage.js` wraps browser LocalStorage in asynchronous `load`, `save`, and `clear` methods. It stores one JSON value under the `ledger.data` key and reports invalid JSON with a specific error. LocalStorage itself is synchronous; the promise-based interface prepares this boundary for a possible future storage provider.
- `js/data/store.js` owns the in-memory application state and record operations. It checks the schema version and record metadata, creates IDs and timestamps, and saves mutations through the storage adapter. Its public operations are asynchronous.

The current state has this general shape:

```js
{
  schemaVersion: 1,
  records: [
    {
      id: "generated-id",
      createdAt: "ISO timestamp",
      updatedAt: "ISO timestamp",
      // Other general-purpose record fields
    }
  ]
}
```

Records are general-purpose objects. The data layer does not implement business-specific transaction, sales, or inventory models.

## How information travels

### Opening the application

1. The browser loads `index.html`, its stylesheets, and `js/main.js`.
2. `main.js` initializes the store. The store asks `storage.js` to load the saved JSON, or starts with an empty state when no saved value exists.
3. The store checks the schema version and record IDs and timestamps. Corrupted JSON or an invalid/unsupported state is reported in the console, and the store uses an empty in-memory state.
4. `main.js` starts the router. The router selects the current section from the URL fragment and tells `main.js` which page to render.
5. `main.js` inserts that page's markup into `#page-content` and updates the breadcrumb and document title.

### Saving a record

1. Code calls an asynchronous store operation such as `store.createRecord(recordData)`.
2. The store creates the record ID and timestamps, then builds the next application state.
3. The store passes that state to `storage.save`.
4. The storage adapter serializes the state to JSON and writes it to LocalStorage.
5. Once saving succeeds, the store updates its in-memory state and returns a copy of the record.

Updates preserve a record's ID and creation time, refresh its update time, and serialize mutations so overlapping writes do not overwrite each other. Reads return copies, rather than direct references to the store's internal state.

## Current boundary

The application startup initializes the store, but the page renderers do not currently call its record methods. The dashboard is sample content, not a live view of saved records. This is a data foundation only; no database connection or schema migration process is implemented.
