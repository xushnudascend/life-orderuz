// Global subscription state hook — single source of truth for tier gating
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { freeTierLimits, proTierLimits } from "@/lib/limits";

export type Tier = "free" | "pro";

export type SubscriptionState = {
  tier: Tier;
  isPro: boolean;
  limits: typeof freeTierLimits;
  loading: boolean;
};

// Reads `profiles.subscription_tier` if present; falls back to 'free'.
// Non-breaking: works even before the column exists.
export function useSubscription(): SubscriptionState {
  const [tier, setTier] = useState<Tier>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        if (!cancelled) setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("id", u.user.id)
        .maybeSingle();
      if (cancelled) return;
      const t = (data as { subscription_tier?: string } | null)?.subscription_tier;
      setTier(t === "pro" ? "pro" : "free");
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const isPro = tier === "pro";
  return {
    tier,
    isPro,
    limits: isPro ? (proTierLimits as unknown as typeof freeTierLimits) : freeTierLimits,
    loading,
  };
}
