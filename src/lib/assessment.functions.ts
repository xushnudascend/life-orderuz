import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import {
  QUESTIONS,
  SCALES,
  computeAllScores,
  buildRoadmap,
  stageTargetDate,
  type ScaleKey,
} from "@/lib/assessment-scales";

const SubmitInput = z.object({
  responses: z.record(z.string(), z.number().int().min(1).max(5)),
});

const questionKeySet = new Set(QUESTIONS.map((q) => q.key));

/**
 * Submit assessment responses, compute scores, store snapshot, build roadmap.
 */
export const submitAssessment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => SubmitInput.parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    // Use admin client for writes — userId is trusted from validated JWT.
    // This avoids intermittent RLS failures with JWT header forwarding.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Sanitize & validate keys
    const clean: Record<string, number> = {};
    for (const [k, v] of Object.entries(data.responses)) {
      if (!questionKeySet.has(k)) continue;
      clean[k] = v;
    }
    if (Object.keys(clean).length !== QUESTIONS.length) {
      throw new Error(
        `Iltimos, barcha savollarga javob bering (${Object.keys(clean).length}/${QUESTIONS.length}).`,
      );
    }

    // 2. Compute
    const scores = computeAllScores(clean);
    if (!scores) throw new Error("Skorlarni hisoblashda xato.");

    // 3. Persist raw responses (upsert)
    const rows = QUESTIONS.map((q) => {
      const meta = SCALES.find((s) => s.key === q.scale)!;
      return {
        user_id: userId,
        scale: meta.key,
        question_key: q.key,
        value: clean[q.key],
      };
    });
    const { error: respErr } = await supabaseAdmin
      .from("assessment_responses")
      .upsert(rows, { onConflict: "user_id,question_key" });
    if (respErr) throw new Error(respErr.message);

    // 4. Insert score snapshot
    const { error: scoreErr } = await supabaseAdmin.from("assessment_scores").insert({
      user_id: userId,
      potential: scores.potential,
      discipline: scores.discipline,
      focus: scores.focus,
      addiction_risk: scores.addiction_risk,
      scales: scores.scales,
      weakest_scale: scores.weakest_scale,
    });
    if (scoreErr) throw new Error(scoreErr.message);

    // 5. Roadmap (upsert 3 stages)
    const seeds = buildRoadmap(scores);
    const stageRows = seeds.map((seed, i) => ({
      user_id: userId,
      stage_index: seed.stage_index,
      focus_area: seed.focus_area,
      title: seed.title,
      description: seed.description,
      target_date: stageTargetDate(i).toISOString().slice(0, 10),
      status: i === 0 ? "active" : "pending",
    }));
    const { error: roadmapErr } = await supabaseAdmin
      .from("roadmap_stages")
      .upsert(stageRows, { onConflict: "user_id,stage_index" });
    if (roadmapErr) throw new Error(roadmapErr.message);

    // 6. Save a rich Nadir memory so the AI mentor remembers this profile.
    try {
      const weakestMeta = SCALES.find((s) => s.key === scores.weakest_scale);
      const summary = [
        `Human Potential: ${scores.potential}/100`,
        `Discipline: ${scores.discipline}, Focus: ${scores.focus}, Addiction risk: ${scores.addiction_risk}`,
        `Eng zaif joy: ${weakestMeta?.title ?? scores.weakest_scale}`,
        `Shkalalar: ${SCALES.map((s) => `${s.short}=${scores.scales[s.key]}`).join(", ")}`,
      ].join(" · ");
      await supabaseAdmin.from("nadir_memories").insert({
        user_id: userId,
        kind: "assessment",
        content: summary,
        importance: 5,
      });
    } catch {
      // best-effort — do not block user progress
    }

    return { scores, roadmap: seeds };
  });

/** Load the latest score snapshot + roadmap (for dashboard / roadmap page). */
export const loadAssessment = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [{ data: score }, { data: stages }] = await Promise.all([
      supabase
        .from("assessment_scores")
        .select("potential,discipline,focus,addiction_risk,scales,weakest_scale,computed_at")
        .eq("user_id", userId)
        .order("computed_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("roadmap_stages")
        .select("stage_index,focus_area,title,description,target_date,status")
        .eq("user_id", userId)
        .order("stage_index"),
    ]);
    return {
      score: score ?? null,
      roadmap: stages ?? [],
    };
  });

/** Mark a roadmap stage as done (and next as active). */
const StageInput = z.object({ stage_index: z.number().int().min(0).max(2) });

export const completeStage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => StageInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("roadmap_stages")
      .update({ status: "done" })
      .eq("user_id", userId)
      .eq("stage_index", data.stage_index);
    if (error) throw new Error(error.message);
    if (data.stage_index < 2) {
      await supabase
        .from("roadmap_stages")
        .update({ status: "active" })
        .eq("user_id", userId)
        .eq("stage_index", data.stage_index + 1);
    }
    return { ok: true };
  });

export type { ScaleKey };
