/**
 * O'zbek — asosiy manba til.
 * O'zbek madaniyati va qadriyatlariga moslashtirilgan.
 */
export const uz = {
  brand: {
    name: "Life Order",
    tagline: "O'zini yengish — eng katta g'alabadir",
    oneLiner:
      "Self-Control OS — Hayotingni tartibga solish tizimi. 3 daqiqada tashxis, kunlik 3 qadam va AI mentor.",
  },
  errors: {
    auth: {
      invalid: "Email yoki parol xato. Qayta urinib ko'ring.",
      exists: "Bu email bilan ro'yxatdan o'tilgan. Kirishni tanlang.",
      confirm: "Email tasdiqlanmagan. Pochtangizni tekshiring.",
      rate: "Ko'p urinish bo'ldi. 1 daqiqa kuting.",
      weak: "Parol kamida 8 belgi bo'lishi kerak.",
      network: "Internet ulanishini tekshiring.",
      generic: "Xato yuz berdi. Qayta urinib ko'ring.",
    }
  },
  nav: {
    features: "Imkoniyatlar",
    method: "Uslub",
    mentor: "Mentor",
    pricing: "Narxlar",
    signIn: "Kirish",
    startFree: "Bepul boshlash",
    upgrade: "Premiumga o'tish",
  },
  hero: {
    eyebrow: "Beta bosqichida · Kartasiz",
    title: "Motivatsiya o'tkinchi. Tizim esa abadiy.",
    subtitle:
      "Life Order har kunlik odatlaringizni natijaga yo'naltiradi. Ortiqcha gaplarsiz, faqat amaliy qadamlar.",
    ctaPrimary: "Tashxisdan o'tish",
    ctaSecondary: "Qanday ishlaydi?",
    trustLine: "Kartasiz sinab ko'ring · O'zbek tilida",
  },
  pricing: {
    heading: "Narxlar — sodda",
    subheading: "Karta shart emas. Istalgan vaqtda to'xtatish mumkin.",
    free: {
      title: "Bepul",
      price: "0 so'm",
      period: "har doim",
      features: [
        "3 tagacha odat",
        "Sirkad ritm (Energy Map)",
        "Psixologik fokuslar",
        "Nadir (5 xabar / kun)",
        "PWA — offline ishlash",
      ],
      cta: "Ro'yxatdan o'tish",
    },
    premium: {
      title: "Premium",
      price: "59 000 so'm",
      period: "oyiga · cheksiz mentor",
      badge: "Tavsiya",
      features: [
        "Nadir Pro (Cheksiz xotira)",
        "Haftalik AI hisobot",
        "Haftasiga 3 ta Shield",
        "Burnout signalizatsiyasi",
      ],
      cta: "7 kun bepul boshlash",
    },
  },
  cta: {
    heading: "Yangi hayotni bugundan boshlang",
    body: "3 daqiqalik tashxis orqali shaxsiy o'sish rejangizni oling. Mutlaqo bepul.",
    button: "Boshlash",
  },
  footer: {
    tagline: "Self-Control OS — o'zbek tilida qurilgan.",
    beta: "Beta · Soxta iqtiboslar yo'q · Haqiqiy foydalanuvchilar",
    links: {
      terms: "Shartlar",
      privacy: "Maxfiylik",
      refund: "Qaytarish",
      security: "Xavfsizlik",
    },
    rights: "© 2026 Life Order. Barcha huquqlar himoyalangan.",
  },
  dashboard: {
    hero: {
      plan: "holat",
      level: "daraja",
      xp: "XP",
      streak: "streak",
      kun: "kun",
      discipline: "intizom",
      greetingPrefix: "bugungi",
    },
    sections: {
      urgent: "Zarur",
      dailyLoop: "Kunlik halqa",
      depth: "Chuqurroq",
      habits: "Protokol",
      quickAccess: "Modullar",
      timetable: "Kunlik jadval",
    },
    habits: {
      manage: "Boshqarish",
      emptyTitle: "Bugun bitta kichik odat boshlang",
      emptyDesc: "2 daqiqalik odatdan boshlang. AI mentor sizga yo'l ko'rsatadi.",
      emptyCta: "Reja tuzish",
      loading: "Yuklanmoqda...",
    },
    quick: {
      workout: "Tana",
      diet: "Ovqatlanish",
      quests: "Nadir AI",
      mentor: "Mentor",
    },
    depth: {
      title: "Nadir",
      insightContext: "Psixologik profil: {name}. Bugungi progress: {done}/{total} ({percent}%). Streak: {streak} kun. Arxetip: {archetype}.",
    },
  },
  settings: {
    hero: {
      title: "Ilovani o'zingga moslashtir.",
      subtitle: "Bildirishnomalar, til, mavzu va profilingni bir joyda boshqar.",
    },
    profile: {
      title: "Profil",
      name: "Ismingiz",
      public: "Ochiq profil",
      publicHint: "Profil ochiq. Hamma ko'ra oladi.",
      privateHint: "Profil yopiq. Faqat siz ko'rasiz.",
    },
    notifications: {
      title: "Bildirishnomalar",
      daily: "Kunlik eslatma",
      dailyHint: "Har kuni belgilangan vaqtda",
      streak: "Streak ogohlantirishi",
      streakHint: "Streak yo'qolayotganda",
      time: "Eslatma vaqti",
      browserCta: "Brauzer bildirishnomalariga ruxsat",
    },
    mentor: {
      title: "AI mentor",
      nadir: "Nadir bilan chuqurroq gaplashish",
      nadirHint: "Yoqilsa — dashboard'da AI paneli faol bo'ladi",
    },
    animations: {
      title: "Animatsiyalar",
      all: "Barcha effektlar",
      enabled: "Animatsiyalar yoqilgan",
      disabled: "Animatsiyalar o'chirilgan",
      level: "Harakatlanish darajasi",
      autoHint: "auto — qurilma sozlamasiga ergashadi. Tinch ish uchun kamaytirilgan tanlang.",
      reduce: "Kamaytirilgan",
      full: "To'liq",
    },
    adaptive: {
      title: "Moslashish",
      shrink: "Bahona chiqqanda vazifani avtomatik kichraytiradi",
      shrinkHint: "Sizni jazolamaydi — moslashadi",
    },
    timezone: {
      title: "Vaqt zonasi",
    },
    language: {
      title: "Til",
    },
    data: {
      title: "Ma'lumotlar",
      desc: "Barcha ma'lumotlaringizni JSON ko'rinishida yuklab olishingiz mumkin.",
      download: "Ma'lumotlarni yuklab olish",
    },
    contact: {
      title: "Biz bilan bog'lanish",
      desc: "Savol yoki taklif bo'lsa:",
    },
    save: "Saqlash",
    saving: "Saqlanmoqda...",
    success: "Sozlamalar saqlandi",
    error: "Saqlab bo'lmadi",
  },
} as const;

export type Dict = typeof uz;
