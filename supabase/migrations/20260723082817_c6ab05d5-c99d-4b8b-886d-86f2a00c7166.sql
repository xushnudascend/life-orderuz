
-- === nadir_threads ===
CREATE TABLE public.nadir_threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Nadir bilan',
  is_primary BOOLEAN NOT NULL DEFAULT true,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX nadir_threads_user_idx ON public.nadir_threads(user_id, last_message_at DESC);
CREATE UNIQUE INDEX nadir_threads_primary_uidx
  ON public.nadir_threads(user_id) WHERE is_primary = true AND archived_at IS NULL;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.nadir_threads TO authenticated;
GRANT ALL ON public.nadir_threads TO service_role;
ALTER TABLE public.nadir_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own threads select" ON public.nadir_threads
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own threads insert" ON public.nadir_threads
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own threads update" ON public.nadir_threads
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own threads delete" ON public.nadir_threads
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER nadir_threads_set_updated_at
  BEFORE UPDATE ON public.nadir_threads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- === nadir_messages ===
CREATE TABLE public.nadir_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES public.nadir_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content TEXT NOT NULL DEFAULT '',
  parts JSONB,
  context_hint TEXT,
  external_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX nadir_messages_thread_idx ON public.nadir_messages(thread_id, created_at ASC);
CREATE INDEX nadir_messages_user_idx ON public.nadir_messages(user_id, created_at DESC);

GRANT SELECT, INSERT, DELETE ON public.nadir_messages TO authenticated;
GRANT ALL ON public.nadir_messages TO service_role;
ALTER TABLE public.nadir_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own messages select" ON public.nadir_messages
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own messages insert" ON public.nadir_messages
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own messages delete" ON public.nadir_messages
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- bump thread.last_message_at whenever a message is inserted
CREATE OR REPLACE FUNCTION public.touch_nadir_thread()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  UPDATE public.nadir_threads
     SET last_message_at = now(), updated_at = now()
   WHERE id = NEW.thread_id;
  RETURN NEW;
END $$;

CREATE TRIGGER nadir_messages_touch_thread
  AFTER INSERT ON public.nadir_messages
  FOR EACH ROW EXECUTE FUNCTION public.touch_nadir_thread();

-- === notification_budget ===
CREATE TABLE public.notification_budget (
  user_id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  weekly_max INT NOT NULL DEFAULT 5 CHECK (weekly_max BETWEEN 0 AND 30),
  week_start DATE NOT NULL DEFAULT date_trunc('week', (now() AT TIME ZONE 'UTC'))::date,
  sent_this_week INT NOT NULL DEFAULT 0 CHECK (sent_this_week >= 0),
  paused_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.notification_budget TO authenticated;
GRANT ALL ON public.notification_budget TO service_role;
ALTER TABLE public.notification_budget ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own budget select" ON public.notification_budget
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own budget insert" ON public.notification_budget
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own budget update" ON public.notification_budget
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER notification_budget_set_updated_at
  BEFORE UPDATE ON public.notification_budget
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- server-side helper to atomically try consuming one notification from the weekly budget
CREATE OR REPLACE FUNCTION public.try_consume_notification(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cur_week DATE := date_trunc('week', (now() AT TIME ZONE 'UTC'))::date;
  row_budget public.notification_budget;
BEGIN
  INSERT INTO public.notification_budget(user_id) VALUES (_user_id)
    ON CONFLICT (user_id) DO NOTHING;

  SELECT * INTO row_budget FROM public.notification_budget
    WHERE user_id = _user_id FOR UPDATE;

  IF row_budget.paused_until IS NOT NULL AND row_budget.paused_until > now() THEN
    RETURN false;
  END IF;

  IF row_budget.week_start <> cur_week THEN
    UPDATE public.notification_budget
       SET week_start = cur_week, sent_this_week = 0, updated_at = now()
     WHERE user_id = _user_id;
    row_budget.sent_this_week := 0;
  END IF;

  IF row_budget.sent_this_week >= row_budget.weekly_max THEN
    RETURN false;
  END IF;

  UPDATE public.notification_budget
     SET sent_this_week = sent_this_week + 1, updated_at = now()
   WHERE user_id = _user_id;

  RETURN true;
END $$;

REVOKE ALL ON FUNCTION public.try_consume_notification(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.try_consume_notification(UUID) TO service_role;
