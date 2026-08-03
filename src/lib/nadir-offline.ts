/**
 * Nadir — internetsiz rejim.
 *
 * AI gateway'ga ulanish yo'q bo'lganda foydalanuvchi javobsiz qolmasin:
 * qoidaga asoslangan (deterministik) CBT-uslubidagi mikro-qadam beriladi.
 * Bu AI o'rnini bosmaydi — u faqat "keyingi bitta harakat"ni beradi.
 */

type Rule = {
  id: string;
  match: RegExp;
  reply: (minutes: number) => string;
};

const RULES: Rule[] = [
  {
    id: "sleep",
    match: /uyqu|ux(la|olmay)|tura olmay|erta tur|charcha|tolik|sleep|устал|сон/i,
    reply: () =>
      "Ertalab turolmaslik — irodaning emas, kechagi kechning natijasi.\n\nKeyingi qadam: bugun telefonni yotoqdan tashqarida qoldirib, odatdagidan 20 daqiqa erta yot. Faqat shu bitta o'zgarish.",
  },
  {
    id: "phone",
    match: /telefon|scroll|instagram|tiktok|youtube|ekran|phone|телефон/i,
    reply: (m) =>
      `Telefon — iroda masalasi emas, ilgak masalasi. Ilgakni olib tashla, xulq o'zi to'xtaydi.\n\nKeyingi qadam: telefonni ${m} daqiqaga boshqa xonaga qo'y va taymer qo'y. Qaytganingda o'zingni tekshir.`,
  },
  {
    id: "procrastination",
    match: /kechiktir|boshlay olmay|ertaga|dangasa|proqrast|lazy|прокраст|лень/i,
    reply: (m) =>
      `Boshlash — davom etishdan qiyinroq (Zeigarnik effekti). Miya tugallanmagan ishni o'zi eslatib turadi.\n\nKeyingi qadam: eng qo'rqinchli ishni ${m} daqiqa qil — keyin to'xtashga ruxsat. Ko'pincha to'xtamaysan.`,
  },
  {
    id: "relapse",
    match: /o'tkazib|otkazib|buzdim|yiqild|qayta boshla|streak|tashlab|сорвал|срыв/i,
    reply: () =>
      "Bir kun o'tkazib yuborish — muvaffaqiyatsizlik emas, ma'lumot. Muvaffaqiyatsizlik — ikkinchi kun.\n\nKeyingi qadam: bugun eng kichik versiyasini qil (1 daqiqa bo'lsa ham) va nima to'sqinlik qilganini bitta jumlada yoz.",
  },
  {
    id: "focus",
    match: /fokus|diqqat|tarqoq|konsentr|focus|фокус|внимани/i,
    reply: (m) =>
      `Tarqoq diqqat — ko'p vazifaning natijasi, xarakterning emas.\n\nKeyingi qadam: bitta vazifa tanla, boshqa hamma oynani yop va ${m} daqiqa taymer qo'y. Faqat shu.`,
  },
  {
    id: "anxiety",
    match: /qo'rq|qorq|xavotir|stress|asabiy|tashvish|anxi|тревог|стресс/i,
    reply: () =>
      "Xavotir — kelajakni boshqarishga urinish. Uni harakat kichraytiradi, tahlil emas.\n\nKeyingi qadam: 4 soniya nafas ol, 6 soniya chiqar — 6 marta. Keyin qo'rquvingni bitta jumlada yozib qo'y.",
  },
  {
    id: "motivation",
    match: /motivats|xohlamay|istak yo|ma'no|manosi|motiv|мотивац/i,
    reply: () =>
      "Motivatsiya harakatdan keyin keladi, undan oldin emas. Kutish — tuzoq.\n\nKeyingi qadam: 2 daqiqalik eng oson versiyani hozir bajar. Kayfiyatni keyin tekshir.",
  },
];

const FALLBACK =
  "Hozir internet yo'q, shuning uchun to'liq tahlil qila olmayman — lekin javobsiz qoldirmayman.\n\nKeyingi qadam: hozir seni to'xtatayotgan narsani bitta jumlada yoz, keyin uning eng kichik 2 daqiqalik qismini bajar. Internet qaytganda men bu suhbatni chuqurroq davom ettiraman.";

/** Foydalanuvchi matniga qarab offline javob tayyorlaydi. */
export function offlineNadirReply(userText: string, freeMinutes = 5): string {
  const rule = RULES.find((r) => r.match.test(userText));
  const body = rule ? rule.reply(freeMinutes) : FALLBACK;
  return `${body}\n\n— Offline rejim: bu javob qurilmangda hisoblandi.`;
}

const QUEUE_KEY = "lo_nadir_offline_queue";

export type QueuedMessage = { text: string; at: number };

/** Internetsiz yozilgan xabarlarni navbatga qo'yadi. */
export function queueOfflineMessage(text: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(QUEUE_KEY);
    const list: QueuedMessage[] = raw ? JSON.parse(raw) : [];
    list.push({ text, at: Date.now() });
    window.localStorage.setItem(QUEUE_KEY, JSON.stringify(list.slice(-20)));
  } catch {
    /* localStorage to'lgan bo'lishi mumkin — jim o'tamiz */
  }
}

/** Navbatni o'qib, tozalaydi. */
export function drainOfflineQueue(): QueuedMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    window.localStorage.removeItem(QUEUE_KEY);
    return JSON.parse(raw) as QueuedMessage[];
  } catch {
    return [];
  }
}
