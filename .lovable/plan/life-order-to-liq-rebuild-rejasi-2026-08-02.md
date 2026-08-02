# Life Order — To'liq Rebuild Rejasi

## 0. Hozirgi holat bahosi (halol, 10 ballik)

| Mezon | Ball | Izoh |
| --- | --- | --- |
| Texnik poydevor (TanStack, Cloud, RLS, PWA) | 8.5 | Kuchli tomoni |
| Xavfsizlik | 8.0 | SECURITY DEFINER, GRANT'lar tartibli |
| SEO | 8.0 | Canonical, JSON-LD, sitemap bor |
| Landing copywriting | 5.5 | Xabar bor, lekin isbot/struktura zaif |
| Landing UI/UX | 5.0 | To'liq ekranga moslashmaydi, premium his yo'q |
| Auth UX | 4.5 | Ortiqcha animatsiya, faqat Google |
| Onboarding sifati | 5.0 | Savollar sayoz, o'tish juda tez |
| Dashboard tartibi | 5.0 | Ma'lumot ko'p, ierarxiya yo'q |
| Bo'limlar (13 ta) izchilligi | 4.5 | Har biri boshqacha, sekin |
| Dizayn tizimi izchilligi | 3.5 | 3 xil tema — landing yashil, dashboard sariq/ko'k |
| Tezlik (LCP/navigatsiya) | 5.5 | Har sahifada client fetch, skeleton yo'q |
| Personalizatsiya (test → reja) | 3.0 | Javoblar real rejaga ulanmagan |
| Monetizatsiya | 6.0 | Payme/Click bor, konversiya yo'li zaif |
| Analitika | 6.0 | Event yozuvi bor, panel yo'q |

**Umumiy o'rtacha: 5.6 / 10** — texnik jihatdan tirik, mahsulot sifatida hali "premium" emas.
Startap prognozi: hozirgi holatda 12 oy ichida o'sish qiyin; asosiy xavf — retention (onboarding→1-kun→7-kun), chunki foydalanuvchi birinchi 60 soniyada aniq foyda ko'rmaydi.

## 1. Yagona dizayn tizimi (hamma narsaning poydevori)

Bozor tahlili: Linear, Superhuman, Whoop, Oura, Duolingo — hammasi **bitta** rang kombinatsiyasi va past to'yinganlikdagi fon ishlatadi; urg'u rangi faqat 5–10% maydonda.

- Bitta tema: `Obsidian + Amber`. Fon `hsl(0 0% 6%)`, sirt `hsl(0 0% 9%)`, urg'u `hsl(38 92% 55%)` (amber), matn `hsl(40 8% 96%)`.
  Amber tanlandi: iliq ranglar intizom/odat ilovalarida "davomiylik" hissini kuchaytiradi (Whoop/Oura yondashuvi), neon yashil esa ekran charchog'ini oshiradi.
- Landing va dashboard **bir xil** tokenlardan foydalanadi. Ortiqcha temalar (`theme-switcher` variantlari) olib tashlanadi, faqat dark qoladi.
- Tipografika: sarlavha uchun mavjud serif, interfeys uchun `font-ui`. Bo'shliq shkalasi 4/8/16/24/40/64.
- Animatsiya qoidasi: faqat `opacity` + `transform`, 150–320ms, `cubic-bezier(0.16,1,0.3,1)`. Parallaks orb, ko'p qatlamli glow, aylanuvchi halqalar olib tashlanadi. `prefers-reduced-motion` hurmat qilinadi.

## 2. Landing (rasm 1)

- To'liq ekran: har bo'lim `min-h-dvh` emas, `w-full` + markazlangan `max-w-6xl` konteyner; hero balandligi `min-h-[88svh]`, chetlarda bo'sh joy yo'qoladi.
- Struktura (SaaS konversiya standarti): Hero → 3 ta natija ko'rsatkichi → "Qanday ishlaydi" 3 qadam → Nadir namunasi → Ilmiy asos → Narx → FAQ → Yakuniy CTA.
- Copywriting qayta yoziladi: har blokda bitta va'da + bitta isbot. Soxta raqam yo'q — faqat real foydalanuvchi soni va ilmiy manba nomi (implementation intentions, habit stacking, self-determination theory).
- Animatsiya: bir martalik `reveal` (opacity+8px), CTA'da mayin scale 1.01, boshqa hech narsa.
- Tozalash: `hero-backdrop`, `corner-ornament`, `magnetic`, ortiqcha `tilt` — landingdan olib tashlanadi.

## 3. Auth (rasm 2)

- Fon animatsiyalari o'chiriladi; o'rniga statik gradient + juda sekin (20s) bitta nafas effekti.
- Provayderlar: Google, Apple, Microsoft — to'g'ridan-to'g'ri OAuth tugmalari (Cloud provayderlari sozlanadi).
- "Shifrlangan · Reklamasiz · Istagan payt o'chirasan" matni olib tashlanadi. O'rniga: **"Maxfiylik va shartlarni qabul qilaman"** checkbox — belgilanmasa tugma o'chiq (disabled), belgilanganda tugma mayin ravishda "yonadi".
- Kartochka: 1px chegara, ichki 32px padding, input balandligi 48px, fokus holati amber halqa. Xato holatlari input ostida, qizil emas — muted amber.

