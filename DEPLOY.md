# GreenUdyog — deploy & CI/CD

## Prerequisites

1. Apply Supabase migration: `supabase/migrations/20260925120000_greenudyog_bookings.sql`
2. Copy `.env.example` → `.env` and fill Supabase + `VITE_API_URL`

## Free hosting

| Service             | Purpose                                                                              |
| ------------------- | ------------------------------------------------------------------------------------ |
| **Vercel** (Hobby)  | React site — connect GitLab, production branch `main`, root `logivra-compliance-hub` |
| **Render** (Free)   | Python API — use `render.yaml`, set env vars from `backend/.env.example`             |
| **Supabase** (Free) | Database + admin auth                                                                |

## Environment

**Vercel:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_API_URL` (Render API URL)

**Render:** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET` (Project Settings → API → JWT Secret), `RESEND_API_KEY`, `CORS_ORIGINS` (your Vercel domain), `ADMIN_NOTIFY_EMAILS`

## Admin access (founders only)

Allowed: **Shrawan** (`shaan.09042@gmail.com`), **Shivank** (`shivankrao7@gmail.com`), **Surya** (add email when ready).

### Provision accounts (no confirmation email)

From project root, with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env`:

```bash
bun run seed:admins
```

This creates or updates those users with password **`admin`** (override with `ADMIN_SEED_PASSWORD`), marks email confirmed, syncs `admin_allowlist`, and grants the `admin` role.

For Surya later:

```bash
SURYA_ADMIN_EMAIL=surya@example.com bun run seed:admins
```

Also add their email in `src/lib/admin-allowlist.ts` (`SURYA_ADMIN_EMAIL`) and run migration / allowlist INSERT.

**Supabase:** If seed fails on password length, set **Authentication → Providers → Email → minimum password length** to **5** (or use a longer `ADMIN_SEED_PASSWORD`).

Sign in at **`/admin`** → redirects to `/auth` if needed. **Change the default password** after first login (Supabase Dashboard → Authentication → Users).

## CI/CD

- **GitLab CI** (`.gitlab-ci.yml`): lint + build on every push
- **Vercel + Render**: auto-deploy when `main` is updated (connect repos in each dashboard)

## Local dev

```bash
bun install
bun run dev

cd backend && pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Set `VITE_API_URL=http://localhost:8000` for booking emails via API.
