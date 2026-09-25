/**
 * Quick check that .env keys match your Supabase project.
 *   bun run verify:supabase
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  const path = resolve(process.cwd(), ".env");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    process.env[key] = val;
  }
}

loadEnv();

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const pub = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;

function client(key: string) {
  return createClient(url!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function rawApikeyProbe(key: string) {
  const res = await fetch(`${url}/rest/v1/demo_requests?select=id&limit=1`, {
    headers: { apikey: key },
  });
  const body = (await res.text()).slice(0, 120);
  // 200 = table exists; 404 PGRST205 = key valid but table missing (run migrations)
  const keyOk = res.ok || (res.status === 404 && body.includes("PGRST205"));
  return { status: res.status, keyOk, body };
}

async function main() {
  if (!url) {
    console.error("Missing SUPABASE_URL");
    process.exit(1);
  }
  const ref = url?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  console.log("Project URL:", url);
  if (ref) console.log("Reference ID in URL:", ref, "(must match Settings → General)");

  if (pub) {
    const raw = await rawApikeyProbe(pub);
    console.log(
      `Publishable (REST apikey): HTTP ${raw.status}`,
      raw.keyOk ? "OK — key matches this project" : raw.body,
    );
    if (!raw.keyOk) {
      console.error(
        "\nKeys do not match this project URL. In Supabase click **Connect** (top) and copy:\n" +
          "  • Project URL\n" +
          "  • Publishable key (default)\n" +
          "  • Secret key (default, Reveal full string)\n" +
          "Update ALL lines in .env. Or use **Legacy** tab → anon + service_role JWT keys.\n",
      );
      process.exit(1);
    }
  }

  if (!secret) {
    console.error("\nSUPABASE_SERVICE_ROLE_KEY is not set.");
    process.exit(1);
  }

  const admin = client(secret);
  const { data, error: authError } = await admin.auth.admin.listUsers({ perPage: 1 });
  if (authError) {
    const raw = await rawApikeyProbe("secret", secret);
    console.log(`Secret (REST apikey): HTTP ${raw.status}`, raw.ok ? "OK" : raw.body);
    console.log("Secret (auth admin):", authError.message);
    console.error(
      "\nUse the **default** secret from Connect / API Keys (full sb_secret_...), same project as the URL.\n",
    );
    process.exit(1);
  }

  console.log("Secret key: OK — auth admin API works");
  console.log(`  (sample: ${data.users.length} user(s) visible in first page)`);

  const { error: tableError } = await admin.from("admin_allowlist").select("email").limit(1);
  if (tableError) {
    console.log(
      "\nWarning: admin_allowlist:",
      tableError.message,
      "\n→ Run SQL migrations in Supabase SQL Editor, then: bun run seed:admins",
    );
  } else {
    console.log("admin_allowlist table: OK");
    console.log("\nRun: bun run seed:admins");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
