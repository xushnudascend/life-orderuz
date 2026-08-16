import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { verifySupabaseBearer } from "@/lib/verify-bearer.server";
import { enforceAiDailyBudget } from "@/lib/ai-budget";
import { z } from "zod";

const bodySchema = z.object({
  archetype: z.string().trim().min(1).max(64),
  energyTime: z.string().trim().max(64).optional().default(""),
  planDays: z.union([z.literal(7), z.literal(30)]),
  triggers: z.array(z.string().max(64)).max(20).optional().default([]),
});

export const Route = createFileRoute("/api/ai/onboarding-nudge")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = await verifySupabaseBearer(request);
        if (!auth.ok) return auth.response;
        const budget = await enforceAiDailyBudget(auth.userId, "onboarding-nudge");
        if (!budget.ok) return budget.response;
        const parsed = bodySchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return new Response("Bad Request", { status: 400 });

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const { archetype, energyTime, planDays, triggers } = parsed.data;
        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const system = `You are Nadir, an AI mentor and conscience in the "Life Order" (Self-Control OS) system.
Your task is to analyze user onboarding results and provide a firm, honest "Aha!" nudge (personal protocol).
Your style:
- No flattery.
- Speak the direct truth.
- Identify their triggers.
- Suggest a rule in "If X - then Y" format.
- Speak like a Master.
- Force self-reflection.
- Focus on systems, not motivation.

IMPORTANT: Respond in the language the user used or in English/Russian/Uzbek as appropriate. Default to the detected context.`;

        const prompt = `Archetype: ${archetype}
Energy Time: ${energyTime || "unknown"}
Plan Days: ${planDays} days
Triggers: ${triggers.join(", ") || "none"}

User just finished onboarding. Write a personal nudge leading to their first micro-step.`;

        const { text } = await generateText({ model, system, prompt });
        return Response.json({ nudge: text.trim() });
      },
    },
  },
});
