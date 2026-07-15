/**
 * Telegram bot notifier via the Lovable connector gateway.
 * Server-only. Import inside .handler() bodies only.
 */
const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";

export async function sendTelegramMessage(chatId: string | number, text: string, opts?: { parseMode?: "HTML" | "Markdown" }) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const tgKey = process.env.TELEGRAM_API_KEY;
  if (!lovableKey || !tgKey) {
    throw new Error("Telegram not configured (missing LOVABLE_API_KEY or TELEGRAM_API_KEY)");
  }
  const res = await fetch(`${GATEWAY_URL}/sendMessage`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": tgKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: opts?.parseMode ?? "HTML",
      disable_web_page_preview: true,
    }),
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Telegram sendMessage failed [${res.status}]: ${errBody}`);
  }
  const json = (await res.json()) as { ok: boolean; result?: { message_id: number }; description?: string };
  if (!json.ok) throw new Error(`Telegram error: ${json.description ?? "unknown"}`);
  return json.result!;
}
