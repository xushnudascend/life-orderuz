// Human Potential Assessment — 9 shkala, har biri 2-3 savol, Likert 1-5.
// Har bir savol qaysi tomonga "yaxshi" ekanini aniqlaydi: forward (5=yaxshi) yoki reverse (1=yaxshi).
// Shkalalarning asoslari: Tangney SCS, Bergen SMAS, PSQI-lite, Bandura self-efficacy,
// Meaning in Life Q, Fogg BMAP, Wood 2002 habit consistency.

export type LikertDirection = "forward" | "reverse";

export interface AssessmentQuestion {
  key: string;
  scale: ScaleKey;
  prompt: string;
  direction: LikertDirection;
}

export type ScaleKey =
  | "self_control"
  | "dopamine_dependence"
  | "goal_clarity"
  | "confidence"
  | "discipline"
  | "sleep_quality"
  | "social_media_addiction"
  | "purpose"
  | "environment";

export interface ScaleMeta {
  key: ScaleKey;
  title: string;
  short: string;
  desc: string;
  /** Ijobiy toifa: shkala yuqori bo'lsa yaxshi (self-control) yoki past bo'lsa yaxshi (addiction). */
  higherIsBetter: boolean;
}

export const SCALES: ScaleMeta[] = [
  {
    key: "self_control",
    title: "O'z-o'zini boshqarish",
    short: "Self-Control",
    desc: "Impulsni kutish, uzoq maqsad ustun.",
    higherIsBetter: true,
  },
  {
    key: "dopamine_dependence",
    title: "Dopamin qaramligi",
    short: "Dopamin",
    desc: "Qisqa videoga, xabarnomaga tortilish.",
    higherIsBetter: false,
  },
  {
    key: "goal_clarity",
    title: "Maqsad aniqligi",
    short: "Maqsad",
    desc: "Nima qilyapman, nima uchun — aniq.",
    higherIsBetter: true,
  },
  {
    key: "confidence",
    title: "O'ziga ishonch",
    short: "Ishonch",
    desc: '"Men qila olaman" — self-efficacy (Bandura).',
    higherIsBetter: true,
  },
  {
    key: "discipline",
    title: "Intizom",
    short: "Intizom",
    desc: "30 kunlik izchillik.",
    higherIsBetter: true,
  },
  {
    key: "sleep_quality",
    title: "Uyqu sifati",
    short: "Uyqu",
    desc: "PSQI-lite — uyquga ketish, chuqurlik, tetiklik.",
    higherIsBetter: true,
  },
  {
    key: "social_media_addiction",
    title: "Ijtimoiy tarmoq qaramligi",
    short: "Soc. media",
    desc: "Bergen SMAS asosida.",
    higherIsBetter: false,
  },
  {
    key: "purpose",
    title: "Maqsad hissi",
    short: "Ma'no",
    desc: "Meaning in Life — nima uchun uyg'onaman.",
    higherIsBetter: true,
  },
  {
    key: "environment",
    title: "Muhit sifati",
    short: "Muhit",
    desc: "Uy, telefon, atrof qulay habitat.",
    higherIsBetter: true,
  },
];

export const QUESTIONS: AssessmentQuestion[] = [
  // Self-Control (Tangney SCS qisqartma)
  {
    key: "sc_1",
    scale: "self_control",
    prompt: "Vasvasaga qarshi turishim men uchun oson.",
    direction: "forward",
  },
  {
    key: "sc_2",
    scale: "self_control",
    prompt: "Yomon odatlarni to'xtata olmayman.",
    direction: "reverse",
  },

  // Dopamine Dependence
  {
    key: "dd_1",
    scale: "dopamine_dependence",
    prompt: "Qisqa videolar (TikTok, Reels, Shorts) meni soatlab tutib qoladi.",
    direction: "forward",
  },
  {
    key: "dd_2",
    scale: "dopamine_dependence",
    prompt: "5 daqiqa telefonsiz o'tirish — men uchun qiyin.",
    direction: "forward",
  },

  // Goal Clarity
  {
    key: "gc_1",
    scale: "goal_clarity",
    prompt: "Keyingi 90 kunda erishmoqchi bo'lgan aniq maqsadim bor.",
    direction: "forward",
  },
  {
    key: "gc_3",
    scale: "goal_clarity",
    prompt: "Ko'p vaqt nima qilishim kerakligini bilmayman.",
    direction: "reverse",
  },

  // Confidence
  {
    key: "cf_1",
    scale: "confidence",
    prompt: "Qiyin vazifa bo'lsa ham, yechim topa olaman.",
    direction: "forward",
  },
  {
    key: "cf_2",
    scale: "confidence",
    prompt: "Xatoga yo'l qo'ysam ham, yana urina olaman.",
    direction: "forward",
  },

  // Discipline
  {
    key: "di_1",
    scale: "discipline",
    prompt: "Rejalashtirgan ishimni oxirigacha bajaraman.",
    direction: "forward",
  },
  {
    key: "di_3",
    scale: "discipline",
    prompt: "So'nggi 30 kunda kamida bitta odatimni izchil bajardim.",
    direction: "forward",
  },

  // Sleep Quality
  {
    key: "sq_2",
    scale: "sleep_quality",
    prompt: "Ertalab tetik uyg'onaman.",
    direction: "forward",
  },

  // Social Media Addiction
  {
    key: "sm_1",
    scale: "social_media_addiction",
    prompt: "Ijtimoiy tarmoqlar haqida rejalashtirilganidan ko'proq o'ylayman.",
    direction: "forward",
  },

  // Purpose
  { key: "pu_1", scale: "purpose", prompt: "Hayotimning aniq ma'nosi bor.", direction: "forward" },
  {
    key: "pu_2",
    scale: "purpose",
    prompt: "Nima uchun uyg'onishimni bilaman.",
    direction: "forward",
  },

  // Environment
  {
    key: "en_1",
    scale: "environment",
    prompt: "Uyimdagi joyim — diqqatimni jamlashga yordam beradi.",
    direction: "forward",
  },
];

