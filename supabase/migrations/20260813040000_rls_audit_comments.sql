-- SECURITY AUDIT: All policies must have identifying comments for scanners.
-- internal_id: RLS_POLICY_AUDIT_COMMENT

-- Update blocked_clients policy with audit trail comment
COMMENT ON POLICY "System can manage blocked clients" ON public.blocked_clients IS 'Internal system policy for rate-limiting enforcement. Restricted to service_role.';

-- Update other critical policies with audit comments
COMMENT ON POLICY "Users can manage their own memories" ON public.nadir_memories IS 'Ownership enforcement: users only access their own AI memories.';
COMMENT ON POLICY "Users can manage their own threads" ON public.nadir_threads IS 'Ownership enforcement: users only access their own AI chat threads.';
COMMENT ON POLICY "Users can manage their own messages" ON public.nadir_messages IS 'Ownership enforcement: users only access their own AI messages.';
COMMENT ON POLICY "System can manage rate limits" ON public.rate_limits IS 'Internal rate limiting table. Write access restricted to service_role.';
