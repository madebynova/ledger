# LEDGER

LEDGER is a lightweight workspace application in early development. Its current foundation is a responsive application shell and a small, browser-based data layer. The project is intentionally built with plain HTML, CSS, and JavaScript so it is straightforward to run and understand.

## Current features

- Responsive desktop sidebar and mobile bottom navigation.
- Five in-page sections: Dashboard, Organization, Records, Reports, and Settings.
- Illustrative dashboard content and empty states for the other sections.
- A general-purpose record store backed by browser LocalStorage.
- Asynchronous storage and store interfaces, record IDs and timestamps, schema versioning, and safe fallback for missing, invalid, or corrupted saved data.
- A browser test for saving, retrieving, updating, and deleting records and checking recovery from corrupted data.

The pages do not currently read or display records from the store. Dashboard content is illustrative. There is no authentication, remote database, or business-specific transaction functionality.

## Run locally on Windows

Python is only needed to serve the files locally; the project has no package installation step.

1. Open PowerShell in the project folder.
2. Start the server:

   ```powershell
   py -m http.server 8000
   ```

   If `py` is not available, try `python -m http.server 8000`.
3. Open <http://localhost:8000> in your browser.
4. Stop the server with **Ctrl+C** in PowerShell.

The test page is at <http://localhost:8000/tests/data-foundation.test.html>. See [Development](docs/DEVELOPMENT.md) for details.

## Project structure

```text
ledger/
├── index.html
├── css/
│   ├── tokens.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   └── pages.css
├── docs/
│   ├── ARCHITECTURE.md
│   └── DEVELOPMENT.md
├── js/
│   ├── main.js
│   ├── router.js
│   ├── components/
│   │   └── empty-state.js
│   ├── data/
│   │   ├── storage.js
│   │   └── store.js
│   └── pages/
│       ├── dashboard.js
│       ├── organization.js
│       ├── records.js
│       ├── reports.js
│       └── settings.js
└── tests/
    ├── data-foundation.test.html
    └── data-foundation.test.js
```

`tokens.css` contains shared design values. The other CSS files define the base styles, shell layout, reusable UI styles, and page-specific styles. JavaScript is split into startup and routing modules, reusable components, data modules, and one module for each page. The test is a standalone browser page.

## Technology

- HTML for the page structure.
- CSS for responsive layout, design tokens, and visual styling.
- Vanilla JavaScript using native ES modules and browser APIs.
- LocalStorage for browser-local persistence.
- Python's built-in HTTP server for local development.

There are no frontend frameworks, package managers, or external runtime dependencies.

## Roadmap

| Phase | Status | Scope |
| --- | --- | --- |
| Phase 1 — Application shell | Complete | Responsive layout, navigation, dashboard preview, and section empty states. |
| Phase 2 — Data foundation | Complete | LocalStorage adapter, versioned store, record metadata, and browser test. |
| Phase 2.5 — Documentation and repository cleanup | Complete | Project documentation and ignore rules for local/generated files. |
| Phase 3 — Application features | Not started | To be scoped and approved before implementation. |

See [Architecture](docs/ARCHITECTURE.md) for how the current code works and [Development](docs/DEVELOPMENT.md) for local workflow instructions.
