-- Add Surya to founder admin allowlist.

INSERT INTO public.admin_allowlist (email) VALUES
  ('suryashubohit@gmail.com')
ON CONFLICT (email) DO NOTHING;
