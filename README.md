# Sankalp — Compliance Hub

Landing site, booking API, and founder admin for **Sankalp** — compliance management for Indian small and medium manufacturers. Environmental and safety obligations are mapped from consents, permits, and plant paperwork into a trackable plan.

## Stack

- **Frontend:** TanStack Start, Vite, React, Tailwind (Bun)
- **API:** FastAPI (`backend/`) — consultation bookings and email notifications
- **Data & auth:** Supabase (bookings, slots, admin allowlist)

## Local development

```bash
cp .env.example .env   # fill Supabase keys and VITE_API_URL
bun install
bun run dev
```

Booking emails and slot confirmation require the API:

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # same Supabase + Resend vars as needed
uvicorn app.main:app --reload --port 8000
```

Set `VITE_API_URL=http://localhost:8000` in the root `.env`.

## Admin

Founder-only access at `/admin`. See [ADMIN_SETUP.md](./ADMIN_SETUP.md) for Supabase keys, migrations, and `bun run seed:admins`.

## Deploy (production)

Step-by-step: **[DEPLOY.md](./DEPLOY.md)** — Vercel (site), Render (booking API + emails), Supabase (auth + DB).  
Copy env names from **[env.deploy.example](./env.deploy.example)**.

## Docker (local full stack)

```bash
docker compose up --build
```

Site: http://localhost:3000 — Admin: http://localhost:3000/admin. Details: [DOCKER.md](./DOCKER.md).

## Scripts

| Command | Purpose |
| -------- | -------- |
| `bun run dev` | Dev server |
| `bun run build` | Production build |
| `bun run lint` | ESLint |
| `bun run seed:admins` | Create/update allowlisted admin users |
| `bun run verify:supabase` | Check URL and API keys match one project |
