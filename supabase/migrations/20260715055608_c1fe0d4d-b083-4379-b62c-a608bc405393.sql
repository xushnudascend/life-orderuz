
-- 1) Tables first (no policies yet)
CREATE TABLE public.party_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  goal text,
  invite_code text NOT NULL UNIQUE DEFAULT substr(md5(random()::text), 1, 8),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.party_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id uuid NOT NULL REFERENCES public.party_challenges(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(party_id, user_id)
);

-- 2) Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.party_challenges TO authenticated;
GRANT ALL ON public.party_challenges TO service_role;
GRANT SELECT, INSERT, DELETE ON public.party_members TO authenticated;
GRANT ALL ON public.party_members TO service_role;

-- 3) RLS enable
ALTER TABLE public.party_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.party_members ENABLE ROW LEVEL SECURITY;

-- 4) Policies (both tables exist now, so cross-references work)
CREATE POLICY "member reads own membership rows"
  ON public.party_members FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.party_challenges p
    WHERE p.id = party_members.party_id AND p.owner_id = auth.uid()
  ));

CREATE POLICY "user joins self"
  ON public.party_members FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "user leaves self"
  ON public.party_members FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "read own or member parties"
  ON public.party_challenges FOR SELECT TO authenticated
  USING (owner_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.party_members m
    WHERE m.party_id = party_challenges.id AND m.user_id = auth.uid()
  ));

CREATE POLICY "owner writes party"
  ON public.party_challenges FOR ALL TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- 5) Profile columns for 21-day Temir Intizom quest
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS intizom_start_date date,
  ADD COLUMN IF NOT EXISTS intizom_completed boolean NOT NULL DEFAULT false;

-- 6) Meals image_url (idempotent)
ALTER TABLE public.meals
  ADD COLUMN IF NOT EXISTS image_url text;
