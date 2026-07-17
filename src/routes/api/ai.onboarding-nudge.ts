import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { verifySupabaseBearer } from "@/lib/verify-bearer.server";
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
        const parsed = bodySchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return new Response("Bad Request", { status: 400 });

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const { archetype, energyTime, planDays, triggers } = parsed.data;
        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const system = `Sen Nadir — Life Order'ning ichki mentori. O'zbek tilida yoz.
JAVOB QAT'IY SHAKLDA:
1-qator: 6-10 so'zli, insho emas, kuchli xabar (foydalanuvchining arxetipi va energiya vaqtiga mos).
2-qator: bo'sh.
3-qator: "Ertangi 1-qadam:" bilan boshlangan aniq mikro-harakat (5 daqiqadan kam, joy va vaqt ko'rsatilgan).
Maqtov, emoji, hech qanday umumiy ibora YO'Q. Qat'iy va do'stona ohang.`;

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
