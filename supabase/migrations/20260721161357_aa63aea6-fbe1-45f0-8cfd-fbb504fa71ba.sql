-- 1. Assessment responses (raw answers)
CREATE TABLE IF NOT EXISTS public.assessment_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scale text NOT NULL,
  question_key text NOT NULL,
  value smallint NOT NULL CHECK (value BETWEEN 1 AND 5),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, question_key)
);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_user ON public.assessment_responses(user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.assessment_responses TO authenticated;
GRANT ALL ON public.assessment_responses TO service_role;
ALTER TABLE public.assessment_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own responses read" ON public.assessment_responses
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "own responses insert" ON public.assessment_responses
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "own responses update" ON public.assessment_responses
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "own responses delete" ON public.assessment_responses
  FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TRIGGER trg_assessment_responses_updated_at
  BEFORE UPDATE ON public.assessment_responses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. Assessment scores (computed snapshot)
CREATE TABLE IF NOT EXISTS public.assessment_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  potential smallint NOT NULL CHECK (potential BETWEEN 0 AND 100),
  discipline smallint NOT NULL CHECK (discipline BETWEEN 0 AND 100),
  focus smallint NOT NULL CHECK (focus BETWEEN 0 AND 100),
  addiction_risk smallint NOT NULL CHECK (addiction_risk BETWEEN 0 AND 100),
  scales jsonb NOT NULL DEFAULT '{}'::jsonb,
  weakest_scale text,
  computed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_assessment_scores_user ON public.assessment_scores(user_id, computed_at DESC);

GRANT SELECT ON public.assessment_scores TO authenticated;
GRANT ALL ON public.assessment_scores TO service_role;
ALTER TABLE public.assessment_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own scores read" ON public.assessment_scores
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE TRIGGER trg_assessment_scores_updated_at
  BEFORE UPDATE ON public.assessment_scores
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Roadmap stages
CREATE TABLE IF NOT EXISTS public.roadmap_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stage_index smallint NOT NULL CHECK (stage_index BETWEEN 0 AND 2),
  focus_area text NOT NULL,
  title text NOT NULL,
  description text,
  target_date date,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','done')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, stage_index)
);
CREATE INDEX IF NOT EXISTS idx_roadmap_stages_user ON public.roadmap_stages(user_id, stage_index);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.roadmap_stages TO authenticated;
GRANT ALL ON public.roadmap_stages TO service_role;
ALTER TABLE public.roadmap_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own roadmap read" ON public.roadmap_stages
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "own roadmap insert" ON public.roadmap_stages
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "own roadmap update" ON public.roadmap_stages
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "own roadmap delete" ON public.roadmap_stages
  FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TRIGGER trg_roadmap_stages_updated_at
  BEFORE UPDATE ON public.roadmap_stages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();