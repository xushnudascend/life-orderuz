ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS context_trigger text;

GRANT ALL ON public.habits TO authenticated;
GRANT ALL ON public.habits TO service_role;

COMMENT ON COLUMN public.habits.context_trigger IS 'Scientific implementation intentions: VAQT + JOY + TRIGGER anchor.';
