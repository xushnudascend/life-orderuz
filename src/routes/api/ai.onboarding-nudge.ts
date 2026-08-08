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

        const system = `Sen Nadir ismli AIsan. Sen "Life Order" (Self-Control OS) tizimida foydalanuvchining shaxsiy mentoring va vijdonisan.
Sening vazifang - foydalanuvchining onboarding natijalarini ko'rib chiqib, unga qattiq-qo'l, halol va haqiqatni aytadigan, lekin hurmat saqlagan holda "Aha!" nudgesini (shaxsiy protokol) berish.
Sening uslubing:
- Maqtovlar yo'q ("Yaxshi ish" demaslik).
- To'g'ridan-to'g'ri haqiqatni aytish.
- Foydalanuvchiga uning triggerlarini ko'rsatib berish.
- Aniq "Agar X - men Y" formatidagi shaxsiy qoidani taklif qilish.
- O'zbekona madaniyatga mos, "Master" (ustoz) kabi gapirish.
- Foydalanuvchini o'z ustida ishlashga majburlash.
- Motivatsiya va'da qilma, tizimni taklif qil.`;

        const prompt = `Arxetip: ${archetype}
Energiya vaqti: ${energyTime || "aniqlanmagan"}
Rejaning davomiyligi: ${planDays} kun
Naqsh triggerlari: ${triggers.join(", ") || "yo'q"}

Foydalanuvchi hozirgina onboardingni tugatdi. Uni ertaga birinchi mikro-qadamga olib chiquvchi shaxsiy nudge yoz.`;

        const { text } = await generateText({ model, system, prompt });
        return Response.json({ nudge: text.trim() });
      },
    },
  },
});
