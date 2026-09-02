# Community Networking and Events Discovery Platform
Project link:
https://community-networking-platform.vercel.app/

Full project from the SRS, as one repo:

```
community-networking-platform/
  frontend/   React + Vite app (deploy to Vercel)
  backend/    Spring Boot 3 API (deploy to Railway/Render/Fly/AWS — not Vercel)
```

Each half has its own detailed README (`frontend/README.md`, `backend/README.md`).
This file is the quick-start for running both together locally.

## Current state

The frontend runs on mock data (`frontend/src/data/mockData.js`) plus a `localStorage`
session, so it works standalone with zero setup. The backend is a separate, fully-formed
Spring Boot API that isn't wired to the frontend yet — see **"Connecting them"** below.

## Run both locally

**Backend** (needs Java 17+ and Maven):
```bash
cd backend
mvn spring-boot:run
```
Runs on `http://localhost:8080`, in-memory H2 database, no setup required.

**Frontend** (needs Node 18+):
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`.

## Connecting them

To make the frontend call the real backend instead of mock data:

1. In `frontend`, add a `.env` file:
   ```
   VITE_API_BASE_URL=http://localhost:8080
   ```
2. In `frontend/src/context/AuthContext.jsx`, replace the mock `login`/`registerAccount`
   logic with `fetch` calls to `${import.meta.env.VITE_API_BASE_URL}/api/auth/login` and
   `/api/auth/register`, storing the returned JWT (instead of the fake user object) and
   sending it as `Authorization: Bearer <token>` on subsequent requests.
3. In `frontend/src/data/mockData.js`, replace the static `events`/`communities`/`feedPosts`
   arrays with `fetch` calls to `/api/events/discover`, `/api/communities/discover`, and
   `/api/feed`.

This is a deliberate boundary, not an oversight — it means the frontend deploys and demos
correctly on its own today, and the backend deploys and is testable (via `/h2-console` or
a REST client) on its own today, without one being blocked on the other.

## Deploying

- **Frontend → Vercel.** In the Vercel dashboard, when importing this repo, set
  **Root Directory** to `frontend`. Vercel auto-detects Vite (build: `vite build`,
  output: `dist`). Full details in `frontend/README.md`.
- **Backend → Railway / Render / Fly / AWS.** Point the service at the `backend`
  directory (most of these let you set a subdirectory as the build root). Set the
  environment variables listed in `backend/README.md` (`JWT_SECRET`, database creds,
  `CORS_ALLOWED_ORIGINS` pointing at your Vercel URL once you have it).

## A note on verification

The frontend was installed, built, and served in this environment — it works. The backend
was written and manually checked (package declarations, brace balance, consistent method
signatures across all files) but this sandbox can't reach Maven Central, so it hasn't been
through an actual `mvn compile` here. Run that locally as your first step.
