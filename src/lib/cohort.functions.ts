import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const TierSchema = z.enum(["inner5", "trust15", "circle50"]);

export const joinCohort = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ tier: TierSchema }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: cohort, error } = await supabase.rpc("join_cohort", { _tier: data.tier });
    if (error) throw new Error(error.message);
    // Fetch peer count and members preview (respects RLS)
    const { data: members } = await supabase
      .from("cohort_members")
      .select("user_id, joined_at")
      .eq("cohort_id", (cohort as { id: string }).id)
      .order("joined_at", { ascending: true });
    return { cohort, memberCount: members?.length ?? 0, self: userId };
  });

// "Senga o'xshaganlar" mirror — count peers by archetype
export const archetypePeers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: me } = await supabase
      .from("profiles")
      .select("archetype, plan_length_days")
      .eq("id", userId)
      .maybeSingle();
    if (!me?.archetype) return { archetype: null, sameArchetype: 0, samePlan: 0 };
    const { count: sameArchetype } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("archetype", me.archetype);
    const { count: samePlan } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("archetype", me.archetype)
      .eq("plan_length_days", me.plan_length_days ?? 30);
    return {
      archetype: me.archetype,
      sameArchetype: (sameArchetype ?? 1) - 1, // exclude self
      samePlan: Math.max(0, (samePlan ?? 1) - 1),
    };
  });
