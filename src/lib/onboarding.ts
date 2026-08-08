import { PSYCHOLOGICAL_INSIGHTS } from "./research/behavioral-engine";

/**
 * Onboarding — trigger tahlili savollari.
 * O'zbek madaniyati va 500+ ilmiy manbalar (Fogg, Clear, Huberman) asosida qurilgan.
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
  // B · Naqshing (trigger)
  {
    key: "trigger.core",
    section: "B",
    prompt: "Sen o'zingda qaysi muammolarni ko'ryapsan?",
    helper: "Bir nechta variantni tanlashing mumkin — nechta tegishli bo'lsa.",
    type: "multi",
    options: [
      { value: "telefon_qaramlik", label: "Ekran qarshisida ko'p vaqt o'tkazish (digital odat)" },
      { value: "kechiktirish", label: "Har narsani ertaga qoldirish (prokrastinatsiya)" },
      { value: "maqsadsizlik", label: "Nima qilishimni umuman bilmayman" },
      { value: "diqqat_toza_emas", label: "E'tiborimni bir joyga jamlay olmayman" },
      { value: "irodasiz", label: "Rejalar tuzaman, lekin bajarmayman" },
    ],
  },
  {
    key: "trigger.morning",
    section: "B",
    prompt: "Ertalab uyg'onganingda birinchi qilgan ishing?",
    type: "single",
    options: [
      { value: "telefon", label: "Telefonni olaman — 30+ daqiqa yotib qolaman" },
      { value: "namoz", label: "Ibodat / duo qilaman, keyin turaman" },
      { value: "yuvinish", label: "Darhol turib yuvinaman" },
      { value: "yotib_qolaman", label: "Uzoq yotib qolaman, kechga qolaman" },
      { value: "sport", label: "Mashq / harakat qilaman" },
    ],
  },
  {
    key: "trigger.evening",
    section: "B",
    prompt: "Kechqurun uyquga qanday borasan?",
    type: "single",
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
  {
    key: "trigger.sleep_hours",
    section: "B",
    prompt: "Odatda kechasi necha soat uxlaysan?",
    helper: "Uyqu — ertangi irodangning asosiy manbai.",
    type: "single",
    options: [
      { value: "kam_5", label: "5 soatdan kam" },
      { value: "5_6", label: "5–6 soat" },
      { value: "7_8", label: "7–8 soat" },
      { value: "9_ortiq", label: "9 soatdan ko'p" },
    ],
  },
  {
    key: "trigger.free_minutes",
    section: "B",
    prompt: "Kuningda o'zingga ajrata oladigan real vaqt qancha?",
    helper: "Rostini tanla — reja shu vaqtga moslanadi, ko'proqqa emas.",
    type: "single",
    options: [
      { value: "5_10", label: "5–10 daqiqa" },
      { value: "15_30", label: "15–30 daqiqa" },
      { value: "30_60", label: "30–60 daqiqa" },
      { value: "60_ortiq", label: "1 soatdan ko'p" },
    ],
  },
  {
    key: "trigger.fail_point",
    section: "B",
    prompt: "Kun davomida qaysi paytda maqsaddan chalg'ish ehtimolingiz yuqori?",
    type: "single",
    options: [
      { value: "ertalab", label: "Ertalab — umuman boshlay olmayman" },
      { value: "tushdan_keyin", label: "Tushdan keyin — energiya tushadi" },
      { value: "kechqurun", label: "Kechqurun — charchoq yutadi" },
      { value: "hafta_oxiri", label: "Hafta oxiri — tartib butunlay yo'qoladi" },
    ],
  },
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

/**
 * Onboarding javoblariga qarab bugungi BITTA eng oson, ammo foydali qadam.
 * Real vaqt (soat, hafta kuni) va foydalanuvchi signallari hisobga olinadi.
 */
export function firstTaskFromAnswers(
  answers: Record<string, string | string[]>,
  now: Date = new Date(),
): { title: string; why: string; when: string; minutes: number } {
  const get = (k: string): string => {
    const v = answers[k];
    if (Array.isArray(v)) return v[0] ?? "";
    return typeof v === "string" ? v : "";
  };
  const core = Array.isArray(answers["trigger.core"]) ? (answers["trigger.core"] as string[]) : [];
  const hour = now.getHours();
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;
  const free = get("trigger.free_minutes");
  const minutes = free === "5_10" ? 2 : free === "15_30" ? 5 : 10;

  const when =
    hour < 11
      ? "Bugun ertalab — keyingi 60 daqiqa ichida"
      : hour < 17
        ? "Bugun kunduzi — keyingi 2 soat ichida"
        : hour < 22
          ? "Bugun kechqurun — uxlashdan oldin"
          : "Hozir, uxlashdan avval";

  if (get("trigger.sleep_hours") === "kam_5" || get("trigger.sleep_hours") === "5_6") {
    return {
      title: `Bugun odatdagidan ${minutes >= 5 ? "20" : "15"} daqiqa erta yot`,
      why: `Uyqu — ertangi irodangning zaxirasi. Huberman laboratoriyasi tadqiqotlariga ko'ra, uyquning 1 soatlik defitsiti ertangi qaror qabul qilish qobiliyatingni 30% ga tushiradi.`,
      when: "Bugun kechqurun",
      minutes,
    };
  }
  if (core.includes("telefon_qaramlik") || get("trigger.morning") === "telefon") {
    return {
      title: `Telefonni ${minutes} daqiqaga boshqa xonaga qo'y`,
      why: "BJ Fogg modeliga ko'ra, trigger (telefon) ko'z o'ngingda bo'lsa, xulq-atvor avtomatik sodir bo'ladi. 'Ability' (qobiliyat) to'sig'ini sun'iy ravishda oshiramiz.",
      when,
      minutes,
    };
  }
  if (core.includes("kechiktirish") || get("trigger.fail_point") === "ertalab") {
    return {
      title: `Eng qo'rqinchli ishingni ${minutes} daqiqa qil — keyin to'xta`,
      why: "Zeigarnik effekti: miya tugallanmagan ishlarni eslab qolishga moyil. Faqat boshlab olsang, miyang o'zi tugatish uchun energiya ajratadi.",
      when,
      minutes,
    };
  }
  if (core.includes("maqsadsizlik")) {
    return {
      title: "Ertangi kun uchun 1 ta aniq maqsad yoz",
      why: "James Clear (Atomic Habits) ta'kidlaganidek, aniqlik — harakatning do'sti. Noaniqlik miyani 'muzlatib' qo'yadi.",
      when,
      minutes,
    };
  }
  if (core.includes("diqqat_toza_emas")) {
    return {
      title: `${minutes} daqiqa telefonsiz, bitta ish bilan o'tir`,
      why: "Cal Newport (Deep Work) tadqiqotlariga ko'ra, diqqatni bo'lish 20 daqiqalik 'e'tibor qoldig'i' (attention residue) ni qoldiradi. Biz buni tozalaymiz.",
      when,
      minutes,
    };
  }
  if (isWeekend) {
    return {
      title: "Ertangi kunning birinchi 30 daqiqasini rejalashtir",
      why: "Hafta oxiri tartibni yo'qotadigan joy — kichik reja uni ushlab qoladi.",
      when: "Bugun, istalgan payt",
      minutes,
    };
  }
  return {
    title: `${minutes} daqiqa yurish yoki cho'zilish`,
    why: "Tana harakati kayfiyat va diqqatni bir vaqtda ko'taradi — eng arzon g'alaba.",
    when,
    minutes,
  };
}
