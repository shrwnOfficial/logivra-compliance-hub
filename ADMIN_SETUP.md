# Sankalp admin login setup

## Who can access `/admin`

| Name | Email |
| ------ | ------ |
| Shrawan | `shaan.09042@gmail.com` |
| Shivank | `shivankrao7@gmail.com` |
| Surya | `suryashubohit@gmail.com` |

Open **`/admin`** on your site → redirects to **`/auth`** if not signed in. No email verification step after seeding (accounts are created with `email_confirm: true`).

## 1. Supabase `.env`

If `bun run verify:supabase` fails, URL and keys are mismatched.

1. [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. Copy keys into root `.env` (see `.env.example`).

```bash
bun run verify:supabase
```

## 2. Database migrations

Run all files under `supabase/migrations/` on your project (SQL Editor or Supabase CLI), including `20260927140000_admin_allowlist_add_surya.sql`.

## 3. Create admin users (password, no verification email)

From project root with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env`:

```bash
ADMIN_SEED_PASSWORD='your-team-password' bun run seed:admins
```

This will:

- Add all three emails to `admin_allowlist`
- Create or update Auth users with **email already confirmed**
- Set the password you pass in `ADMIN_SEED_PASSWORD`
- Grant the `admin` role in `user_roles`

**Do not commit passwords.** Use your team password only in this command (or in a local `.env` as `ADMIN_SEED_PASSWORD`, which is gitignored).

**Supabase:** Authentication → Providers → Email — you can turn off “Confirm email” for new signups if you prefer; seeding already marks founder accounts confirmed.

## 4. Booking emails to all admins

The Python API sends Resend notifications to every address in `ADMIN_NOTIFY_EMAILS` when a client books a slot or requests a callback. Set in `.env` / Render:

```env
ADMIN_NOTIFY_EMAILS=shaan.09042@gmail.com,shivankrao7@gmail.com,suryashubohit@gmail.com
RESEND_API_KEY=re_...
```

The frontend must use the API (`VITE_API_URL` pointing at your API host). Without the API, bookings may still save to Supabase but **will not email admins**.

## 5. Sign in

Go to `/admin`, sign in with an allowlisted email and the password from step 3. Change passwords in Supabase → Authentication → Users when ready.
