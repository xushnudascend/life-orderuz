
-- 1) Subscription tier column
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT NOT NULL DEFAULT 'free'
  CHECK (subscription_tier IN ('free','pro'));

-- 2) Daily login bonus table
CREATE TABLE IF NOT EXISTS public.daily_login_bonus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  claimed_on DATE NOT NULL DEFAULT ((now() AT TIME ZONE 'UTC')::date),
  xp_awarded INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, claimed_on)
);

GRANT SELECT, INSERT ON public.daily_login_bonus TO authenticated;
GRANT ALL ON public.daily_login_bonus TO service_role;
ALTER TABLE public.daily_login_bonus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_read_daily_login_bonus" ON public.daily_login_bonus
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own_insert_daily_login_bonus" ON public.daily_login_bonus
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 3) Claim function
CREATE OR REPLACE FUNCTION public.claim_daily_login_bonus()
RETURNS TABLE(awarded BOOLEAN, xp INTEGER)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  today date := (now() AT TIME ZONE 'UTC')::date;
  amount int := 5;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF EXISTS (SELECT 1 FROM public.daily_login_bonus WHERE user_id = uid AND claimed_on = today) THEN
    RETURN QUERY SELECT false, 0;
    RETURN;
  END IF;
  INSERT INTO public.daily_login_bonus(user_id, claimed_on, xp_awarded) VALUES (uid, today, amount);
  INSERT INTO public.xp_events (user_id, amount, reason, ref_type)
  VALUES (uid, amount, 'daily_login', 'login');
  RETURN QUERY SELECT true, amount;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.claim_daily_login_bonus() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_daily_login_bonus() TO authenticated;

-- 4) Shield earn-back: replace use_shield to allow 1 shield every 7 clean days
--    Instead of hard "1 per 7 days" cap, check streak.current_days progress since last shield.
CREATE OR REPLACE FUNCTION public.use_shield(_note text DEFAULT NULL)
RETURNS public.shields
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  today date := (now() AT TIME ZONE 'UTC')::date;
  last_shield_date date;
  days_since int;
  new_shield public.shields;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  SELECT MAX(used_on) INTO last_shield_date FROM public.shields WHERE user_id = uid;

  IF last_shield_date IS NOT NULL THEN
    days_since := today - last_shield_date;
    -- Earn-back: allow next shield only after 7 clean days
    IF days_since < 7 THEN
      RAISE EXCEPTION 'shield_earn_back_required: % days remaining', (7 - days_since);
    END IF;
  END IF;

  INSERT INTO public.shields (user_id, used_on, reason, note)
  VALUES (uid, today, 'freeze', _note)
  RETURNING * INTO new_shield;

  INSERT INTO public.streaks (user_id, freeze_active_until)
  VALUES (uid, today)
  ON CONFLICT (user_id) DO UPDATE
    SET freeze_active_until = GREATEST(COALESCE(public.streaks.freeze_active_until, today), today),
        updated_at = now();

  RETURN new_shield;
END;
$$;