## 4. Onboarding (rasm 3)

- 9 savol saqlanadi, lekin har biri **real signal** beradi:
  jins, yosh oralig'i, bo'y/vazn (kaloriya uchun), uyqu oynasi, ish/o'qish jadvali, asosiy muammo (multi), oldingi urinishlar, mavjud vaqt (kuniga daqiqa), 1 ta erkin maqsad matni.
- O'tish: javob bosilganda 260ms feedback (belgi + mayin scale), keyin avtomatik emas — **"Davom etish"** tugmasi faollashadi; multi-select savollarda avtomatik o'tish umuman yo'q.
- Progress: yuqorida yupqa chiziq + qadam raqami, sakrash yo'q.
- Yakunda: joriy soat, hafta kuni va javoblardan kelib chiqib **bitta** bugungi vazifa generatsiya qilinadi (masalan kech soat 21:00 bo'lsa — "Telefonni 22:30da jimga qo'y, 2 daqiqa"). Vazifa `daily_tasks`ga yoziladi va "Yo'ling tayyor" ekranida ko'rsatiladi.

## 5. Dashboard (rasm 4)

- Chap sidebar olib tashlanadi. Yuqori panel: chapda logo, o'ngda qidiruv + profil + **hamburger (3 chiziq)**; hamburger bosilsa o'ngdan sheet-menyu ochiladi (barcha 13 bo'lim guruhlangan holda).
- Kontent 3 qatlam: (1) Bugun — 1 ta asosiy vazifa + streak + intizom; (2) Kunlik halqa — odatlar, jadval, tez yozuv; (3) Chuqurroq — tahlil, davra, yutuqlar (yig'ilgan holatda).
- Bo'sh holatlar aniq matn bilan: nima qilish kerakligi bitta jumlada.
- Animatsiya: kartochkalar 40ms kechikish bilan ketma-ket paydo bo'ladi, raqamlar odometr (faqat bir marta).

## 6. 13 bo'lim (rasm 5)

- Bitta shablon: `PageHero` → asosiy amal → ro'yxat/holat → chuqur ma'lumot. Har bo'lim bir xil bo'shliq va sarlavha uslubi.
- Tezlik: har sahifa loader + `ensureQueryData` bilan oldindan yuklanadi, skeleton qo'yiladi; ketma-ket so'rovlar bitta RPCga birlashtiriladi.
- Har bo'lim boshida 1 qatorli "bu nima uchun kerak" izohi — noaniqlik yo'qoladi.

## 7. Hub va FAB (rasm 6)

- FAB: bitta amber tugma; bosilganda 4 ta amal yoyiladi (Odat belgilash, Kundalik, Nadir, Vazifa). Ikkinchi suzuvchi tugma olib tashlanadi.
- "Tezkor kirish" kartochkalari ikonka + nom + bir og'iz izoh bilan, teng o'lchamli grid.

## 8. Shaxsiylashtirish dvigateli

- `plan_rules` server funksiyasi: jins, yosh, vazn/bo'y, uyqu, mavjud vaqt va o'tgan 7 kunlik bajarish foizidan kelib chiqib kunlik 3 mikro-qadam va kaloriya/mashq og'irligini hisoblaydi.
- Nadir har javobda foydalanuvchi qaysi sahifada ekanini va oxirgi 7 kunlik faoliyatini konteks sifatida oladi.

## Texnik tafsilotlar

- `src/styles.css`: bitta token to'plami, ortiqcha temalar o'chiriladi.
- Yangi: `src/components/app-topbar.tsx`, `src/components/nav-sheet.tsx`, `src/lib/plan-rules.server.ts`, `src/lib/onboarding-task.ts`.
- O'chiriladi: `hero-backdrop.tsx`, `corner-ornament.tsx`, `magnetic.tsx`, `sidebar-nav.tsx` (topbar+sheet bilan almashadi), `theme-switcher.tsx` variantlari.
- Migratsiya: `daily_tasks` jadvaliga `source`/`generated_reason` ustunlari, `onboarding_profile` maydonlari (jins, bo'y, vazn, uyqu, mavjud vaqt) — GRANT + RLS bilan.
- OAuth: Apple va Microsoft provayderlari Cloud tomonida yoqiladi.

## Bosqichlar

1. Dizayn tizimi + landing
2. Auth + onboarding + bugungi vazifa generatsiyasi
3. Dashboard + topbar/sheet + FAB
4. 13 bo'lim izchilligi + tezlik
5. Shaxsiylashtirish dvigateli + yakuniy audit va qayta baholash

Tasdiqlasangiz, 1-bosqichdan boshlayman.
