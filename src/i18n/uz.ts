/**
 * O'zbek — asosiy manba til.
 * Ru/En keyingi bosqichda qo'shiladi (i18next bilan almashtiriladi).
 * Kalitlar mavzu bo'yicha guruhlangan, nuqta bilan bo'lingan.
 */
export const uz = {
  brand: {
    name: "Life Order",
    tagline: "Hayotingni tartibga sol",
    oneLiner:
      "Self-Control OS — o'z-o'zini boshqarishning operatsion tizimi. Trigger tahlili, kunlik uchta aniq qadam, halol AI mentor Nadir. 60 soniyada tashxis. Kartasiz.",
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
    title: "O'zingni boshqara olmaslik — kasallik emas, tizim yo'qligidir.",
    subtitle:
      "Life Order sening kunlaringni uchta aniq qadamga aylantiradi. Emojisiz. Ustozliksiz. Nadir — halol AI mentor — sen bilan haqiqatni gaplashadi.",
    ctaPrimary: "60 soniyada tashxisni ol",
    ctaSecondary: "Uslubni ko'rish",
    trustLine: "Kartasiz · O'zbek tilida · PWA — telefonga o'rnatiladi",
  },
  pillars: {
    heading: "Uchta ustun — bir tizim",
    subheading:
      "Odat-tracker emas. Trigger tahlili, kunlik uchta qadam va halol mentor — bir joyda birlashgan.",
    items: [
      {
        tag: "01 · Tashxis",
        title: "Trigger tahlili",
        body: "Onboarding paytida naqshingni aniqlaymiz: e'tiborsizlik, tartibsizlik yoki maqsadsizlik. Yo'l shunga qarab yasaladi.",
      },
      {
        tag: "02 · Amaliyot",
        title: "Kunlik uchta qadam",
        body: "Har kuni uchta aniq harakat — ko'p emas, kam emas. Bajarsan — XP, streak va Discipline Score o'sadi.",
      },
      {
        tag: "03 · Muloqot",
        title: "Nadir — halol AI mentor",
        body: "Nadir seni maqtamaydi. Nadir haqiqatni aytadi — hurmat bilan. Reja tuzadi, savol beradi, kerak bo'lsa to'xtatadi.",
      },
    ],
  },
  nervous: {
    heading: "Nerv tizimi — ko'zga ko'rinmas, lekin sen his qilasan",
    subheading:
      "XP, Streak, Shield va Discipline Score bir-biri bilan bog'langan. Server tomonida hisoblanadi — soxtalashtirish yo'q.",
    tiers: [
      { range: "0–19", uz: "Boshlovchi", en: "Beginner" },
      { range: "20–39", uz: "Intizomli", en: "Disciplined" },
      { range: "40–59", uz: "Kuchli", en: "Strong" },
      { range: "60–74", uz: "Elita", en: "Elite" },
      { range: "75–89", uz: "Usta", en: "Master" },
      { range: "90–100", uz: "Apex", en: "Apex" },
    ],
    shield:
      "Himoya (Shield) — haftada bir marta streak uzilishidan qaytaradi. Bu jazolovchi emas, qo'llab-quvvatlovchi mexanika.",
  },
  mentor: {
    heading: "Nadir kim?",
    body: "Nadir — sensiz uxlamaydigan yordamchi emas. U — sening tanlovlaringni ko'rib, halol javob beradigan xarakter. \"Yaxshi ish qilyapsan\" degan bo'sh maqtov Nadir'da yo'q. Nima ish qilyapsan, nega qilyapsan, keyin nima bo'ladi — shu uchtasi.",
    quote:
      "«Sen bugun mashqni o'tkazib yubording. Sabab charchoq emas — sabab uyquga borishdan qo'rqishing. Ertaga soat 22:30 da telefonni jimjitga qo'y. Boshqa hech narsa.»",
    quoteBy: "— Nadir, real chat namunasi",
  },
  pricing: {
    heading: "Narxlar — sodda",
    subheading: "Kartasiz sinash. Yoqmasa — hech qanday yozuv qolmaydi.",
    free: {
      title: "Bepul",
      price: "0 so'm",
      period: "har doim",
      features: [
        "Uchta kunlik qadam",
        "Odatlar va streak",
        "Nadir bilan haftada 5 marta gaplashish",
        "Asosiy statistika",
      ],
      cta: "Ro'yxatdan o'tish",
    },
    premium: {
      title: "Premium",
      price: "$4.99",
      period: "oyiga · 7 kun bepul sinov",
      badge: "Tavsiya",
      features: [
        "Cheksiz Nadir muloqoti",
        "Kunlik AI tahlil va reja",
        "Workout + Diet moduli",
        '"Davra" — jamoa va Party',
        "Leaderboard va yutuqlar",
      ],
      cta: "7 kun bepul boshlash",
    },
  },
  cta: {
    heading: "Bugun boshla. Ertaga — kech.",
    body: "60 soniyada onboarding. Karta so'ralmaydi. Yoqmasa, hech qanday izing qolmaydi.",
    button: "Tashxisdan o'tish",
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
} as const;

export type Dict = typeof uz;
