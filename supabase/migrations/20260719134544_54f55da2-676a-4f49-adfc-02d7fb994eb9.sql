CREATE TABLE IF NOT EXISTS public.post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL CHECK (length(content) BETWEEN 1 AND 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS post_comments_post_idx ON public.post_comments(post_id, created_at ASC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_comments TO authenticated;
GRANT ALL ON public.post_comments TO service_role;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Comments are viewable by authenticated" ON public.post_comments;
-- Comments are viewable by authenticated policy intentionally public for authenticated users
CREATE POLICY "Comments are viewable by authenticated" ON public.post_comments FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Users can insert their own comments" ON public.post_comments;
CREATE POLICY "Users can insert their own comments" ON public.post_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own comments" ON public.post_comments;
CREATE POLICY "Users can update their own comments" ON public.post_comments FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.post_comments;
CREATE POLICY "Users can delete their own comments" ON public.post_comments FOR DELETE TO authenticated USING (auth.uid() = user_id);
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_comments;