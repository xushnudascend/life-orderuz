
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS viloyat text,
  ADD COLUMN IF NOT EXISTS archetype text,
  ADD COLUMN IF NOT EXISTS timezone text NOT NULL DEFAULT 'Asia/Tashkent',
  ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS animations_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS ai_mentor_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS auto_shrink_on_excuse boolean NOT NULL DEFAULT true;

ALTER TABLE public.habits
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'habit',
  ADD COLUMN IF NOT EXISTS scheduled_for date;

ALTER TABLE public.meals
  ADD COLUMN IF NOT EXISTS image_url text;

DROP POLICY IF EXISTS "Public profiles are viewable" ON public.profiles;
CREATE POLICY "Public profiles are viewable"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (is_public = true);

CREATE TABLE IF NOT EXISTS public.community_channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.community_channels TO authenticated, anon;
GRANT ALL ON public.community_channels TO service_role;
ALTER TABLE public.community_channels ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Channels are viewable by everyone" ON public.community_channels;
CREATE POLICY "Channels are viewable by everyone"
  ON public.community_channels FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid NOT NULL REFERENCES public.community_channels(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS community_posts_channel_idx ON public.community_posts(channel_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_posts TO authenticated;
GRANT ALL ON public.community_posts TO service_role;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Posts are viewable by authenticated" ON public.community_posts;
CREATE POLICY "Posts are viewable by authenticated"
  ON public.community_posts FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Users can insert their own posts" ON public.community_posts;
CREATE POLICY "Users can insert their own posts"
  ON public.community_posts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own posts" ON public.community_posts;
CREATE POLICY "Users can update their own posts"
  ON public.community_posts FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.community_posts;
CREATE POLICY "Users can delete their own posts"
  ON public.community_posts FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

INSERT INTO public.community_channels (slug, title, description, sort_order) VALUES
  ('umumiy', 'Umumiy', 'Umumiy suhbat', 1),
  ('intizom', 'Intizom', 'Intizom haqida mavzular', 2),
  ('chaqiriqlar', 'Chaqiriqlar', 'Haftalik chaqiriqlar', 3),
  ('kitobxonlar', 'Kitobxonlar', 'Kitob va o''qish', 4),
  ('liderlar', 'Liderlar', 'Eng faol a''zolar suhbati', 5)
ON CONFLICT (slug) DO NOTHING;
