import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { z } from "zod";

const bodySchema = z.object({
  context: z.string().trim().min(1).max(1000),
  language: z.enum(["uz", "ru", "en"]).default("uz"),
});

export const Route = createFileRoute("/api/ai/micro-insight")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = bodySchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return new Response("Bad Request", { status: 400 });
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");
        const lang = parsed.data.language;
        const langInstr = lang === "ru" ? "На русском." : lang === "en" ? "In English." : "O'zbek tilida.";
        const system = `Sen Nadir. 1-2 jumla, emojisiz, maqtovsiz mikro-kuzatuv ber. ${langInstr}
Bitta aniq kuzatuv + bitta kichik savol. Bo'sh iboralar YO'Q.`;
        const { text } = await generateText({ model, system, prompt: parsed.data.context });
        return Response.json({ insight: text.trim() });
      },
    },
  },
});
