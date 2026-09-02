# Community Networking and Events Discovery Platform

A React + Vite frontend built from the SRS, implementing the pages and component
structure in **Appendix I** (`App.jsx`, `NavBar.jsx`, `Login.jsx`, `Register.jsx`,
`Dashboard.jsx`, `Footer.jsx`) plus a `Discover` page for geo-location event/community
discovery.

This is a **frontend-only** build. There is no Spring Boot backend — auth, events,
communities, and analytics all run on mock data (see `src/data/mockData.js`) and a
lightweight `localStorage`-backed session, so the whole thing works standalone and is
instantly deployable. Swap the mock calls for real requests to the REST API described
in Appendix H when the backend is ready.

## What's included

- **Home** — hero with a live "discovery radar," feature grid, RBAC preview
- **Login** — matches the SRS copy exactly, incl. the `"Invalid credentials..."` error
- **Register** — 3-step form with the validation rules from Appendix C (alphabetic name,
  10-digit phone, password strength) and the success message from the spec
- **Dashboard** — protected route; role-aware KPIs/actions/feed, switchable across
  Member / Moderator / Event Organiser / Community Manager / Admin per Appendix A
- **Discover** — live search, category filter, distance slider, sort, community list
- **NavBar / Footer** — per Appendix I, including the exact footer copyright line

## Run locally

```bash
npm install
npm run dev
```

Visit the printed local URL (typically `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview   # optional local check of the production build
```

## Deploy to Vercel

**Option A — Vercel CLI**

```bash
npm i -g vercel
vercel        # first deploy, follow the prompts
vercel --prod # promote to production
```

**Option B — Git + Vercel dashboard**

1. Push this folder to a GitHub/GitLab/Bitbucket repo.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Vite. Confirm:
   - Build command: `vite build` (or `npm run build`)
   - Output directory: `dist`
4. Deploy. The included `vercel.json` rewrites all routes to `index.html` so
   client-side routes like `/discover` and `/dashboard` work on refresh/direct link.

No environment variables are required for this build.

## Project structure

```
src/
  components/    NavBar, Footer, ProtectedRoute, ErrorBoundary, Radar
  context/       AuthContext (mock session), ToastContext (notifications)
  data/          mockData.js — events, communities, roles, activity, feed
  pages/         Home, Login, Register, Dashboard, Discover
  App.jsx        Route definitions
  main.jsx       App entry point
  index.css      Design system (tokens, layout, components)
```
