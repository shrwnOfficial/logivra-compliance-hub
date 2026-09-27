# Docker

Run the **web** app and **booking API** together locally.

## Prerequisites

1. Root `.env` with Supabase and Resend (see `.env.example`).
2. Set `VITE_API_URL=http://localhost:8000` so the browser can reach the API.
3. In `backend` env (same `.env` loaded by compose): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`, `RESEND_API_KEY`, `ADMIN_NOTIFY_EMAILS` (all three founders).

## Commands

```bash
docker compose build
docker compose up
```

| Service | URL |
| -------- | ----- |
| Site | http://localhost:3000 |
| Admin | http://localhost:3000/admin |
| API health | http://localhost:8000/api/health |

## Build notes

- **Web** image builds with `NITRO_PRESET=node-server` (Node SSR, not Cloudflare).
- **Vite** variables are baked in at build time; change them → rebuild `web`.
- **API** uses `backend/Dockerfile` (Python 3.12 + uvicorn).

## Admin users

Docker does not seed Supabase. On the host (with `.env`):

```bash
bun run seed:admins
```

See [ADMIN_SETUP.md](./ADMIN_SETUP.md).
