/**
 * "Nerv tizimi" — markazlashgan gamifikatsiya utilitalari.
 * Har bir sahifa shu yerdan import qiladi (0-bo'lim: MEGA-PROMPT).
 */

// -------- XP --------
export function xpForLevel(level: number): number {
  // level 1..: 100 * level^2 formulasi (server bilan mos)
  return Math.max(100, 100 * level * level);
}

export function xpFromDifficulty(difficulty: 1 | 2 | 3 | 4 | 5): number {
  return difficulty * 10;
}

// -------- Discipline tier (0.3) --------
export type Tier = {
  id: "beginner" | "disciplined" | "strong" | "elite" | "master" | "apex";
  uz: string;
  en: string;
  min: number;
  max: number;
  className: string; // text color
  badgeClass: string; // background+border
};

export const TIERS: Tier[] = [
  {
    id: "beginner",
    uz: "Boshlovchi",
    en: "Beginner",
    min: 0,
    max: 19,
    className: "text-muted-foreground",
    badgeClass: "border-border bg-muted/40 text-muted-foreground",
  },
  {
    id: "disciplined",
    uz: "Intizomli",
    en: "Disciplined",
    min: 20,
    max: 39,
    className: "text-foreground",
    badgeClass: "border-border bg-card text-foreground",
  },
  {
    id: "strong",
    uz: "Kuchli",
    en: "Strong",
    min: 40,
    max: 59,
    className: "text-foreground",
    badgeClass: "border-foreground/20 bg-foreground/5 text-foreground",
  },
  {
    id: "elite",
    uz: "Elita",
    en: "Elite",
    min: 60,
    max: 74,
    className: "text-primary",
    badgeClass: "border-primary/40 bg-primary/10 text-primary",
  },
  {
    id: "master",
    uz: "Usta",
    en: "Master",
    min: 75,
    max: 89,
    className: "text-primary",
    badgeClass: "border-primary/60 bg-primary/15 text-primary",
  },
  {
    id: "apex",
    uz: "Apex",
    en: "Apex",
    min: 90,
    max: 100,
    className: "text-primary",
    badgeClass: "border-primary bg-gradient-to-r from-primary/25 to-primary/10 text-primary",
  },
];

export function tierFromScore(score: number | null | undefined): Tier {
  const s = Math.max(0, Math.min(100, score ?? 0));
  return TIERS.find((t) => s >= t.min && s <= t.max) ?? TIERS[0];
}

// -------- Sirkadian (0.4) --------
export type CircadianSlot = {
  label: string; // Tun/Tong/Ertalab/Kunduz/Peshin/Kech
  greeting: string; // "Xayrli tong"
  advice: string; // ohang matni
  taskType: "peak" | "steady" | "micro"; // tavsiya turi
};

export function circadian(now: Date = new Date()): CircadianSlot {
  const h = now.getHours();
  if (h < 5)
    return {
      label: "Tun",
      greeting: "Xayrli tun",
      advice: "Uxla — ertaga kuchli tur.",
      taskType: "micro",
    };
  if (h < 9)
    return {
      label: "Tong",
      greeting: "Xayrli tong",
      advice: "Eng qiyin vazifadan boshla.",
      taskType: "peak",
    };
  if (h < 12)
    return {
      label: "Ertalab",
      greeting: "Xayrli tong",
      advice: "Fokus oynasi — chuqur ish vaqti.",
      taskType: "peak",
    };
  if (h < 15)
    return {
      label: "Kunduz",
      greeting: "Kun yaxshi o'tsin",
      advice: "Rejangni tekshir, sur'atni ushla.",
      taskType: "steady",
    };
  if (h < 18)
    return {
      label: "Peshin",
      greeting: "Xayrli kun",
      advice: "Yengil vazifalarni yop.",
      taskType: "steady",
    };
  if (h < 22)
    return {
      label: "Kech",
      greeting: "Xayrli kech",
      advice: "Mikro-qadam bilan streakni saqla.",
      taskType: "micro",
    };
  return {
    label: "Tun",
    greeting: "Xayrli tun",
    advice: "10 daqiqa qol — yopib, dam ol.",
    taskType: "micro",
  };
}

