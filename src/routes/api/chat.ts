import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, generateText, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { rateLimit } from "@/lib/rate-limit";
import { enforceAiDailyBudget } from "@/lib/ai-budget";
import { verifySupabaseBearer } from "@/lib/verify-bearer.server";
import {
  fetchNadirMemories,
  formatMemoriesForPrompt,
  insertNadirMemories,
} from "@/lib/nadir-memory.server";

const NADIR_BASE = `Sen — Nadir. Life Order ilovasidagi halol AI mentor va uzoq muddatli hamroh.

QAMROV:
- Foydalanuvchi hayotining istalgan sohasi bo'yicha gaplashaverasan: odat, ish, munosabat, uyqu, ma'no, qiyinchilik.
- Sen bir kishisan: foydalanuvchi qaysi ekrandan yozganidan qat'iy nazar — bir xil xotira, bir xil ohang.

OVOZ (persona qat'iy):
- O'zbek tilida (foydalanuvchi rus/ingliz so'rasa — o'sha tilda).
- Emojisiz, shiorsiz, ustozlik yo'q. "Sen" deb chaqirasan.
- Yumshoq, lekin haqiqatni ko'zga qarab aytadigan tovush. Ovozing — psixoterapevt + do'st.

METOD (har javobda ketma-ket):
1) Reflektiv eshitish (Rogers, 1957) — 1 jumlada uning aytganini o'z so'zing bilan takrorla: "Sen aytding: …" yoki "Demak, hozir …".
2) Kognitiv qayta shakllantirish (Beck, 1979) — "doim / hech qachon / hamma" mutlaq fikrlarni yumshat: "hozircha", "shu holatda", "bu hafta".
3) Motivatsion intervyu / OARS (Miller & Rollnick) — har 3 javobdan kamida 1 tasida ma'ruza o'rniga OCHIQ SAVOL ber: "Sen nima deb o'ylaysan — bugun nima seni to'xtatdi?" Foydalanuvchi javobni o'zi topsa — u kuchliroq ishonarli. Ma'ruza va lecture yo'q.
4) Implementation intention (Gollwitzer, 1999) — javob oxirida (savol o'rniga yoki savoldan keyin) bitta "agar X — men Y" mikro-qadam (2 daqiqadan kam). Har javobda BITTA narsa: savol YOKI mikro-qadam.
5) Kontekstdan foydalan (Barnum'dan qoch) — foydalanuvchining real statistikasi va xotiralaridan aniq foydalan, umumiy maslahat berma.

TAQIQ (tone-guard, saytning har bir joyida amal qiladi):
- "Ajoyibsan / Zo'r / Sen qahramonsan / You got this" — TAQIQ.
- Emoji, exclamation-motivation, xushomad — TAQIQ.
- Soxta shoshiltirish, soxta statistika, "ilovasiz turolmaysan" tili — TAQIQ.
- Identity-til ("Sen — intizomli odam") — faqat 7+ kunlik streak'dan keyin ochiladi, oldindan berilmaydi.
- Streak uzilsa: "Sen muvaffaqiyatsizsan" — TAQIQ. O'rniga: "Naqsh sindi — bu ma'lumot. Ertaga qayta quramiz."
- Xato haqida gapirganda — harakatga tegasan, shaxsga emas ("bu harakat zaif" HA, "sen zaifsan" YO'Q, Dweck growth mindset).

CHEGARA:
- Tibbiy/huquqiy/moliyaviy maslahat yo'q.
- Ruhiy shoshilinch (o'z-o'ziga zarar, umidsizlik) belgilari — darhol: "Ishonch telefoni 1051 (O'zbekiston)".

FORMAT (kognitiv yuk):
- 3-6 jumla. Ro'yxat — max 3 punkt.`;

type Persona = "therapist" | "goggins" | "huberman";

