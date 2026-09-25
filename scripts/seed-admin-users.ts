/**
 * One-time (re-runnable) provisioning for founder admin accounts.
 * Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env (server keys).
 *
 *   bun run seed:admins
 *
 * Default password: admin (override with ADMIN_SEED_PASSWORD).
 * Supabase may require min password length 6 — lower it in Dashboard → Auth → Providers → Email if needed.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile() {
  const path = resolve(process.cwd(), ".env");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

loadEnvFile();

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUPABASE_SECRET_KEY;
// Supabase minimum is 6 characters; use admin1 unless ADMIN_SEED_PASSWORD is set.
const password = process.env.ADMIN_SEED_PASSWORD ?? "admin1";

const founders: { name: string; email: string }[] = [
  { name: "Shrawan", email: "shaan.09042@gmail.com" },
  { name: "Shivank", email: "shivankrao7@gmail.com" },
];

const surya = process.env.SURYA_ADMIN_EMAIL?.trim();
if (surya) founders.push({ name: "Surya", email: surya });

if (!url || !serviceKey) {
  console.error("\nCannot seed admin users — missing Supabase credentials in .env\n");
  if (url) console.error("  ✓ SUPABASE_URL is set");
  else console.error("  ✗ SUPABASE_URL is missing");
  if (serviceKey) console.error("  ✓ SUPABASE_SERVICE_ROLE_KEY is set");
  else {
    console.error("  ✗ SUPABASE_SERVICE_ROLE_KEY is missing (this is why seed failed)");
    console.error("\nAdd one line to logivra-compliance-hub/.env :\n");
    console.error('  SUPABASE_SERVICE_ROLE_KEY="your-secret-key"\n');
    console.error("Get it from Supabase Dashboard → Project Settings → API");
    console.error("  • Legacy: copy the service_role key (secret, not anon/publishable)");
    console.error("  • New keys: copy the secret key (starts with sb_secret_)\n");
    console.error("Never commit this value or put it in VITE_* variables.\n");
  }
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function ensureAllowlist(email: string) {
  const { error } = await supabase.from("admin_allowlist").upsert({ email: email.toLowerCase() });
  if (error) throw new Error(`allowlist ${email}: ${error.message}`);
}

async function ensureAdminRole(userId: string) {
  const { error } = await supabase.from("user_roles").upsert(
    { user_id: userId, role: "admin" },
    { onConflict: "user_id,role" },
  );
  if (error) throw new Error(`user_roles: ${error.message}`);
}

async function main() {
  console.log("Seeding GreenUdyog admin users (email confirmed, no verification mail)…\n");

  for (const { name, email } of founders) {
    const normalized = email.toLowerCase();
    await ensureAllowlist(normalized);

    let userId: string | undefined;

    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email: normalized,
      password,
      email_confirm: true,
    });

    if (!createError && created.user) {
      userId = created.user.id;
      console.log(`✓ ${name}: created (${normalized})`);
    } else {
      const { data: list } = await supabase.auth.admin.listUsers({ perPage: 1000 });
      const existing = list?.users?.find((u) => u.email?.toLowerCase() === normalized);
      if (!existing) {
        throw new Error(`create ${email}: ${createError?.message ?? "unknown"}`);
      }
      const { error: updateError } = await supabase.auth.admin.updateUserById(existing.id, {
        password,
        email_confirm: true,
      });
      if (updateError) throw new Error(`update ${email}: ${updateError.message}`);
      userId = existing.id;
      console.log(`✓ ${name}: updated password & confirmed (${normalized})`);
    }

    if (userId) await ensureAdminRole(userId);
  }

  console.log(`\nDone. Sign in at /auth with password "${password}" (change after first login).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
