/** Must stay in sync with `public.admin_allowlist` in Supabase. */
export const ADMIN_ALLOWLIST_EMAILS = [
  "shaan.09042@gmail.com", // Shrawan
  "shivankrao7@gmail.com", // Shivank
] as const;

/** Set when Surya's email is confirmed, then re-run `bun run seed:admins`. */
export const SURYA_ADMIN_EMAIL: string | null = null;

export function getAdminAllowlist(): ReadonlySet<string> {
  const emails = [...ADMIN_ALLOWLIST_EMAILS];
  if (SURYA_ADMIN_EMAIL) emails.push(SURYA_ADMIN_EMAIL);
  return new Set(emails.map((e) => e.toLowerCase()));
}

export function isAllowlistedAdminEmail(email: string): boolean {
  return getAdminAllowlist().has(email.trim().toLowerCase());
}
