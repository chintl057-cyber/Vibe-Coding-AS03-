# Deployment Guide

This project is configured for a single Vercel deployment:

- React/Vite frontend from `frontend/`
- FastAPI backend through the Vercel Python serverless entrypoint at `api/index.py`
- API routes proxied under `/api/*`

## Required Vercel Environment Variables

Add these in **Vercel → Project → Settings → Environment Variables**:

```text
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-role-key
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
JWT_SECRET=use-a-long-random-production-secret
CORS_ORIGINS=https://your-vercel-domain.vercel.app,https://your-custom-domain.com
ENVIRONMENT=production
```

For a same-domain Vercel deployment, `VITE_API_URL` can be left empty or unset because the frontend calls relative `/api/...` routes in production.

## Vercel Settings

The root `vercel.json` already defines:

- Build command: `npm --prefix frontend install; npm --prefix frontend run build`
- Output directory: `frontend/dist`
- Python serverless function: `api/index.py`
- SPA fallback route to `/index.html`
- API rewrites to the FastAPI app

## Database Setup

Production startup no longer auto-creates database tables. Create the Supabase tables before deploying by using the SQL from `BACKEND_SETUP.md`.

## Local Production Checks

From the project root in PowerShell:

```powershell
Set-Location frontend; npm run build
```

Backend local development:

```powershell
Set-Location backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload
```