import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { verifySupabaseBearer } from "@/lib/verify-bearer.server";
import { z } from "zod";

const bodySchema = z.object({
  stats: z.object({
    weekStart: z.string(),
    activeDays: z.number().int().min(0).max(7),
    habitCompletionPct: z.number().min(0).max(100),
    streak: z.number().int().min(0),
    disciplineScore: z.number().min(0).max(100),
    missedDays: z.number().int().min(0).max(7),
    xpGained: z.number().int().min(0),
  }),
  language: z.enum(["uz", "ru", "en"]).default("uz"),
});

export const Route = createFileRoute("/api/ai/weekly-report")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = await verifySupabaseBearer(request);
        if (!auth.ok) return auth.response;
        const parsed = bodySchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return new Response("Bad Request", { status: 400 });
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const { stats, language } = parsed.data;
        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const langInstr = language === "ru" ? "Отвечай на русском." : language === "en" ? "Answer in English." : "O'zbek tilida javob ber.";
        const system = `Sen Nadir — halol hafta tahlilchisi. Emojisiz, maqtovsiz. ${langInstr}
Format:
1) Bir jumlada haftaning haqiqiy holati.
2) Uchta aniq kuchli tomon (raqam bilan).
3) Uchta aniq bo'shliq (raqam bilan, ayblovsiz).
4) Keyingi hafta uchun 2 ta aniq mikro-qadam.`;

        const prompt = `Statistika:
- Faol kunlar: ${stats.activeDays}/7
- Odat bajarish: ${stats.habitCompletionPct}%
- Streak: ${stats.streak} kun
- Discipline: ${stats.disciplineScore}/100
- O'tkazilgan kunlar: ${stats.missedDays}
- XP: +${stats.xpGained}
- Hafta boshi: ${stats.weekStart}`;

        const { text } = await generateText({ model, system, prompt });
        return Response.json({ report: text });
      },
    },
  },
});
