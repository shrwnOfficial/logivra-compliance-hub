-- Migration: Team admin roles for Shrawan, Shivank, and slot for User 3
-- Ensures designated team members automatically receive admin privileges upon account creation or sign-in.

CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role public.app_role NOT NULL DEFAULT 'admin',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;

-- Allow admins to manage team members
CREATE POLICY "Admins can view and manage team members"
ON public.team_members FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed the initial 3 admin slots
INSERT INTO public.team_members (name, email, role, status)
VALUES
  ('Shrawan', 'shaan.09042@gmail.com', 'admin', 'active'),
  ('Shivank', 'shivnakrao7@gmail.com', 'admin', 'active'),
  ('Team Admin 3', 'pending-admin-3@logivra.internal', 'admin', 'pending_assignment')
ON CONFLICT (email) DO UPDATE
SET name = EXCLUDED.name, role = EXCLUDED.role;

-- Upgrade handle_new_user function to grant 'admin' role automatically to team members
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_whitelisted_admin BOOLEAN;
BEGIN
  -- Insert into public profiles
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;

  -- Check if user email is explicitly designated as an admin team member
  SELECT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE LOWER(email) = LOWER(NEW.email) AND role = 'admin'
  ) INTO is_whitelisted_admin;

  IF is_whitelisted_admin OR NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Retroactively grant 'admin' role to existing auth.users matching Shrawan and Shivank
DO $$
DECLARE
  usr RECORD;
BEGIN
  FOR usr IN
    SELECT id, email FROM auth.users
    WHERE LOWER(email) IN ('shaan.09042@gmail.com', 'shivnakrao7@gmail.com')
  LOOP
    INSERT INTO public.user_roles (user_id, role)
    VALUES (usr.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END LOOP;
END;
$$;
