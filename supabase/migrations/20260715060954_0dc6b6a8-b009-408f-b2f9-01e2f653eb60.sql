
CREATE TABLE IF NOT EXISTS public.nadir_nudges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  message TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS nadir_nudges_user_created_idx ON public.nadir_nudges(user_id, created_at DESC);

GRANT SELECT, UPDATE ON public.nadir_nudges TO authenticated;
GRANT ALL ON public.nadir_nudges TO service_role;

ALTER TABLE public.nadir_nudges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own nudges select" ON public.nadir_nudges
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own nudges update" ON public.nadir_nudges
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
