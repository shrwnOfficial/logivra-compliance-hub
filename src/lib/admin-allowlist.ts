/** Must stay in sync with `public.admin_allowlist` in Supabase. */
export const ADMIN_ALLOWLIST_EMAILS = [
  "shaan.09042@gmail.com", // Shrawan
  "shivankrao7@gmail.com", // Shivank
  "suryashubohit@gmail.com", // Surya
] as const;

export function getAdminAllowlist(): ReadonlySet<string> {
  return new Set(ADMIN_ALLOWLIST_EMAILS.map((e) => e.toLowerCase()));
}

export function isAllowlistedAdminEmail(email: string): boolean {
  return getAdminAllowlist().has(email.trim().toLowerCase());
}