export function progressMessage(percent: number): string {
  const c = circadian();
  if (percent >= 100) return "Bugungi reja bajarildi.";
  if (percent >= 50) return `Yarim yo'l ortda. ${c.advice}`;
  if (percent === 0 && c.taskType === "peak") return "Eng qiyin vazifadan boshla — fokus oynasi.";
  if (percent === 0 && c.taskType === "micro") return "Mikro-qadam bilan boshla (2 daqiqa).";
  return "Birinchi vazifadan boshla.";
}

// -------- Arxetip (0.5) --------
export type Archetype = {
  id: "focus_seeker" | "body_builder" | "night_scholar" | "steady_walker";
  name: string;
  hint: string;
  preferredTab: "/dashboard" | "/c/body" | "/c/habits" | "/c/learn" | "/community";
};

export const ARCHETYPES: Record<Archetype["id"], Archetype> = {
  focus_seeker: {
    id: "focus_seeker",
    name: "Fokus izlovchi",
    hint: "Ertalab peak — birinchi 90 daqiqa muqaddas.",
    preferredTab: "/dashboard",
  },
  body_builder: {
    id: "body_builder",
    name: "Tana quruvchi",
    hint: "Tana harakat izlaydi. Bugun +1 mashg'ulot.",
    preferredTab: "/c/body",
  },
  night_scholar: {
    id: "night_scholar",
    name: "Kechki o'quvchi",
    hint: "Kechqurun kitob — kunduz ortda qolgan bilim.",
    preferredTab: "/c/learn",
  },
  steady_walker: {
    id: "steady_walker",
    name: "Sokin yuruvchi",
    hint: "Kichik qadamlar — ammo har kuni. Sur'at sirdir.",
    preferredTab: "/c/habits",
  },
};

export function archetypeFromAnswers(answers: Record<string, unknown>): Archetype {
  const goal = String(answers?.["goal"] ?? "").toLowerCase();
  const timing = String(answers?.["best_time"] ?? "").toLowerCase();
  if (goal.includes("tana") || goal.includes("body") || goal.includes("sport"))
    return ARCHETYPES.body_builder;
  if (goal.includes("bilim") || goal.includes("learn") || goal.includes("kitob"))
    return ARCHETYPES.night_scholar;
  if (timing.includes("kech") || timing.includes("night")) return ARCHETYPES.night_scholar;
  if (timing.includes("tong") || timing.includes("morning")) return ARCHETYPES.focus_seeker;
  return ARCHETYPES.steady_walker;
}

// -------- Viloyatlar (11-bo'lim) --------
export const VILOYATLAR = [
  "Toshkent",
  "Toshkent viloyati",
  "Andijon",
  "Farg'ona",
  "Namangan",
  "Samarqand",
  "Buxoro",
  "Qashqadaryo",
  "Surxondaryo",
  "Sirdaryo",
  "Jizzax",
  "Navoiy",
  "Xorazm",
  "Qoraqalpog'iston",
] as const;
export type Viloyat = (typeof VILOYATLAR)[number];

// -------- Timezones --------
export const TIMEZONES = [
  { id: "Asia/Tashkent", label: "Toshkent (UTC+5)" },
  { id: "Asia/Almaty", label: "Almati (UTC+6)" },
  { id: "Asia/Dubai", label: "Dubay (UTC+4)" },
  { id: "Asia/Seoul", label: "Seul (UTC+9)" },
  { id: "Asia/Tokyo", label: "Tokio (UTC+9)" },
] as const;

// -------- Discipline score client-side hisoblash (fallback) --------
export function estimateDisciplineScore(input: {
  currentStreak: number;
  totalXp: number;
  level: number;
}): number {
  const streakPart = Math.min(40, input.currentStreak * 2);
  const levelPart = Math.min(30, input.level * 3);
  const xpPart = Math.min(30, Math.floor(input.totalXp / 100));
  return Math.min(100, streakPart + levelPart + xpPart);
}
