-- Ensure only founder emails are on the admin allowlist (Surya: add via seed or INSERT when email is known).

DELETE FROM public.admin_allowlist
WHERE lower(email) NOT IN (
  'shaan.09042@gmail.com',
  'shivankrao7@gmail.com'
);

INSERT INTO public.admin_allowlist (email) VALUES
  ('shaan.09042@gmail.com'),
  ('shivankrao7@gmail.com')
ON CONFLICT (email) DO NOTHING;
