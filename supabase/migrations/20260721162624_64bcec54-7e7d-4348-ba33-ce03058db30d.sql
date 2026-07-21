CREATE TABLE public.nadir_memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  importance smallint NOT NULL DEFAULT 3 CHECK (importance BETWEEN 1 AND 5),
  kind text NOT NULL DEFAULT 'fact' CHECK (kind IN ('fact','goal','pattern','preference','trigger')),
  last_used_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX nadir_memories_user_recent_idx ON public.nadir_memories (user_id, importance DESC, last_used_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.nadir_memories TO authenticated;
GRANT ALL ON public.nadir_memories TO service_role;

ALTER TABLE public.nadir_memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own memories select" ON public.nadir_memories
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own memories insert" ON public.nadir_memories
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own memories update" ON public.nadir_memories
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own memories delete" ON public.nadir_memories
  FOR DELETE TO authenticated USING (auth.uid() = user_id);