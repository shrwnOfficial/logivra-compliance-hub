# Publish Sankalp (Vercel + Render + Supabase)

Follow these steps in order. When done, founders can use **`/admin`** on the live site and **all three admins receive email** when someone books or requests a callback.

Reference template: [env.deploy.example](./env.deploy.example)

---

## 0. Prerequisites (one-time)

- [ ] Code on GitHub `main` (`shrwnOfficial/logivra-compliance-hub`)
- [ ] Supabase project with migrations already applied (you did this)
- [ ] `ADMIN_SEED_PASSWORD='…' bun run seed:admins` run against **production** Supabase (same project as deploy)
- [ ] [Resend](https://resend.com) account + API key; verify a sending domain for production mail (or use `onboarding@resend.dev` for limited testing)

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
| `RESEND_API_KEY` | `re_…` from Resend |
| `ADMIN_NOTIFY_EMAILS` | `shaan.09042@gmail.com,shivankrao7@gmail.com,suryashubohit@gmail.com` |
| `FROM_EMAIL` | `Sankalp <onboarding@resend.dev>` or your verified domain |
| `DEFAULT_MEETING_URL` | Google Meet / Zoom link for confirmation emails |
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
| Email | In **admin**, add a **future consultation slot** → on landing, book that slot → all three `ADMIN_NOTIFY_EMAILS` + client get mail (check Resend **Logs**) |
| Callback | Submit callback form → same admin emails |

**Slot bookings:** Clients must pick a slot created in admin (real UUID). Auto-generated fallback slots without the API do not send email.

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
| Booking succeeds, no email | `VITE_API_URL` wrong; API down; missing `RESEND_API_KEY`; check Resend logs |
| CORS error in browser | `CORS_ORIGINS` on Render must match Vercel origin exactly |
| `Slot is no longer available` | Pick a slot from admin; ensure API uses service role key |
| Render 502 on first request | Free tier cold start — wait ~30s and retry |

---

## Local parity

Same variables in root `.env` and `backend/.env` (or root only — API loads `../.env`). See [DOCKER.md](./DOCKER.md) for `docker compose`.

Admin setup: [ADMIN_SETUP.md](./ADMIN_SETUP.md)
