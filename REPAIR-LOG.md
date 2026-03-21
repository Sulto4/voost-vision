# Voost Vision Repair Log

Date: 2026-03-21
Branch: `fix/full-repair`
Production site: `https://voostvision.ro`
Final Netlify deploy: `69beb62c3286e0f343ee818b`
Final deploy URL: `https://69beb62c3286e0f343ee818b--voost-vision.netlify.app`
Active quick tunnel: `https://neil-celebrity-relevance-carbon.trycloudflare.com`

## Summary

The public site was repaired end-to-end by restoring the local PostgREST/proxy stack, repairing missing database objects and content, moving broken project thumbnails into the frontend, fixing the public bundle to point at the current backend tunnel, and redeploying the site to Netlify.

## Backend and Runtime

- Confirmed PostgreSQL 16.13 was already running locally on `localhost:5432`.
- Restarted `PostgREST` with `db/postgrest.conf` and verified it on `http://localhost:54321`.
- Fixed the Node proxy binding in `db/proxy/server.js` to listen on `127.0.0.1:54320` so `cloudflared` could reach it reliably.
- Started a Cloudflare quick tunnel with:
  - `cloudflared tunnel --url http://127.0.0.1:54320`
- Named Tunnel could not be created because Cloudflare origin credentials were not present locally:
  - missing `~/.cloudflared/cert.pem`

## Database Repairs

Executed `db/repair-20260321.sql` against `voost_vision` via:

```bash
/opt/homebrew/Cellar/postgresql@16/16.13/bin/psql -d voost_vision -f db/repair-20260321.sql
```

Repairs applied:

- Created `services` table and seeded 4 services:
  - Web Development
  - eCommerce
  - Digital Consulting
  - Maintenance and Support
- Created compatibility view `blog_posts` mapped from `articles`.
- Updated grants so `web_anon` can read/write the repaired public tables and read `blog_posts`.
- Normalized `projects` records and expanded them from 3 to 5:
  - Frizerul Tau
  - vreaumagnet.ro
  - AI Agents Agency
  - Voost Voice
  - Voost Level CRM
- Expanded `testimonials` from 2 to 5.
- Updated all project `thumbnail_url` values to relative frontend paths.
- Updated all 5 article `cover_image` values to local relative paths under `/blog-covers/`.

Final validated counts:

- `projects`: 5
- `articles`: 5
- `blog_posts`: 5
- `services`: 4
- `testimonials`: 5

## Frontend and Assets

Added local static media:

- `frontend/public/thumbnails/`
- `frontend/public/blog-covers/`

Copied existing project thumbnails from:

- `db/proxy/static/thumb-frizerul-tau.jpg`
- `db/proxy/static/thumb-frizerul-tau-hero.jpg`
- `db/proxy/static/thumb-ai-agents.jpg`

Created new local SVG assets for:

- `vreaumagnet.ro`
- `Voost Voice`
- `Voost Level CRM`
- all 5 blog article covers

Frontend changes:

- Added `ecommerce` to the public portfolio filters in `frontend/src/pages/Portfolio.tsx`.
- Added `frontend/.env.production` with the active quick tunnel URL.
- Updated `frontend/.env.example` to clarify local vs production Supabase URL usage.
- Added `frontend/playwright.smoke.spec.js` for smoke-check coverage.

## Build and Deploy

Important note: regular `netlify deploy` from inside the repo kept reusing an older git-context deploy. The final successful production deploy used a fresh, forced local build plus a manual `--no-build` upload from a temp snapshot outside the repo.

Forced production build used:

```bash
VITE_SUPABASE_URL='https://neil-celebrity-relevance-carbon.trycloudflare.com' \
VITE_SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoid2ViX2Fub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6OTk5OTk5OTk5OX0.N8FPSzLy4x4PGcx176qqprr3D57_R33OsllTfVMXv5A' \
npm run build
```

Manual publish snapshot:

- `/tmp/voost-netlify-dist-20260321-1519`

Final production deploy command:

```bash
netlify deploy --prod --dir /tmp/voost-netlify-dist-20260321-1519 --no-build --json
```

Validated that the live site now serves:

- bundle: `/assets/index-BDqvMSXq.js`
- backend URL inside bundle: `https://neil-celebrity-relevance-carbon.trycloudflare.com`

## Verification Performed

API checks:

- local proxy root: `http://127.0.0.1:54320/`
- local PostgREST root: `http://localhost:54321/`
- public tunnel:
  - `/rest/v1/projects`
  - `/rest/v1/services`
  - `/rest/v1/blog_posts`

Visual smoke checks:

- local preview on `http://127.0.0.1:4173`
- production screenshots on:
  - `https://voostvision.ro/`
  - `https://voostvision.ro/portofoliu`
  - `https://voostvision.ro/blog`

Confirmed:

- homepage loads featured projects and testimonials
- portfolio shows 5 projects with working local thumbnails
- blog shows published articles with working local cover images
- `services` and `blog_posts` endpoints respond through the public tunnel

## Remaining Operational Risk

- The site is currently backed by a Cloudflare quick tunnel, not a named tunnel.
- If the `cloudflared` process stops, the production site will lose live backend access until the tunnel is restarted and the frontend is rebuilt/redeployed with the new quick-tunnel URL.
- Permanent fix still recommended:
  - authenticate `cloudflared`
  - create a named tunnel
  - assign a stable subdomain
  - replace the quick tunnel URL in `frontend/.env.production`
  - rebuild and redeploy once
