/**
 * Onboarding — trigger tahlili savollari.
 * Har bir savolning key va variantlar — MANBA MATN O'ZBEKCHA.
 * Saqlangan javob doim o'zbekcha string. Bu keyingi AI tahlil algoritmi uchun muhim.
 */
export type OnboardingOption = {
  value: string; // o'zbekcha, DBga tushadi
  label: string; // interfeys uchun (hozircha bir xil)
};

export type OnboardingQuestion = {
  key: string;
  section: "A" | "B";
  prompt: string;
  helper?: string;
  type: "single" | "number" | "select" | "multi";
  options?: OnboardingOption[];
  min?: number;
  max?: number;
  suffix?: string;
};

export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  // A · Sen haqingda
  {
    key: "profile.age",
    section: "A",
    prompt: "Yoshing nechida?",
    type: "number",
    min: 13,
    max: 90,
    suffix: "yosh",
  },
  {
    key: "profile.sex",
    section: "A",
    prompt: "Jinsing?",
    type: "single",
    options: [
      { value: "erkak", label: "Erkak" },
      { value: "ayol", label: "Ayol" },
      { value: "boshqa", label: "Boshqa" },
      { value: "aytmayman", label: "Aytishni istamayman" },
    ],
  },
  {
    key: "profile.height_cm",
    section: "A",
    prompt: "Bo'ying?",
    type: "number",
    min: 120,
    max: 230,
    suffix: "sm",
  },
  {
    key: "profile.weight_kg",
    section: "A",
    prompt: "Vazning?",
    type: "number",
    min: 30,
    max: 200,
    suffix: "kg",
  },
  {
    key: "profile.activity",
    section: "A",
    prompt: "Kunlik faolliging qanday?",
    helper: "Bu ovqatlanish va mashqlar rejasini shakllantirish uchun kerak.",
    type: "single",
    options: [
      { value: "kam_harakat", label: "Kam harakat — asosan o'tirib ishlayman" },
      { value: "engil", label: "Engil — haftada 1-2 marta yuraman" },
      { value: "o_rta", label: "O'rtacha — haftada 3-4 marta mashq" },
      { value: "faol", label: "Faol — deyarli har kuni tana bilan ishlayman" },
      { value: "juda_faol", label: "Juda faol — kuchli sportchi" },
    ],
  },
  // B · Naqshing (trigger)
  {
    key: "trigger.core",
    section: "B",
    prompt: "Sen o'zingda qaysi muammolarni ko'ryapsan?",
    helper: "Bir nechta variantni tanlashing mumkin — nechta tegishli bo'lsa.",
    type: "multi",
    options: [
      { value: "telefon_qaramlik", label: "Telefon va ijtimoiy tarmoqqa qaramlik" },
      { value: "kechiktirish", label: "Har narsani ertaga qoldirish (prokrastinatsiya)" },
      { value: "maqsadsizlik", label: "Nima qilishimni umuman bilmayman" },
      { value: "diqqat_toza_emas", label: "E'tiborimni bir joyga jamlay olmayman" },
      { value: "irodasiz", label: "Rejalar tuzaman, lekin bajarmayman" },
    ],
  },
  {
    key: "trigger.morning",
    section: "B",
    prompt: "Ertalab uyg'onganingda odatda nima qilasan?",
    helper: "Bir nechta variantni tanlashing mumkin.",
    type: "multi",
    options: [
      { value: "telefon", label: "Telefonni olaman — 30+ daqiqa yotib qolaman" },
      { value: "namoz", label: "Ibodat/duo qilaman, keyin turaman" },
      { value: "yuvinish", label: "Darhol turib yuvinaman" },
      { value: "yotib_qolaman", label: "Uzoq yotib qolaman, kechga qolaman" },
      { value: "sport", label: "Mashq / harakat qilaman" },
    ],
  },
  {
    key: "trigger.evening",
    section: "B",
    prompt: "Kechqurun uyquga qanday borasan?",
    helper: "Bir nechta variantni tanlashing mumkin.",
    type: "multi",
    options: [
      { value: "telefon_bilan", label: "Telefon aralashib ketaman, allamahalgacha" },
      { value: "kitob", label: "Kitob o'qib uxlayman" },
      { value: "jadval", label: "Aniq vaqtda yotaman" },
      { value: "tartibsiz", label: "Har kun har xil vaqt — tartib yo'q" },
    ],
  },
  {
    key: "trigger.energy_time",
    section: "B",
    prompt: "Eng yaxshi energiyang qaysi vaqtda?",
    type: "single",
    options: [
      { value: "ertalab", label: "Ertalab" },
      { value: "tush", label: "Peshin atrofida" },
      { value: "kechqurun", label: "Kechqurun" },
      { value: "kech_tun", label: "Kech tun — 22:00 dan keyin" },
    ],
  },
] as const;

export function sectionQuestions(section: "A" | "B"): OnboardingQuestion[] {
  return ONBOARDING_QUESTIONS.filter((q) => q.section === section);
}

export function calcBMI(heightCm?: number | null, weightKg?: number | null): number | null {
  if (!heightCm || !weightKg) return null;
  const m = heightCm / 100;
  if (m <= 0) return null;
  return +(weightKg / (m * m)).toFixed(1);
}

export function bmiLabel(bmi: number | null): string | null {
  if (bmi == null) return null;
  if (bmi < 18.5) return "Kam vazn";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Ortiqcha vazn";
  return "Semizlik";
}