const PERSONA_OVERLAYS: Record<Persona, string> = {
  therapist: "",
  goggins: `\n\nPERSONA-QATLAM (Goggins rejimi — foydalanuvchi tanladi):
- Ovoz: qat'iy, halol, ayblovsiz, lekin **bahonasiz**. Askar-og'a. "Sen" — buyruq ohangida emas, hurmatli lekin ushlab qo'ymaydigan.
- Bahonalarni yumshoq empatiya bilan qabul qilma — nomlab ko'rsat: "Bu bahona. Sen o'zing ham buni bilasan."
- "Ertaga" so'zi — TAQIQ. Faqat "bugun soat X:XX da" mikro-qadam beriladi.
- Har javobda: 1 satr reflektiv eshitish → 1 satr bahonani nomlash → 1 satr aniq mikro-qadam (bugun, 2 daqiqagacha).
- HALI HAM TAQIQ: haqorat, kamsitish, "you're weak", jismoniy jazo tavsiyasi, xavfli mashqlar. Halol qattiqlik ≠ zo'ravonlik.`,
  huberman: `\n\nPERSONA-QATLAM (Huberman rejimi — foydalanuvchi tanladi):
- Ovoz: neyroolim + amaliyotchi. "Sen" — hurmatli, protokol-yo'naltirilgan.
- Har javobda mumkin bo'lganda 1 ta konkret neyrobiologik mexanizm nomla (dopamin baseline, cortisol awakening response, prefrontal-limbic, ultradian cycle, sleep pressure, va h.k.) — 1 jumlada, jargonsiz.
- Mikro-qadamni **protokol** shaklida ber: vaqt + davomiyligi + o'lchanadigan natija. Masalan: "Ertaga 07:00-07:10 — quyoshga qarash (10 daq). O'lchov: shu kuni uyquga ketish vaqti."
- TAQIQ: aniq bo'lmagan tadqiqot da'volari, tibbiy tavsiya, dozalar, dorilar.`,
};

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
  peakFailureHour?: number | null;
};

function buildContext(s: UserStats | undefined, contextHint?: string): string {
  const parts: string[] = [];
  if (s?.displayName) parts.push(`Ism: ${s.displayName}`);
  if (typeof s?.level === "number") parts.push(`Daraja: ${s.level}`);
  if (typeof s?.totalXp === "number") parts.push(`Jami XP: ${s.totalXp}`);
  if (typeof s?.currentStreak === "number") parts.push(`Streak: ${s.currentStreak} kun`);
  if (typeof s?.disciplineScore === "number") parts.push(`Discipline: ${s.disciplineScore}/100`);
  if (typeof s?.activeDays7 === "number") parts.push(`Oxirgi 7 kunda aktiv: ${s.activeDays7} kun`);
  if (typeof s?.habitCompletion7 === "number")
    parts.push(`Oxirgi 7 kun odat bajarish: ${s.habitCompletion7}%`);
  if (s?.missedYesterday) parts.push("Kecha vazifa o'tkazib yuborilgan.");
  if (s?.archetype) parts.push(`Arxetip: ${s.archetype}`);
  if (typeof s?.planLength === "number") parts.push(`Reja: ${s.planLength} kun`);
  if (typeof s?.peakFailureHour === "number")
    parts.push(`Eng zaif soat (peak_failure_time): ${s.peakFailureHour}:00 atrofi`);
  let ctx = "";
  if (parts.length) {
    ctx += `\n\nFoydalanuvchining hozirgi real holati (statistika — quruq takrorlama, tabiiy foydalan):\n- ${parts.join("\n- ")}`;
  }
  if (contextHint) {
    ctx += `\n\nSAHIFA KONTEKSTI: foydalanuvchi hozir "${contextHint}" sahifasidan yozyapti. Bu — moyillik, cheklov emas. Boshqa mavzuga o'tsa — bemalol o'sha bilan davom et.`;
  }
  return ctx;
}

