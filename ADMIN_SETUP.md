# GreenUdyog admin login setup

## 1. Sync `.env` with Supabase (fixes `Invalid API key`)

If `bun run verify:supabase` fails, your **URL and keys are from different sources**.

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → project **GreenUdyog** (`hawljlrbwjymhsrxzfaj`).
2. **SUPABASE_URL** is always `https://<project-ref>.supabase.co` — the ref is in the dashboard URL after `/project/`.
3. GreenUdyog URL: `https://hawljlrbwjymhsrxzfaj.supabase.co` (not the old Lovable ref `kqoiwtnxxtxsyiliuwbg`).
4. From **Connect**, copy into `.env`:

```env
SUPABASE_URL="https://<REFERENCE_ID>.supabase.co"
SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."
SUPABASE_SERVICE_ROLE_KEY="sb_secret_..."
VITE_SUPABASE_URL="same as SUPABASE_URL"
VITE_SUPABASE_PUBLISHABLE_KEY="same as publishable"
SUPABASE_PROJECT_ID="<REFERENCE_ID>"
VITE_SUPABASE_PROJECT_ID="<REFERENCE_ID>"
```

Use the **default** secret (Reveal → copy **entire** key). Do not mix keys from another project.

**Alternative:** **API Keys** page → **Legacy anon, service_role API keys** → put `service_role` JWT in `SUPABASE_SERVICE_ROLE_KEY` and `anon` in publishable fields.

5. Test:

```bash
bun run verify:supabase
bun run seed:admins
```

## 2. Database migrations (required on new GreenUdyog project)

The **hawljlrbwjymhsrxzfaj** database is empty until you run SQL.

1. Supabase → **SQL Editor** → **New query**
2. Paste contents of [`supabase/GREENUDYOG_RUN_IN_SQL_EDITOR.sql`](supabase/GREENUDYOG_RUN_IN_SQL_EDITOR.sql)
3. **Run**
4. Then: `bun run seed:admins`

## 3. Sign in

Open `/admin` → email `shaan.09042@gmail.com` or `shivankrao7@gmail.com`, password **`admin1`** (Supabase requires 6+ chars; override with `ADMIN_SEED_PASSWORD` when seeding).
