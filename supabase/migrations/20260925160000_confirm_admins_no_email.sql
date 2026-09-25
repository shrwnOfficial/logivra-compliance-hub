-- Run this once in Lovable Cloud SQL editor OR Supabase Dashboard → SQL Editor.
-- It confirms team admin emails so password login works without a confirmation email.

UPDATE auth.users
SET
  email_confirmed_at = COALESCE(email_confirmed_at, now()),
  updated_at = now()
WHERE LOWER(email) IN (
  'shaan.09042@gmail.com',
  'shivnakrao7@gmail.com',
  'team-admin3@logivra.com'
);

-- Optional helper for future initializes (safe: only whitelisted team_members / emails)
CREATE OR REPLACE FUNCTION public.confirm_whitelisted_admin(p_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  allowed boolean := false;
BEGIN
  SELECT LOWER(p_email) IN (
    'shaan.09042@gmail.com',
    'shivnakrao7@gmail.com',
    'team-admin3@logivra.com'
  ) INTO allowed;

  IF NOT allowed THEN
    RETURN false;
  END IF;

  UPDATE auth.users
  SET
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
  WHERE LOWER(email) = LOWER(p_email);

  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION public.confirm_whitelisted_admin(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.confirm_whitelisted_admin(text) TO anon, authenticated, service_role;
