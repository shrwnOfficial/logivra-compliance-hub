-- Auto-confirm whitelisted team admin emails so password login works
-- without waiting on a confirmation email (common cause of "Invalid credentials"
-- right after Initialize / Set Password).

UPDATE auth.users
SET
  email_confirmed_at = COALESCE(email_confirmed_at, now()),
  updated_at = now()
WHERE LOWER(email) IN (
  'shaan.09042@gmail.com',
  'shivnakrao7@gmail.com',
  'team-admin3@logivra.com'
)
AND email_confirmed_at IS NULL;
