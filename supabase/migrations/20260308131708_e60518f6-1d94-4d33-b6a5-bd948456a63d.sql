
-- Create family_members table
CREATE TABLE public.family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  age text,
  conditions text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can read own members" ON public.family_members
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own members" ON public.family_members
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own members" ON public.family_members
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own members" ON public.family_members
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Add member_id to reports table
ALTER TABLE public.reports ADD COLUMN member_id uuid REFERENCES public.family_members(id) ON DELETE SET NULL;
