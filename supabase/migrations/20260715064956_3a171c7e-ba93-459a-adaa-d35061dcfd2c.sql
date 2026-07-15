
CREATE TABLE IF NOT EXISTS public.rate_limits (
  key TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (key, window_start)
);

GRANT ALL ON public.rate_limits TO service_role;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
-- No client policies: only service_role touches this via the helper.

CREATE INDEX IF NOT EXISTS rate_limits_window_idx ON public.rate_limits (window_start);

CREATE OR REPLACE FUNCTION public.rate_limit_hit(_key TEXT, _limit INTEGER, _window_seconds INTEGER)
RETURNS TABLE(allowed BOOLEAN, current_count INTEGER, retry_after_seconds INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  bucket TIMESTAMPTZ := date_trunc('second', now()) - (EXTRACT(EPOCH FROM now())::BIGINT % _window_seconds) * INTERVAL '1 second';
  new_count INTEGER;
BEGIN
  INSERT INTO public.rate_limits (key, window_start, count)
  VALUES (_key, bucket, 1)
  ON CONFLICT (key, window_start) DO UPDATE
    SET count = public.rate_limits.count + 1
  RETURNING count INTO new_count;

  -- Opportunistic GC of buckets older than 1 hour
  DELETE FROM public.rate_limits WHERE window_start < now() - INTERVAL '1 hour';

  RETURN QUERY SELECT
    (new_count <= _limit) AS allowed,
    new_count AS current_count,
    GREATEST(0, _window_seconds - EXTRACT(EPOCH FROM (now() - bucket))::INTEGER) AS retry_after_seconds;
END;
$$;

REVOKE ALL ON FUNCTION public.rate_limit_hit(TEXT, INTEGER, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.rate_limit_hit(TEXT, INTEGER, INTEGER) TO service_role;