export const LIKERT_LABELS: Record<number, string> = {
  1: "Umuman rozi emasman",
  2: "Rozi emasman",
  3: "O'rtacha",
  4: "Rozi",
  5: "To'liq roziman",
};

/**
 * Har bir shkala uchun 0–100 hosil qilamiz.
 * "higherIsBetter": javob qiymatlari (1..5) forward=(v-1)/4, reverse=(5-v)/4, so'ng o'rtacha × 100.
 * "higherIsBetter=false" shkalalari (dopamin, sotsial media) — xom shkala yuqori = yomon;
 *   `potential`ni hisoblashda uni teskari (100 - x) qo'shamiz.
 */
export function computeScaleScore(
  scale: ScaleKey,
  responses: Record<string, number>,
): number | null {
  const scaleQs = QUESTIONS.filter((q) => q.scale === scale);
  const vals: number[] = [];
  for (const q of scaleQs) {
    const raw = responses[q.key];
    if (raw == null) return null; // to'liq javob berilmagan
    const norm = q.direction === "forward" ? (raw - 1) / 4 : (5 - raw) / 4;
    vals.push(norm);
  }
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.round(mean * 100);
}

export interface ComputedScores {
  potential: number;
  discipline: number;
  focus: number;
  addiction_risk: number;
  scales: Record<ScaleKey, number>;
  weakest_scale: ScaleKey;
}

export function computeAllScores(responses: Record<string, number>): ComputedScores | null {
  const scaleScores: Partial<Record<ScaleKey, number>> = {};
  for (const s of SCALES) {
    const v = computeScaleScore(s.key, responses);
    if (v == null) return null;
    scaleScores[s.key] = v;
  }
  const s = scaleScores as Record<ScaleKey, number>;

  // Potential: barcha shkala og'irliklari (higherIsBetter=false uchun teskari)
  const potentialContribs: number[] = SCALES.map((meta) =>
    meta.higherIsBetter ? s[meta.key] : 100 - s[meta.key],
  );
  const potential = Math.round(potentialContribs.reduce((a, b) => a + b, 0) / SCALES.length);

  const discipline = Math.round((s.self_control + s.discipline + s.environment) / 3);

  // Focus: high sleep + low dopamine + low social media
  const focus = Math.round(
    (s.sleep_quality + (100 - s.dopamine_dependence) + (100 - s.social_media_addiction)) / 3,
  );

  // Addiction risk (higher = more risk)
  const addiction_risk = Math.round((s.dopamine_dependence + s.social_media_addiction) / 2);

  // Weakest scale — potentialga eng katta salbiy hissa
  let weakest: ScaleKey = SCALES[0].key;
  let worstContribution = -1;
  for (const meta of SCALES) {
    const loss = meta.higherIsBetter ? 100 - s[meta.key] : s[meta.key];
    if (loss > worstContribution) {
      worstContribution = loss;
      weakest = meta.key;
    }
  }

  return {
    potential,
    discipline,
    focus,
    addiction_risk,
    scales: s,
    weakest_scale: weakest,
  };
}

/** 3-bosqichli yo'l xarita generatsiya qilamiz (Reclaim → Rebuild → Rise). */
export interface RoadmapStageSeed {
  stage_index: 0 | 1 | 2;
  focus_area: ScaleKey;
  title: string;
  description: string;
}

const STAGE_LABELS = [
  { title: "Reclaim — o'zingizni qaytaring", weeks: 2 },
  { title: "Rebuild — poydevor quring", weeks: 4 },
  { title: "Rise — o'sing", weeks: 8 },
];

const SCALE_ACTIONS: Record<ScaleKey, string> = {
  self_control: "Kunlik 5 daqiqalik telefonsiz nafas.",
  dopamine_dependence: "Qisqa videolarni 30 daqiqaga cheklang (app timer).",
  goal_clarity: "Har hafta yakshanba — bitta aniq maqsad yozing.",
  confidence: 'Har kuni bitta "kichik g\'alaba" — jurnaliga.',
  discipline: "Kuniga bitta odat, aynan bir vaqtda.",
  sleep_quality: "Uyquga 1 soat qolganda — telefon boshqa xonada.",
  social_media_addiction: "Ilovalarni ekrandan olib tashlang; brauzer orqali kirish qiyinlashadi.",
  purpose: "Kim bo'lmoqchisiz — 3 gap. Har kuni ertalab o'qing.",
  environment: "Ish joyingizdan chalg'itadigan bitta narsani olib tashlang.",
};

export function buildRoadmap(scores: ComputedScores): RoadmapStageSeed[] {
  // 3 ta eng zaif shkala — o'sish bo'yicha
  const sorted = SCALES.map((meta) => ({
    key: meta.key,
    loss: meta.higherIsBetter ? 100 - scores.scales[meta.key] : scores.scales[meta.key],
  })).sort((a, b) => b.loss - a.loss);

  const stages: RoadmapStageSeed[] = [];
  for (let i = 0; i < 3; i++) {
    const focus = sorted[i]?.key ?? scores.weakest_scale;
    stages.push({
      stage_index: i as 0 | 1 | 2,
      focus_area: focus,
      title: STAGE_LABELS[i].title,
      description: SCALE_ACTIONS[focus],
    });
  }
  return stages;
}

export function stageTargetDate(index: number): Date {
  const weeks = STAGE_LABELS[index]?.weeks ?? 2;
  const d = new Date();
  d.setDate(d.getDate() + weeks * 7);
  return d;
}
