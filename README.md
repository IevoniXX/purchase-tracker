# PurchaseTracker

A family webapp for managing online purchases through their lifecycle: wish list, ordered, in transit, pick up from post office, delivered. Built for two users to align on what to buy and track where everything is.

**Live:** https://purchase-tracker-production.up.railway.app/

## Tech Stack

- **Frontend:** React 19 + Vite, served by nginx
- **Backend:** Python FastAPI + SQLAlchemy
- **Database:** SQLite (file-based, mounted as Docker volume)
- **Infra:** Docker Compose (two containers: `frontend`, `backend`)

## Getting Started

```bash
# Start everything
docker compose up -d --build

# View at http://localhost:3000

# Stop
docker compose down
```

## Development

```bash
# View backend logs
docker compose logs backend

# Reset database (delete and restart to re-seed)
rm data/purchases.db && docker compose restart backend
```

The frontend nginx proxies `/api/*` requests to the backend container, so no CORS configuration is needed.

## Architecture

The backend is a CRUD API with all routes in `backend/main.py` and a single `items` table. On first startup with an empty database, seed data is auto-inserted.

The frontend fetches from `/api/items` on mount. `src/App.jsx` manages all state and passes handlers down through sections to cards.
