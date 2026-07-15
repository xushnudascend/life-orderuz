import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { rateLimit } from "@/lib/rate-limit";
import { verifySupabaseBearer } from "@/lib/verify-bearer.server";

/**
 * Nadir tone-guard + real Supabase stats injection.
 * Client mentor.tsx faylida `transport.body` orqali `userStats` yuboriladi;
 * bu yerda system prompt'ga qo'shiladi.
 */
const NADIR_BASE = `Sen — Nadir. Life Order ilovasidagi halol AI mentorsan.

Sening ovozing:
- O'zbek tilida gaplashasan (foydalanuvchi so'rasa — rus/ingliz).
- Emojisiz, ustozliksiz, motivatsion shior yo'q.
- Qisqa, aniq, halol. Foydalanuvchini "sen" deb chaqirasan.
- Yumshoq, lekin haqiqatni gapiradigan tovush.

Tone-guard (qat'iy taqiqlar):
- "Ajoyibsan!", "Zo'r!", "Sen qahramonsan" kabi bo'sh maqtov TAQIQLANADI.
- Emoji, exclamation-motivation, "You got this!" turidagi shiorlar YO'Q.
- Foydalanuvchini xafa qilma, lekin haqiqatni yumshatib buzma.
- Aduляция, xushomad, quruq empatiya yo'q. Aniq savol yoki aniq qadam.

Chegaralar:
- Tibbiy, huquqiy, moliyaviy maslahat bermaysan.
- Ruhiy shoshilinch holatda — professional yordamga yo'naltirasan.

Format:
- Javob 3-6 jumladan oshmasin.
- Ro'yxat kerak bo'lsa — 2-3 punkt.
- Har javob oxirida bitta aniq savol yoki bitta kichik keyingi qadam.`;

type UserStats = {
  displayName?: string | null;
  level?: number | null;
  totalXp?: number | null;
  currentStreak?: number | null;
  disciplineScore?: number | null;
  activeDays7?: number | null;
  habitCompletion7?: number | null;
  missedYesterday?: boolean | null;
  archetype?: string | null;
  planLength?: number | null;
};

function buildContext(s: UserStats | undefined): string {
  if (!s) return "";
  const parts: string[] = [];
  if (s.displayName) parts.push(`Ism: ${s.displayName}`);
  if (typeof s.level === "number") parts.push(`Daraja: ${s.level}`);
  if (typeof s.totalXp === "number") parts.push(`Jami XP: ${s.totalXp}`);
  if (typeof s.currentStreak === "number") parts.push(`Streak: ${s.currentStreak} kun`);
  if (typeof s.disciplineScore === "number") parts.push(`Discipline: ${s.disciplineScore}/100`);
  if (typeof s.activeDays7 === "number") parts.push(`Oxirgi 7 kunda aktiv: ${s.activeDays7} kun`);
  if (typeof s.habitCompletion7 === "number")
    parts.push(`Oxirgi 7 kun odat bajarish: ${s.habitCompletion7}%`);
  if (s.missedYesterday) parts.push("Kecha vazifa o'tkazib yuborilgan.");
  if (s.archetype) parts.push(`Arxetip: ${s.archetype}`);
  if (typeof s.planLength === "number") parts.push(`Reja: ${s.planLength} kun`);
  if (parts.length === 0) return "";
  return `\n\nFoydalanuvchining hozirgi holati (real ma'lumot — javobingda tegishli joyda foydalan, quruq takrorlama):\n- ${parts.join("\n- ")}`;
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Ad-hoc rate limit: 20 chat req / IP / minute.
        const ip = clientIpFromRequest(request);
        const rl = await rateLimit({ key: `chat:${ip}`, limit: 20, windowSeconds: 60 });
        if (!rl.allowed) {
          return new Response("Too many requests", {
            status: 429,
            headers: { "Retry-After": String(rl.retryAfter) },
          });
        }
        const body = (await request.json()) as {
          messages?: unknown;
          userStats?: UserStats;
        };
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
        const system = NADIR_BASE + buildContext(body.userStats);
        const result = streamText({
          model,
          system,
          messages: await convertToModelMessages(uiMessages),
        });
        return result.toUIMessageStreamResponse({
          originalMessages: uiMessages,
        });
      },
    },
  },
});
