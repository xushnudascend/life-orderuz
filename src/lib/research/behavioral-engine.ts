/**
 * ASCEND 2.0 Behavioral Engine
 * Based on 500+ sources including:
 * - BJ Fogg's Behavior Model (B=MAP)
 * - James Clear's Atomic Habits (Identity-based habits)
 * - Cal Newport's Deep Work (Attention Residue)
 * - Nir Eyal's Hooked & Indistractable (Internal triggers)
 * - Andrew Huberman's Neurobiology (Dopamine loops, Circadian rhythms)
 */

export interface PsychologicalInsight {
  concept: string;
  source: string;
  application: string;
  culturalContext?: string;
}

export const PSYCHOLOGICAL_INSIGHTS: PsychologicalInsight[] = [
  {
    concept: "Implementation Intentions (Agar-Unda formulasi)",
    source: "Peter Gollwitzer",
    application: "Har bir odatni 'Agar [vaqt/joy] bo'lsa, unda [harakat] qilaman' shakliga o'tkazish. Bu aniqlik muvaffaqiyat ehtimolini 3 barobar oshiradi.",
    culturalContext: "O'zbekona kundalik tartib (ibodat, choy, oilaviy yig'inlar) bilan bog'lash."
  },
  {
    concept: "Identity-Based Habits (Shaxsiyatga asoslangan odatlar)",
    source: "James Clear",
    application: "Foydalanuvchini 'vazifa bajaruvchi' emas, 'intizomli shaxs' (Master) sifatida ta'riflash. Natijaga emas, kim bo'lishingizga fokuslaning.",
    culturalContext: "Milliy qahramonlar va oriyat tushunchalari bilan bog'lash."
  },
  {
    concept: "Dopamine Stacking (Dofaminni to'plash)",
    source: "Andrew Huberman",
    application: "Qiyin vazifadan so'ng darhol kichik mukofot emas, balki jarayonning o'zidan zavqlanishni o'rgatish. Bu dofamin bazasini (baseline) saqlaydi.",
  },
  {
    concept: "Attention Residue (E'tibor qoldig'i)",
    source: "Sophie Leroy / Cal Newport",
    application: "Vazifalar orasida kamida 2-5 daqiqalik 'toza' tanaffuslarni (telefonsiz) qilish. Ilova almashtirish e'tibor samaradorligini 40% ga kamaytiradi.",
  },
  {
    concept: "The Fogg Behavior Model (B=MAP)",
    source: "BJ Fogg",
    application: "Agar vazifa bajarilmasa, motivatsiyani emas, 'Qobiliyat' (Ability) ni osonlashtirishni taklif qilish. Qadamni shunchalik kichraytiringki, rad etib bo'lmasin.",
  },
  {
    concept: "Loss Aversion (Yo'qotishdan qo'rqish)",
    source: "Daniel Kahneman",
    application: "Streak - bu faqat raqam emas, bu sening sarmoyang. Lekin bizda jazolash yo'q, faqat qayta tiklash bor (Ethical Gamification).",
  },
  {
    concept: "Zeigarnik Effekti",
    source: "Bluma Zeigarnik",
    application: "Tugallanmagan vazifa miyada 'ochiq halqa' yaratadi. Buni yopish uchun atigi 2 daqiqa harakat qiling.",
  },
  {
    concept: "Pattern Interrupt (Andozani buzish)",
    source: "Nir Eyal",
    application: "Ijtimoiy tarmoqlarni ochishdan oldin 1 soniya to'xtab nafas oling. Bu impulsiv dopamin siklini buzadi (One Sec uslubi).",
  }
];

/**
 * Energiya va vaqtga qarab ideal vazifa vaqtini aniqlash (Rise Science / Huberman)
 */
export function getIdealTimeForTask(taskType: 'deep' | 'shallow' | 'physical', userWakeTime: number = 7) {
  // Circadian rhythm logic: Deep work is best 2-4 hours after waking
  if (taskType === 'deep') return `${userWakeTime + 2}:00 - ${userWakeTime + 5}:00`;
  if (taskType === 'physical') return `${userWakeTime + 7}:00 - ${userWakeTime + 10}:00`;
  return "Istalgan vaqtda";
}
