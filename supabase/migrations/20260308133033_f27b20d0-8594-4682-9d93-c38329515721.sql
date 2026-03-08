
CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_id uuid REFERENCES public.family_members(id) ON DELETE SET NULL,
  doctor_name text NOT NULL,
  specialty text,
  appointment_date timestamp with time zone NOT NULL,
  location text,
  notes text,
  remind_before_hours integer NOT NULL DEFAULT 24,
  reminder_sent boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own appointments" ON public.appointments
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own appointments" ON public.appointments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments" ON public.appointments
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own appointments" ON public.appointments
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
