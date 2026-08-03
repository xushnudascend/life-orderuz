/**
 * Mahalliy (qurilma ichidagi) eslatmalar.
 *
 * Server push (Web Push) uchun VAPID kalitlari va push server kerak; hozircha
 * biz qurilmada ishlaydigan eslatmalarni beramiz: ilova ochiq yoki PWA fon
 * jarayonida bo'lganda belgilangan vaqtda bildirishnoma chiqadi.
 *
 * Har bir eslatma kuniga faqat bir marta ko'rsatiladi (localStorage bilan).
 */

export type ReminderPrefs = {
  notifyDaily: boolean;
  notifyStreak: boolean;
  /** "HH:MM" formatida */
  time: string;
};

const PREFS_KEY = "lo_reminder_prefs";
const SENT_KEY = "lo_reminder_last_sent";

export function saveReminderPrefs(prefs: ReminderPrefs): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore */
  }
}

export function loadReminderPrefs(): ReminderPrefs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    return raw ? (JSON.parse(raw) as ReminderPrefs) : null;
  } catch {
    return null;
  }
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function alreadySentToday(): boolean {
  try {
    return window.localStorage.getItem(SENT_KEY) === todayKey();
  } catch {
    return false;
  }
}

function markSent(): void {
  try {
    window.localStorage.setItem(SENT_KEY, todayKey());
  } catch {
    /* ignore */
  }
}

async function show(title: string, body: string): Promise<void> {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  const opts: NotificationOptions = {
    body,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    tag: "lo-daily-reminder",
  };
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) await reg.showNotification(title, opts);
    else new Notification(title, opts);
  } catch {
    /* bildirishnoma chiqmasa — jim o'tamiz */
  }
}

/** Bugungi eslatma vaqtigacha qolgan millisekund (o'tib ketgan bo'lsa null). */
function msUntil(time: string): number | null {
  const parts = time.split(":");
  const h = Number(parts[0]);
  const m = Number(parts[1] ?? "0");
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  const target = new Date();
  target.setHours(h, m, 0, 0);
  const diff = target.getTime() - Date.now();
  return diff > 0 ? diff : null;
}

/**
 * Eslatmani rejalashtiradi. Tozalash funksiyasini qaytaradi.
 * Agar vaqt allaqachon o'tgan bo'lsa va bugun yuborilmagan bo'lsa — darhol chiqaradi.
 */
export function scheduleDailyReminder(prefs: ReminderPrefs): () => void {
  if (typeof window === "undefined" || !prefs.notifyDaily) return () => {};
  if (alreadySentToday()) return () => {};

  const fire = () => {
    if (alreadySentToday()) return;
    markSent();
    void show(
      "Bugungi bitta qadam",
      prefs.notifyStreak
        ? "Streaking'ni saqlab qol — bitta odatni belgilash yetadi."
        : "Ilovani ochib, bugungi mikro-qadamni bajar.",
    );
  };

  const delay = msUntil(prefs.time);
  if (delay === null) {
    // Vaqt o'tib ketgan: ilovani ochganda bir marta eslatamiz.
    const t = window.setTimeout(fire, 8000);
    return () => window.clearTimeout(t);
  }
  const t = window.setTimeout(fire, Math.min(delay, 2 ** 31 - 1));
  return () => window.clearTimeout(t);
}
