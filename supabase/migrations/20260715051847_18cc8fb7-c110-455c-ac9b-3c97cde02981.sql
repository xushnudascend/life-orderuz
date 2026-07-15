
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS notify_daily boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_streak boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS daily_reminder_time time NOT NULL DEFAULT '09:00';
