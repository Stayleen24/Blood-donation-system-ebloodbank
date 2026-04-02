
-- Blood Camps table
CREATE TABLE public.blood_camps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  organizer TEXT NOT NULL,
  address TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT NOT NULL,
  camp_date DATE NOT NULL,
  start_time TEXT NOT NULL DEFAULT '09:00 AM',
  end_time TEXT NOT NULL DEFAULT '05:00 PM',
  contact_phone TEXT,
  contact_email TEXT,
  description TEXT,
  max_donors INTEGER NOT NULL DEFAULT 100,
  status TEXT NOT NULL DEFAULT 'upcoming',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blood_camps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view blood camps"
ON public.blood_camps FOR SELECT USING (true);

-- Camp Registrations table (user signs up for a camp)
CREATE TABLE public.camp_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  camp_id UUID NOT NULL REFERENCES public.blood_camps(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  age INTEGER NOT NULL,
  blood_group TEXT NOT NULL,
  has_donated BOOLEAN NOT NULL DEFAULT false,
  donated_at TIMESTAMPTZ,
  certificate_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.camp_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own registrations"
ON public.camp_registrations FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own registration"
ON public.camp_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own registration"
ON public.camp_registrations FOR UPDATE USING (auth.uid() = user_id);
