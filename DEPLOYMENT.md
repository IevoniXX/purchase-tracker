# Deployment Guide

How to get PurchaseTracker running on the internet so both you and your husband can use it.

## Step 1: Push to GitHub

```bash
cd /home/ievagrauduma/jira-tickets/onboarding/claude-install

# Initialize git repo
git init
git add -A
git commit -m "Initial commit: PurchaseTracker with React frontend + FastAPI backend"

# Create repo on GitHub (requires gh CLI — install with: sudo apt install gh)
gh auth login
gh repo create purchase-tracker --private --source=. --push
```

Your code is now on GitHub. The `--private` flag keeps it visible only to you.

## Step 2: Deploy to a PaaS

Below are three options. All have free tiers sufficient for this app.

### Option A: Railway (recommended for beginners)

Railway auto-detects Docker Compose and deploys both services.

1. Go to https://railway.app and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub Repo"
3. Select your `purchase-tracker` repo
4. Railway detects `docker-compose.yml` and creates both services
5. For the **frontend** service, add a public domain (Settings → Networking → Generate Domain)
6. For the **backend** service, ensure port 8000 is exposed internally (no public domain needed — nginx proxies to it)
7. For data persistence: Railway provides a volume — attach it to the backend service at `/app/data`

**Important:** Railway's free trial gives you $5 of usage. After that, the Hobby plan is $5/month. For a small app like this, you'll likely stay well under $5/month.

### Option B: Render

Render doesn't natively support Docker Compose, so you deploy the two services separately.

1. Go to https://render.com and sign in with GitHub
2. **Backend:** New → Web Service → connect your repo
   - Root Directory: `backend`
   - Runtime: Docker
   - Add a Disk (for SQLite persistence): mount at `/app/data`
3. **Frontend:** New → Static Site → connect your repo
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Note: since this is a static site, you'll need to update `src/api.js` to point to the backend's Render URL instead of `/api`

**Free tier:** Render's free tier works but spins down after 15 minutes of inactivity (30-second cold start on next visit).

### Option C: Fly.io

Fly.io gives you more control and works well with Docker.

1. Install flyctl: `curl -L https://fly.io/install.sh | sh`
2. Sign up: `fly auth signup`
3. Deploy backend:
   ```bash
   cd backend
   fly launch --name purchasetracker-api
   fly volumes create data --size 1
   # Update fly.toml to mount the volume at /app/data
   fly deploy
   ```
4. Deploy frontend:
   ```bash
   cd frontend
   # Update nginx.conf to proxy to purchasetracker-api.internal:8000
   fly launch --name purchasetracker-web
   fly deploy
   ```

**Free tier:** Fly.io offers 3 shared VMs and 1GB volumes for free.

## Step 3: CI/CD (automatic deploys on git push)

All three PaaS options above auto-deploy when you push to GitHub. No extra pipeline config needed — they watch your repo and rebuild on every push to `main`.

If you want more control (e.g., run tests before deploying), add a GitHub Actions workflow:

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Add your PaaS-specific deploy step here.
      # Railway: use the Railway GitHub integration (auto-deploys, no workflow needed)
      # Render: use the Render GitHub integration (auto-deploys, no workflow needed)
      # Fly.io: use superfly/flyctl-actions@v1
```

For Railway and Render, the built-in GitHub integration is sufficient — you don't need GitHub Actions at all unless you want to add a test step.

## Which one should I pick?

| | Railway | Render | Fly.io |
|---|---|---|---|
| Easiest setup | ✅ Yes | Medium | More hands-on |
| Docker Compose support | ✅ Native | ❌ Separate services | ❌ Separate services |
| Free tier | $5 trial credits | Free (sleeps after 15min) | 3 free VMs |
| SQLite persistence | Volume needed | Disk add-on | Volume needed |
| Auto-deploy from GitHub | ✅ | ✅ | ✅ |

**Recommendation: Start with Railway.** It's the closest to your local Docker Compose setup — least changes needed.
