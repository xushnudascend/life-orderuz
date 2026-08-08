/**
 * O'zbek — asosiy manba til.
 * O'zbek madaniyati va qadriyatlariga moslashtirilgan.
 */
export const uz = {
  brand: {
    name: "Life Order",
    tagline: "Intizom — iroda mevasidir",
    oneLiner:
      "Self-Control OS — o'zbekona intizom va zamonaviy fan uyg'unligi. Tashxis, protokol va halol mentor Nadir.",
  },
  errors: {
    auth: {
      invalid: "Email yoki parol mos kelmadi. Qayta tekshirib ko'ring — hech narsa yo'qolmadi.",
      exists: "Bu email allaqachon ro'yxatdan o'tgan. Kirish tabini tanlang yoki parolni tiklang.",
      confirm: "Email hali tasdiqlanmagan. Pochtangizni tekshiring — havola yuborilgan.",
      rate: "Ko'p urinish bo'ldi. Bir daqiqadan keyin qayta urinib ko'ring.",
      weak: "Parol kuchsizroq — kamida 8 belgi va turli-tuman kombinatsiya bering.",
      network: "Internet aloqasi uzildi. Ulanish tiklanganda qayta urinib ko'ring.",
      generic: "Xato yuz berdi. Qayta urinib ko'ring — hech narsa buzilmadi.",
    }
  },
  nav: {
    features: "Imkoniyatlar",
    method: "Uslub",
    mentor: "Mentor",
    pricing: "Narxlar",
    signIn: "Kirish",
    startFree: "Bepul boshlash",
  },
  hero: {
    eyebrow: "Beta bosqichida · Kartasiz",
    title: "O'zingni yengish — eng katta g'alabadir.",
    subtitle:
      "Life Order sening kunlaringni tartibli amallar zanjiriga aylantiradi. Ortiqcha gaplarsiz. Nadir — sening vijdoningdek halol AI mentor.",
    ctaPrimary: "3 daqiqada tashxisdan o't",
    ctaSecondary: "Uslubimiz haqida",
    trustLine: "Kartasiz · O'zbek tilida · Milliy intizom tizimi",
  },
  pricing: {
    heading: "Narxlar — sodda",
    subheading: "Kartasiz sinash. Yoqmasa — hech qanday yozuv qolmaydi.",
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
        "Kutubxona: Cheksiz kitob va maqolalar",
        "Kurslar: Maxsus video darsliklar",
        "Kundalik: Cheksiz tahliliy yozuvlar",
        "Nadir Pro (Cheksiz xotira)",
        "Haftalik AI audit va hisobot",
        "Haftasiga 3 ta Shield",
        "Burnout signalizatsiyasi",
      ],
      cta: "7 kun bepul boshlash",
    },
  },
  cta: {
    heading: "Bugun boshla. Ertaga — g'animat.",
    body: "3 daqiqalik tashxis. Hech qanday karta shart emas. Sen uchun yangi yo'l.",
    button: "Tashxisni boshlash",
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
      plan: "reja",
      level: "Daraja",
      xp: "XP",
      streak: "Streak",
      kun: "kun",
      discipline: "Intizom",
      greetingPrefix: "Bugungi",
    },
    sections: {
      urgent: "Zarur",
      dailyLoop: "Kunlik halqa",
      depth: "Chuqurroq",
      habits: "Bugungi protokol",
      quickAccess: "Modullar",
      timetable: "Kunlik jadval",
    },
    habits: {
      manage: "Boshqarish",
      emptyTitle: "Bugundan boshlab bitta kichik odat",
      emptyDesc: "2 daqiqalik odatdan boshlang — Nadir siz uchun shaxsiy reja tuzib beradi.",
      emptyCta: "Shaxsiy reja tuzish",
      loading: "Yuklanmoqda...",
    },
    quick: {
      workout: "Tana",
      diet: "Ovqatlanish",
      quests: "Kurslar & Kutubxona",
      mentor: "Mentor",
    },
    depth: {
      title: "Chuqurroq · Nadir, retentsiya, 100 kun",
      insightContext: "Psixologik profil: {name}. Bugungi progress: {done}/{total} ({percent}%). Streak: {streak} kun. Arxetip: {archetype}. Ilmiy tavsiya: {label}.",
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
