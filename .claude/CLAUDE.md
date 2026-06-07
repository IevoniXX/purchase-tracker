# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is this

PurchaseTracker — a family webapp for managing online purchases through their lifecycle: wish list, ordered, in transit, pick up from post office, delivered. Built for two users (Ieva & Cesar) to align on what to buy and track where everything is.

## Tech stack

- **Frontend:** React 19 + Vite, served by nginx
- **Backend:** Python FastAPI + SQLAlchemy
- **Database:** SQLite (file-based, mounted as Docker volume at `./data/`)
- **Infra:** Docker Compose (two containers: `frontend`, `backend`)

## Development

```bash
# Start everything
docker compose up -d --build

# View at http://localhost:3000

# Stop
docker compose down

# View backend logs
docker compose logs backend

# Reset database (delete and restart to re-seed)
rm data/purchases.db && docker compose restart backend
```

The frontend nginx proxies `/api/*` requests to the backend container. No CORS config needed.

## Architecture

The backend is a straightforward CRUD API — all routes are in `backend/main.py`. The database has a single `items` table. On first startup with an empty DB, seed data is auto-inserted.

The frontend fetches from `/api/items` on mount. `src/data/mockData.js` still holds UI constants (statuses, supplier icons, section definitions) but no longer holds item data. `src/App.jsx` manages all state and passes `onDelete` handlers down through sections to cards.

API field names use `snake_case` (e.g., `bought_date`), frontend uses `camelCase` (e.g., `boughtDate`). The `toFrontend()` function in `App.jsx` does the mapping.
