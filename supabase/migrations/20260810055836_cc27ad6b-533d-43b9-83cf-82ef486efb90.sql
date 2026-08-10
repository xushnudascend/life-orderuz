-- Re-creating Telegram linking infrastructure with security hardening
-- The previous migration seems to have failed or not applied telegram_link_tokens

CREATE TABLE IF NOT EXISTS public.telegram_link_tokens (
    token text PRIMARY KEY DEFAULT encode(gen_random_bytes(24), 'hex'), -- Increased entropy
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone DEFAULT (now() + interval '10 minutes'),
    consumed_at timestamp with time zone
);

GRANT SELECT, INSERT ON public.telegram_link_tokens TO authenticated;
GRANT ALL ON public.telegram_link_tokens TO service_role;

ALTER TABLE public.telegram_link_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their tokens" ON public.telegram_link_tokens
    FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Link mapping table
CREATE TABLE IF NOT EXISTS public.telegram_links (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    telegram_chat_id text NOT NULL UNIQUE,
    created_at timestamp with time zone DEFAULT now()
);

GRANT SELECT ON public.telegram_links TO authenticated;
GRANT ALL ON public.telegram_links TO service_role;

ALTER TABLE public.telegram_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own links" ON public.telegram_links
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Secure function to consume tokens
CREATE OR REPLACE FUNCTION public.consume_telegram_link_token(_token text, _telegram_chat_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    target_user_id uuid;
BEGIN
    -- Find a valid, non-expired, non-consumed token
    SELECT user_id INTO target_user_id
    FROM public.telegram_link_tokens
    WHERE token = _token
      AND expires_at > now()
      AND consumed_at IS NULL;

    IF target_user_id IS NULL THEN
        RETURN false;
    END IF;

    -- Mark token as consumed
    UPDATE public.telegram_link_tokens
    SET consumed_at = now()
    WHERE token = _token;

    -- Upsert link mapping
    INSERT INTO public.telegram_links (user_id, telegram_chat_id)
    VALUES (target_user_id, _telegram_chat_id)
    ON CONFLICT (user_id) DO UPDATE SET telegram_chat_id = EXCLUDED.telegram_chat_id;

    RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.consume_telegram_link_token TO service_role;
