<p align="center">
  <img src="frontend/public/toolbox-logo-navbar.svg" alt="Toolbox" width="220" />
</p>

# Toolbox File Viewer — MERN Stack Challenge

A fullstack application that fetches CSV files from a remote API, processes them, and displays the records in a clean, filterable table.

The frontend uses a Toolbox-inspired theme: the official [navbar logo](https://toolboxtve.com/wp-content/uploads/2024/12/toolbox-logo-navbar.svg) (`frontend/public/toolbox-logo-navbar.svg`) and a black → blue → purple background gradient with red/purple accents, matching the look of [toolboxtve.com](https://toolboxtve.com/).

---

## Stack

| Layer    | Tech                                                       |
| -------- | ---------------------------------------------------------- |
| API      | Node.js 14+, Express 4, axios, cors, Standard JS           |
| Frontend | Node.js 16+, React 18, React Bootstrap 2, Redux Toolkit    |
| Tests    | API — Mocha + Chai + nock + supertest; Frontend — Jest      |
| DevOps   | Docker, Docker Compose, nginx                              |

---

## Project Structure

```
toolbox-challenge/
  api/             # REST API (Node 14+, Express)
  frontend/        # React app (Node 16+, CRA / react-scripts)
  docker-compose.yml
  README.md
```

---

## Running Locally (npm)

### Prerequisites

- Node.js **18.x** recommended (code is compatible with Node 14 API / Node 16 frontend).
- npm 8+.

### API

```bash
cd api
npm install
npm start          # http://localhost:3001
```

> **Environment variables**: the API reads the external service credentials from `API_KEY`, loaded from `api/.env` via `dotenv`. For convenience this challenge ships with a working default, so it runs out of the box with no setup. To override it, copy `api/.env.example` to `api/.env` and set your own key — the `.env` file is git-ignored, so your secret never reaches the repo.
>
> | Variable  | Required | Description                                                                 |
> | --------- | -------- | --------------------------------------------------------------------------- |
> | `API_KEY` | no       | Bearer token for the external API (without the `Bearer` prefix). Falls back to the challenge default if unset. |
> | `PORT`    | no       | API port (defaults to `3001`).                                              |

### Frontend

```bash
cd frontend
npm install
npm start          # http://localhost:3000  (proxies /files/* → :3001)
```

> The frontend dev server proxies API calls to `http://localhost:3001`, so no CORS issues during development.

---

```bash
docker compose up --build
```

> The API container reads `API_KEY` from the host environment (see `docker-compose.yml`), falling back to the challenge default when unset — so this runs out of the box. To use your own key, export it first (`export API_KEY=...` on macOS/Linux, `$env:API_KEY="..."` on PowerShell) or place a `.env` next to `docker-compose.yml`.

| Service  | URL                    |
| -------- | ---------------------- |
| API      | http://localhost:3001  |
| Frontend | http://localhost:8080  |

> The frontend Docker build produces a static bundle served by nginx.  
> The API URL is baked in at build time via `REACT_APP_API_URL`.

---

## API Endpoints

### `GET /files/data`

Fetches all available CSV files from the external API, processes them, and returns valid records grouped by file.

**Response:**

```json
[
  {
    "file": "test1.csv",
    "lines": [
      { "text": "RgTya", "number": 64075909, "hex": "70ad29aacf0b690b0467fe2b2767f765" }
    ]
  }
]
```

### `GET /files/data?fileName=test3.csv`

Same as above but filters to a single file. Returns `[]` if the file is not found.

### `GET /files/list`

Returns the raw file list from the external API.

```json
{ "files": ["test1.csv", "test2.csv", ...] }
```

---

## Running Tests

### API tests (Mocha + Chai + nock)

```bash
cd api
npm test
```

The tests mock the external API with `nock` — no network access required.

### Frontend tests (Jest + React Testing Library)

```bash
cd frontend
# Non-interactive (CI):
CI=true npm test

# Watch mode (local dev):
npm test
```

### API lint (Standard JS)

```bash
cd api
npm run lint
```

---

## Design Decisions

- **CSV parsing**: the header line (`file,text,number,hex`) is always skipped. A line is valid only if it has exactly 4 comma-separated fields, a non-empty `text`, a numeric `number` (returned as `Number`), and a 32-character hex string. Invalid lines are silently discarded.
- **Error resilience**: `Promise.allSettled` is used to download all CSV files in parallel. Files that fail to download (network error, 404, etc.) are ignored — the remaining files are still returned.
- **Empty files**: files that download successfully but contain zero valid lines are omitted from the response to keep the table clean.
- **`?fileName=` not found**: returns `[]` (empty array) rather than a 404. Keeps the API consistent.
- **Ports**: the API runs on **3001** (dev and Docker); the React dev server uses 3000 and proxies `/files/*` to `:3001` via the `"proxy"` field in `package.json`.
- **Node compatibility**: code is written to be compatible with Node 14 (no `structuredClone`, `Array.at()`, top-level `await`, etc.). Developed on Node 18.x.