async function extractMemoriesInBackground(
  userId: string,
  lastUserText: string,
  assistantText: string,
  apiKey: string,
) {
  try {
    const gateway = createLovableAiGatewayProvider(apiKey);
    const model = gateway("google/gemini-3-flash-preview");
    const { text } = await generateText({
      model,
      system:
        "Sen fakt-ajratuvchisan. Suhbatdan foydalanuvchi haqida DURABLE (uzoq muddat foydali) faktlarni ajratasan: maqsad, naqsh, afzallik, trigger, muhim fakt. Vaqtinchalik his-tuyg'u yoki bir martalik gap — YO'Q. Har bir fakt qisqa (max 140 belgi), 1-shaxsda emas ('foydalanuvchi ...'). Agar durable fakt yo'q bo'lsa — bo'sh massiv qaytar. JSON qaytar, boshqa hech narsa.",
      prompt: `Foydalanuvchi: ${lastUserText}\n\nNadir: ${assistantText}\n\nJSON formatda qaytar:\n{"memories":[{"content":"...","importance":1-5,"kind":"fact|goal|pattern|preference|trigger"}]}`,
    });
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return;
    const parsed = JSON.parse(jsonMatch[0]) as {
      memories?: Array<{ content: string; importance: number; kind: string }>;
    };
    if (Array.isArray(parsed.memories) && parsed.memories.length) {
      await insertNadirMemories(userId, parsed.memories);
    }
  } catch {
    // silent — memory extraction is best-effort
  }
}

async function persistTurnToThread(
  userId: string,
  threadId: string,
  userText: string,
  assistantText: string,
  contextHint: string | undefined,
) {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Confirm ownership before writing.
    const { data: thread } = await supabaseAdmin
      .from("nadir_threads")
      .select("id, user_id")
      .eq("id", threadId)
      .maybeSingle();
    if (!thread || (thread as { user_id: string }).user_id !== userId) return;
    await supabaseAdmin.from("nadir_messages").insert([
      {
        user_id: userId,
        thread_id: threadId,
        role: "user",
        content: userText,
        context_hint: contextHint ?? null,
      },
      {
        user_id: userId,
        thread_id: threadId,
        role: "assistant",
        content: assistantText,
        context_hint: contextHint ?? null,
      },
    ]);
  } catch {
    // silent — persistence is best-effort; UI still shows the turn.
  }
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = await verifySupabaseBearer(request);
        if (!auth.ok) return auth.response;

        const rl = await rateLimit({ key: `chat:${auth.userId}`, limit: 20, windowSeconds: 60 });
        if (!rl.allowed) {
          return new Response("Too many requests", {
            status: 429,
            headers: { "Retry-After": String(rl.retryAfter) },
          });
        }
        const budget = await enforceAiDailyBudget(auth.userId, "chat");
        if (!budget.ok) return budget.response;

        const body = (await request.json()) as {
          messages?: unknown;
          userStats?: UserStats;
          persona?: string;
          threadId?: string;
          contextHint?: string;
        };
        if (!Array.isArray(body.messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const uiMessages = body.messages as UIMessage[];
        const persona: Persona =
          body.persona === "goggins" || body.persona === "huberman" ? body.persona : "therapist";
        const contextHint =
          typeof body.contextHint === "string" && body.contextHint.length < 80
            ? body.contextHint
            : undefined;
        const threadId =
          typeof body.threadId === "string" && /^[0-9a-f-]{36}$/i.test(body.threadId)
            ? body.threadId
            : undefined;

        // Fetch RAG-lite memories
        const memories = await fetchNadirMemories(auth.userId, 8);
        const system =
          NADIR_BASE +
          PERSONA_OVERLAYS[persona] +
          buildContext(body.userStats, contextHint) +
          formatMemoriesForPrompt(memories);

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const result = streamText({
          model,
          system,
          messages: await convertToModelMessages(uiMessages),
          onFinish: async ({ text }) => {
            const lastUser = [...uiMessages].reverse().find((m) => m.role === "user");
            const lastUserText =
              lastUser?.parts
                ?.map((p) => (p.type === "text" ? p.text : ""))
                .join(" ")
                .trim() ?? "";
            if (lastUserText && text) {
              if (threadId) {
                void persistTurnToThread(auth.userId, threadId, lastUserText, text, contextHint);
              }
              void extractMemoriesInBackground(auth.userId, lastUserText, text, key);
            }
          },
        });
        return result.toUIMessageStreamResponse({ originalMessages: uiMessages });
      },
    },
  },
});
