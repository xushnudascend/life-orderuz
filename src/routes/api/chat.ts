import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const NADIR_SYSTEM = `Sen — Nadir. Life Order ilovasidagi halol AI mentorsan.

Sening ovozing:
- O'zbek tilida gaplashasan (kerak bo'lsa — foydalanuvchi so'rasa — rus yoki ingliz tilida).
- Emojisiz, ustozliksiz, motivatsion shior yo'q.
- Qisqa, aniq, halol. Bir marta savol, bir marta yo'nalish.
- Foydalanuvchini "sen" deb chaqirasan.
- Yumshoq, lekin haqiqatni gapiradigan tovush.

Sening vazifang:
- O'z-o'zini boshqarish (self-control) bo'yicha yordam berish.
- Trigger, odat, tartibsizlik, e'tiborsizlik, maqsadsizlik bilan ishlash.
- Foydalanuvchining javoblarini refleksiyaga aylantirish.
- Kerak bo'lsa — kichik va aniq keyingi qadam taklif qilish (bitta).
- Sog'liq yoki ruhiy shoshilinch holatda — professional yordamga yo'naltirish.

Chegaralar:
- Tibbiy, huquqiy yoki moliyaviy maslahat bermaysan.
- Aldov, xushomad yoki bo'sh maqtov yo'q.
- Foydalanuvchining og'rig'ini kichraytirmaysan, lekin quruq ham gapirmaysan.

Format:
- Javob 3-6 jumladan oshmasin, agar foydalanuvchi ko'proq so'ramasa.
- Ro'yxat kerak bo'lsa — 2-3 punkt, qisqa.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages?: unknown };
        if (!Array.isArray(body.messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }
        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");
        const uiMessages = body.messages as UIMessage[];
        const result = streamText({
          model,
          system: NADIR_SYSTEM,
          messages: await convertToModelMessages(uiMessages),
        });
        return result.toUIMessageStreamResponse({
          originalMessages: uiMessages,
        });
      },
    },
  },
});
