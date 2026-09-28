# Publish Sankalp (Vercel + Render + Supabase)

Follow these steps in order. When done, founders use **`/admin`** on the live site to see new bookings and follow up manually. **Email is optional** (`SEND_BOOKING_EMAILS=true` only after a verified Resend domain).

Reference template: [env.deploy.example](./env.deploy.example)

---

## 0. Prerequisites (one-time)

- [ ] Code on GitHub `main` (`shrwnOfficial/logivra-compliance-hub`)
- [ ] Supabase project with migrations already applied (you did this)
- [ ] `ADMIN_SEED_PASSWORD='…' bun run seed:admins` run against **production** Supabase (same project as deploy)
- [ ] (Optional later) [Resend](https://resend.com) + verified domain for automated booking email

---

## 1. Deploy the API on Render

1. Go to [Render](https://dashboard.render.com) → **New** → **Blueprint** (or connect repo and use `render.yaml`).
2. Select the GitHub repo, branch **`main`**.
3. Render creates **`sankalp-api`** from `backend/Dockerfile`.
4. In the service → **Environment**, set:

| Key | Value |
|-----|--------|
| `SUPABASE_URL` | `https://hawljlrbwjymhsrxzfaj.supabase.co` (your project) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → **secret** key (full `sb_secret_…`) |
| `SUPABASE_JWT_SECRET` | Supabase → Settings → API → **JWT Secret** |
| `SEND_BOOKING_EMAILS` | `false` for MVP (default); `true` when Resend domain is verified |
| `RESEND_API_KEY` | (Optional) `re_…` from Resend |
| `ADMIN_NOTIFY_EMAILS` | (Optional) founder inboxes when email is enabled |
| `FROM_EMAIL` | (Optional) verified domain address, not `onboarding@resend.dev` for real recipients |
| `DEFAULT_MEETING_URL` | Google Meet / Zoom link (for emails when enabled) |
| `CORS_ORIGINS` | Your Vercel URL, e.g. `https://logivra-compliance-hub.vercel.app` (set after step 2 if unknown) |

5. **Save** and wait for deploy. Copy the public URL, e.g. `https://sankalp-api.onrender.com`.
6. Test: open `https://YOUR-API.onrender.com/api/health` → should return JSON OK.

---

## 2. Deploy the website on Vercel

1. Go to [Vercel](https://vercel.com) → **Add New** → **Project** → import `logivra-compliance-hub`.
2. Framework: detected via `vercel.json` (`bun run build` with Nitro Vercel preset).
3. **Environment Variables** (Production + Preview):

| Key | Value |
|-----|--------|
| `VITE_SUPABASE_URL` | Same as `SUPABASE_URL` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_…` (not secret key) |
| `VITE_API_URL` | Render URL from step 1, **no trailing slash** |

4. Deploy. Note your site URL, e.g. `https://logivra-compliance-hub.vercel.app`.

---

## 3. Link API and site (CORS)

1. Render → `sankalp-api` → **Environment** → update `CORS_ORIGINS` to your **exact** Vercel URL:
   - `https://your-project.vercel.app`
   - Add preview URL too if you test previews: `https://your-project-*.vercel.app` is not supported as wildcard — use the main production URL for CORS.
2. **Manual Deploy** on Render if needed.

---

## 4. Supabase Auth (required for `/admin` on live URL)

1. Supabase → **Authentication** → **URL configuration**
2. **Site URL:** `https://your-project.vercel.app`
3. **Redirect URLs** — add:
   - `https://your-project.vercel.app/**`
   - `http://localhost:8080/**`
   - `http://localhost:5173/**`
4. **Save**

(Optional) **Providers → Email** → disable **Confirm email** — founders are already confirmed via seed.

---

## 5. Production smoke test

| Test | How |
|------|-----|
| Landing | Open Vercel URL |
| Admin login | `https://your-site.vercel.app/admin` → sign in with founder email + team password |
| API from browser | DevTools → Network: booking should `POST` to `VITE_API_URL/api/bookings` |
| Leads | Book a slot → row appears in **/admin** → Bookings |
| Callback | Submit callback form → same **/admin** list |

**Render API is required** for public slot booking (marks slots booked via service role). **Resend is not required** for MVP.

**Slot bookings:** Clients must pick a slot from the API (real UUID). Auto-generated fallback slots without the API do not create valid bookings.

---

## 6. After every env change

| Change | Action |
|--------|--------|
| `VITE_*` on Vercel | **Redeploy** frontend (new build) |
| Render env | **Redeploy** API |
| New founder | `seed:admins` + allowlist SQL + redeploy not required |

---

## 7. Troubleshooting

| Symptom | Fix |
|---------|-----|
| `/admin` works locally, not on Vercel | Supabase redirect URLs + `VITE_SUPABASE_*` on Vercel |
| Booking succeeds, no row in admin | `VITE_API_URL` wrong; API down; check Render logs |
| Email not sent (expected MVP) | `SEND_BOOKING_EMAILS=false`; use `/admin`. For mail later: verify domain + `SEND_BOOKING_EMAILS=true` |
| CORS error in browser | `CORS_ORIGINS` on Render must match Vercel origin exactly |
| `Slot is no longer available` | Pick a slot from admin; ensure API uses service role key |
| Render 502 on first request | Free tier cold start — wait ~30s and retry |

---

## Local parity

Same variables in root `.env` and `backend/.env` (or root only — API loads `../.env`). See [DOCKER.md](./DOCKER.md) for `docker compose`.

Admin setup: [ADMIN_SETUP.md](./ADMIN_SETUP.md)
