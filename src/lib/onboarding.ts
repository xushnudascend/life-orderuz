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
  {
    key: "trigger.core",
    section: "B",
    prompt: "O'zingizda qaysi muammolarni ko'ryapsiz?",
    helper: "Eng asosiylarini tanlang (bir nechta variant mumkin).",
    type: "multi",
    options: [
      { value: "telefon_qaramlik", label: "Ekran qaramligi (digital odat)" },
      { value: "kechiktirish", label: "Ertaga qoldirish (prokrastinatsiya)" },
      { value: "diqqat_toza_emas", label: "Diqqatni jamlay olmaslik" },
      { value: "irodasiz", label: "Rejani bajara olmaslik" },
    ],
  },
  {
    key: "trigger.energy_time",
    section: "B",
    prompt: "Eng yuqori energiyangiz qaysi vaqtda?",
    type: "single",
    options: [
      { value: "ertalab", label: "Ertalab (Tonggi odam)" },
      { value: "tush", label: "Tushdan keyin" },
      { value: "kechqurun", label: "Kechqurun (Tungi boyqush)" },
    ],
  },
  {
    key: "profile.age",
    section: "A",
    prompt: "Yoshingiz nechida?",
    type: "number",
    min: 13,
    max: 90,
    suffix: "yosh",
  },
  {
    key: "profile.sex",
    section: "A",
    prompt: "Jinsingiz?",
    type: "single",
    options: [
      { value: "erkak", label: "Erkak" },
      { value: "ayol", label: "Ayol" },
    ],
  },
  {
    key: "profile.activity",
    section: "A",
    prompt: "Kunlik faolligingiz qanday?",
    type: "single",
    options: [
      { value: "kam_harakat", label: "Kam harakat (o'tirib ishlash)" },
      { value: "o_rta", label: "O'rtacha (faol hayot)" },
      { value: "faol", label: "Juda faol (sportchi)" },
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
