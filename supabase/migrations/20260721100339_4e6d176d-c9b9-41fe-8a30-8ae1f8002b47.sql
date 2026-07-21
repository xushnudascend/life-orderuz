
DO $$ BEGIN
  CREATE TYPE public.cohort_tier AS ENUM ('inner5', 'trust15', 'circle50');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier public.cohort_tier NOT NULL,
  capacity INTEGER NOT NULL,
  title TEXT,
  member_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cohort_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  tier public.cohort_tier NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, tier)
);

GRANT SELECT ON public.cohorts TO authenticated;
GRANT ALL ON public.cohorts TO service_role;
GRANT SELECT, INSERT ON public.cohort_members TO authenticated;
GRANT ALL ON public.cohort_members TO service_role;

ALTER TABLE public.cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohort_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read cohorts you belong to" ON public.cohorts;
CREATE POLICY "read cohorts you belong to" ON public.cohorts FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.cohort_members m WHERE m.cohort_id = cohorts.id AND m.user_id = auth.uid()));

DROP POLICY IF EXISTS "read cohort peers" ON public.cohort_members;
CREATE POLICY "read cohort peers" ON public.cohort_members FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.cohort_members me
               WHERE me.cohort_id = cohort_members.cohort_id AND me.user_id = auth.uid())
  );

CREATE INDEX IF NOT EXISTS idx_cohort_members_cohort ON public.cohort_members(cohort_id);
CREATE INDEX IF NOT EXISTS idx_cohort_members_user ON public.cohort_members(user_id);

CREATE OR REPLACE FUNCTION public.join_cohort(_tier public.cohort_tier)
RETURNS public.cohorts
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  cap int;
  target public.cohorts;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT c.* INTO target FROM public.cohorts c
    JOIN public.cohort_members m ON m.cohort_id = c.id
   WHERE m.user_id = uid AND m.tier = _tier LIMIT 1;
  IF FOUND THEN RETURN target; END IF;

  cap := CASE _tier
    WHEN 'inner5' THEN 5
    WHEN 'trust15' THEN 15
    WHEN 'circle50' THEN 50
  END;

  SELECT * INTO target FROM public.cohorts
   WHERE tier = _tier AND member_count < capacity
   ORDER BY created_at ASC LIMIT 1 FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO public.cohorts (tier, capacity, title)
    VALUES (_tier, cap, NULL) RETURNING * INTO target;
  END IF;

  INSERT INTO public.cohort_members (cohort_id, user_id, tier)
  VALUES (target.id, uid, _tier);

  UPDATE public.cohorts SET member_count = member_count + 1 WHERE id = target.id
    RETURNING * INTO target;

  RETURN target;
END;
$$;

REVOKE ALL ON FUNCTION public.join_cohort(public.cohort_tier) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.join_cohort(public.cohort_tier) TO authenticated;
