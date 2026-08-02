import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { verifySupabaseBearer } from "@/lib/verify-bearer.server";
import { enforceAiDailyBudget } from "@/lib/ai-budget";
import { z } from "zod";

const bodySchema = z.object({
  goal: z.string().trim().min(4).max(500),
  days: z.number().int().min(7).max(60).default(21),
  archetype: z.string().max(40).optional(),
  language: z.enum(["uz", "ru", "en"]).default("uz"),
});

export const Route = createFileRoute("/api/ai/generate-plan")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = await verifySupabaseBearer(request);
        if (!auth.ok) return auth.response;
        const budget = await enforceAiDailyBudget(auth.userId, "generate-plan");
        if (!budget.ok) return budget.response;
        const parsed = bodySchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return new Response("Bad Request", { status: 400 });
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const { goal, days, archetype, language } = parsed.data;
        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const langInstr =
          language === "ru" ? "На русском." : language === "en" ? "In English." : "O'zbek tilida.";
        const system = `Sen Nadir — reja tuzuvchi. Emojisiz, halol. ${langInstr}
Faqat JSON qaytar: {"title": string, "days": [{"day": number, "focus": string, "actions": string[]}]}
Har kun uchun 2-4 ta aniq, o'lchanadigan mikro-harakat. Motivatsion shior YO'Q.`;

        const prompt = `Maqsad: ${goal}\nDavomiylik: ${days} kun${archetype ? `\nArxetip: ${archetype}` : ""}`;
        const { text } = await generateText({ model, system, prompt });

        // JSON ekstraksiya
        const match = text.match(/\{[\s\S]*\}/);
        try {
          const plan = match ? JSON.parse(match[0]) : { title: goal, days: [] };
          return Response.json({ plan });
        } catch {
          return Response.json({ plan: { title: goal, days: [], raw: text } });
        }
      },
    },
  },
});
