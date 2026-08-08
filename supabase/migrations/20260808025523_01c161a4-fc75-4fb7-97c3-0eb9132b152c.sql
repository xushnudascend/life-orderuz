-- 1. Roles Infrastructure (Secure)
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- 2. Payment Webhook Observability
CREATE TABLE IF NOT EXISTS public.payment_webhook_failures (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    provider text NOT NULL,
    payload jsonb NOT NULL,
    error_message text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);
GRANT SELECT ON public.payment_webhook_failures TO authenticated;
GRANT ALL ON public.payment_webhook_failures TO service_role;
ALTER TABLE public.payment_webhook_failures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view failures" ON public.payment_webhook_failures
    FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 3. Telegram Integration
CREATE TABLE IF NOT EXISTS public.telegram_users (
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    telegram_chat_id bigint PRIMARY KEY,
    username text,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.telegram_users TO authenticated;
GRANT ALL ON public.telegram_users TO service_role;
ALTER TABLE public.telegram_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own telegram link" ON public.telegram_users
    FOR ALL TO authenticated USING (auth.uid() = user_id);

-- 4. Behavioral Science — Habits (If-Then) & Onboarding (Stages of Change)
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS if_trigger text;
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS then_action text;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stage_of_change text;
DO $$ BEGIN
    ALTER TABLE public.profiles ADD CONSTRAINT stage_of_change_check 
    CHECK (stage_of_change IN ('precontemplation', 'contemplation', 'preparation', 'action', 'maintenance'));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 5. Forgiving Streak Logic
CREATE OR REPLACE FUNCTION public.apply_habit_log()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  s public.streaks%ROWTYPE;
  gap integer;
  new_current integer;
BEGIN
  -- Ensure row exists
  INSERT INTO public.streaks (user_id) VALUES (NEW.user_id)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT * INTO s FROM public.streaks WHERE user_id = NEW.user_id FOR UPDATE;

  IF s.last_check_in IS NULL THEN
    new_current := 1;
  ELSE
    gap := NEW.logged_date - s.last_check_in;
    IF gap <= 0 THEN
      RETURN NEW; -- already counted today (or backdated)
    ELSIF gap = 1 THEN
      new_current := s.current_days + 1;
    ELSIF s.freeze_active_until IS NOT NULL AND s.freeze_active_until >= NEW.logged_date - 1 THEN
      -- shield bridged the gap (SDT Autonomy/Competence protection)
      new_current := s.current_days + 1;
    ELSE
      -- FORGIVING STREAK: miss reduces rather than zeroing (Part B, 1)
      new_current := GREATEST(1, s.current_days - (gap - 1));
    END IF;
  END IF;

  UPDATE public.streaks
     SET current_days = new_current,
         longest_days = GREATEST(COALESCE(longest_days, 0), new_current),
         last_check_in = NEW.logged_date,
         updated_at = now()
   WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$function$;
