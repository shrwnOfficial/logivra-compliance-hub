CREATE TABLE public.demo_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  company TEXT,
  message TEXT,
  source TEXT NOT NULL DEFAULT 'landing_page',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX demo_requests_created_at_idx ON public.demo_requests (created_at DESC);

GRANT INSERT ON public.demo_requests TO anon;
GRANT SELECT, INSERT, UPDATE ON public.demo_requests TO authenticated;
GRANT ALL ON public.demo_requests TO service_role;

ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

CREATE TYPE public.app_role AS ENUM ('admin', 'sales', 'user');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Anyone can submit a demo request"
ON public.demo_requests FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Sales and admins can view demo requests"
ON public.demo_requests FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'sales'));

CREATE POLICY "Sales and admins can update demo requests"
ON public.demo_requests FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'sales'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'sales'));

CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;

  -- First registered user becomes the admin so the sales team can be granted access.
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;ALTER TABLE public.demo_requests ADD COLUMN IF NOT EXISTS phone text;-- GreenUdyog: consultation booking, admin allowlist, analytics events

CREATE TABLE IF NOT EXISTS public.admin_allowlist (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.admin_allowlist (email) VALUES
  ('shaan.09042@gmail.com'),
  ('shivankrao7@gmail.com')
ON CONFLICT (email) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.admin_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.admin_settings (key, value) VALUES
  ('default_meeting_url', '')
ON CONFLICT (key) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.consultation_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  is_booked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS consultation_slots_starts_at_idx
  ON public.consultation_slots (starts_at);

CREATE TABLE IF NOT EXISTS public.consultation_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slot_id UUID REFERENCES public.consultation_slots(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  udyam_id TEXT,
  pollution_interests TEXT[] NOT NULL DEFAULT '{}',
  booking_type TEXT NOT NULL DEFAULT 'free_call',
  preferred_callback TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT consultation_bookings_status_check
    CHECK (status IN ('new', 'confirmed', 'completed', 'cancelled'))
);

CREATE INDEX IF NOT EXISTS consultation_bookings_created_at_idx
  ON public.consultation_bookings (created_at DESC);

CREATE TABLE IF NOT EXISTS public.site_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  session_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS site_events_name_created_idx
  ON public.site_events (event_name, created_at DESC);

ALTER TABLE public.consultation_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_allowlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.consultation_slots TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.consultation_bookings TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.consultation_slots TO service_role;
GRANT INSERT ON public.site_events TO anon, authenticated, service_role;
GRANT SELECT ON public.site_events TO authenticated, service_role;
GRANT ALL ON public.admin_settings TO service_role;
GRANT SELECT ON public.admin_allowlist TO service_role;

CREATE POLICY "Public can view open slots"
ON public.consultation_slots FOR SELECT TO anon, authenticated
USING (is_booked = false AND starts_at > now());

CREATE POLICY "Admins can view all slots"
ON public.consultation_slots FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage slots"
ON public.consultation_slots FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view bookings"
ON public.consultation_bookings FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update bookings"
ON public.consultation_bookings FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert site events"
ON public.site_events FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can read site events"
ON public.site_events FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read settings"
ON public.admin_settings FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update settings"
ON public.admin_settings FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;

  IF EXISTS (
    SELECT 1 FROM public.admin_allowlist
    WHERE lower(email) = lower(NEW.email)
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Seed sample slots: next 7 weekdays, 10:00–17:30 IST, 30-min slots (run once; skip if slots exist)
DO $$
DECLARE
  d DATE;
  t TIME;
  start_ts TIMESTAMPTZ;
  end_ts TIMESTAMPTZ;
BEGIN
  IF EXISTS (SELECT 1 FROM public.consultation_slots LIMIT 1) THEN
    RETURN;
  END IF;
  FOR i IN 1..14 LOOP
    d := (CURRENT_DATE AT TIME ZONE 'Asia/Kolkata')::date + i;
    IF EXTRACT(DOW FROM d) IN (0, 6) THEN
      CONTINUE;
    END IF;
    t := TIME '10:00';
    WHILE t < TIME '17:30' LOOP
      start_ts := (d + t) AT TIME ZONE 'Asia/Kolkata';
      end_ts := start_ts + INTERVAL '30 minutes';
      INSERT INTO public.consultation_slots (starts_at, ends_at, is_booked)
      VALUES (start_ts, end_ts, false);
      t := t + INTERVAL '30 minutes';
    END LOOP;
  END LOOP;
END $$;
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
