-- TRIPWIRE: Security Audit Rails
-- 1. Payment Webhook Failures (Restricted to Admins)
CREATE TABLE IF NOT EXISTS public.payment_webhook_failures (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    provider text NOT NULL,
    payload jsonb NOT NULL,
    error_message text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

GRANT INSERT ON public.payment_webhook_failures TO anon, authenticated;
GRANT SELECT ON public.payment_webhook_failures TO authenticated;
GRANT ALL ON public.payment_webhook_failures TO service_role;

ALTER TABLE public.payment_webhook_failures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert failure logs" ON public.payment_webhook_failures
    FOR INSERT WITH CHECK (true);
-- NOTE: PUBLIC INSERT is intentional so that unauthenticated webhooks from Payme/Click 
-- can log their own failures for audit, but SELECT is restricted below.

CREATE POLICY "Admins can view failure logs" ON public.payment_webhook_failures
    FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 2. Telegram Links Table
CREATE TABLE IF NOT EXISTS public.telegram_links (
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    telegram_chat_id bigint PRIMARY KEY,
    linked_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.telegram_links TO authenticated;
GRANT ALL ON public.telegram_links TO service_role;

ALTER TABLE public.telegram_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own telegram link" ON public.telegram_links
    FOR ALL TO authenticated USING (auth.uid() = user_id);
