# LEDGER development

## Requirements

- Windows with PowerShell.
- A modern browser with JavaScript modules and LocalStorage.
- Python 3 for the built-in local web server (`py` or `python` command).

No package installation or build step is required.

## Start the local server

Open PowerShell in the repository folder and run:

```powershell
py -m http.server 8000
```

If the Python launcher is unavailable, use:

```powershell
python -m http.server 8000
```

Open <http://localhost:8000> in your browser. To stop the server, return to PowerShell and press **Ctrl+C**.

Serving the files over HTTP is recommended so native JavaScript ES modules work consistently in the browser.

## Run the data foundation test

1. Start the local server using the steps above.
2. Open <http://localhost:8000/tests/data-foundation.test.html>.
3. Wait for the result message. A successful run displays `PASS`.

The test uses uniquely named temporary LocalStorage keys and removes them after the run. It checks the schema version, saving and reading a general-purpose record, IDs and timestamps, updates, persistence through a new store instance, concurrent writes, deletion, and recovery from invalid JSON. It does not modify the application's `ledger.data` key.

This is a browser test page, not an automated command-line test runner. Check the browser console if the page reports `FAIL`.

## Basic conventions

- Keep the application framework-free and use native JavaScript modules.
- Keep each page in its own file under `js/pages/`; put shared UI markup in `js/components/`.
- Keep data access behind `js/data/storage.js` and `js/data/store.js`. Page code should not read or write LocalStorage directly.
- Keep public store and storage operations asynchronous.
- Preserve the store's generated `id`, `createdAt`, and `updatedAt` fields. Updates should not replace an ID or creation timestamp.
- Keep shared visual values in `css/tokens.css` and organize styles by their existing responsibility.
- Do not add a dependency or build system for a change that can use the existing browser APIs.
- Do not commit credentials, local environment files, generated output, or machine-specific files.
- Update these documents when implemented behavior or the development workflow changes.

## Local data note

Application data is saved in the current browser's LocalStorage under `ledger.data`. Clearing browser site data removes it. The data is not synchronized to another browser or device.
