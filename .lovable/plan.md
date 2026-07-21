# Life Order — To'liq Mukammallashtirish Rejasi

**Bosh Xulq-Atvor Arxitektori** sifatida butun saytni real neyrobiologiya, xulq-atvor iqtisodiyoti va evolyutsion dizayn tamoyillari asosida qayta quramiz. Rejadagi har o'zgarish 3 ta savolga javob beradi: (1) qaysi tadqiqotga asoslangan, (2) qaysi kognitiv/hissiy ehtiyojni qondiradi, (3) qanday metrikada o'lchanadi.

---

## Umumiy holat — halol audit

| Sahifa | Baho | Asosiy bo'shliq |
|---|---|---|
| Landing `/` | 7.5 | Ikkita CTA, real DOI yo'q, above-fold social proof yo'q |
| Auth `/auth` | 6.5 | Trust cue yo'q, xato xabarlari quruq, floating orbs shovqin |
| Onboarding | 6 | Alohida "Aha!" ekran yo'q, Zeigarnik banner yo'q |
| Dashboard | 6 | F-pattern buzilgan, empty state zaif, 1 asosiy amal ko'rinmaydi |
| Habits | 5.5 | Implementation intention builder yo'q, milestone rasm yo'q |
| Mentor | 7 | Reflective listening yo'q, AI Elements ishlatilmagan |
| Community | 5 | Dunbar cheklovi yo'q, reciprocity yo'q |
| Profile | 6 | Identity affirmation yo'q, 30/60/90 timeline yo'q |
| Pricing | 7 | Decoy zaif, oylik ekvivalent yozilmagan |
| Legal | 6.5 | Founder yuzi/imzosi yo'q, "biz X qilamiz/qilmaymiz" formati yo'q |
| Performance | 7 | Skeleton yo'q, LCP hero o'lchamsiz |
| A11y | 7 | Focus ring standartsiz, ba'zi icon-only tugmalarda aria-label yo'q |

**Umumiy: 6.5 / 10** — poydevor bor, lekin "milliard dollarlik" tuyg'usi uchun 14 aniq bo'shliq bor.

---

## Guruhlar — Impact / Effort matritsa

Har guruh atomik commit, ilmiy asos + kutilayotgan xulq-atvor ta'siri + metrika bilan.

### 🥇 G1 — Landing Hero + Social Proof (Impact 9 / Effort 3)

**Ilmiy asos:** Miller's Law (7±2), Von Restorff (isolation), Cialdini (social proof), amygdala tinchligi (LeDoux).

**O'zgarishlar:**
- Ikkita CTA → bitta primary + ghost link (Hick's Law)
- Above-the-fold shivirlashi: "Bugun N kishi tizimga kirdi" (real yoki halol "erta bosqich" varianti)
- Hero halo — sokin 4s "nafas" animatsiyasi (harakat yo'q, faqat opacity/scale)
- Sub-headline: mexanizmni bir jumlada (System 2 uchun tayanch)
- 60-30-10 rang qoidasi: neytral 60%, sekondar 30%, amber urg'u 10%

**Metrika:** Hero → CTA click-through, bounce rate, scroll-past-fold %.

### G2 — Mechanism Loop + Real DOI Sitatalar (Impact 8 / Effort 4)

**Ilmiy asos:** Authority bias (Cialdini), chunking, storytelling instinct.

**O'zgarishlar:**
- Chiziqli mexanizm → **pastadir (loop) SVG**: Cue → Routine → Reward → Identity
- Har bosqichga tadqiqotchi + institut + DOI:
  - Lally et al. 2010 (UCL) — 66-kun
  - Graybiel MIT — basal ganglia loop
  - Schultz 1997 — dopamin RPE
  - Wood & Clear — identity-based habits
- "Ilmiy asos" bloki: 3-5 real journal havolasi

**Metrika:** Science section dwell time, external link click.

### 🥇 G3 — Pricing Anchor + Decoy + Risk Reversal (Impact 9 / Effort 2)

**Ilmiy asos:** Anchoring (Tversky/Kahneman), decoy effect (Ariely), loss aversion 2.5x, framing (Thaler).

**O'zgarishlar:**
- Yillik tarif birinchi ko'rinadi (anchor high)
- Har tarifda oylik ekvivalent: "~$X/oy" (framing)
- "Eng mashhur" badge — Pro
- 14 kun "hech so'roqsiz qaytarish" rozetkasi (risk reversal)
- Decoy: yillik = oylikning ~10 barobari, lekin 2 oy tekin (asimetriya)
- Money-back copy plain-language

**Metrika:** Pricing → checkout, avg. plan value (annual/monthly ratio).

### G4 — Auth Empatiya + Trust Signals (Impact 6 / Effort 2)

**Ilmiy asos:** Trust hierarchy (Cialdini), cognitive minimalism (Sweller), Fitts's Law.

**O'zgarishlar:**
- Floating orbs olib tashlash (amygdala tinchligi)
- 🔒 satri: "Ma'lumot shifrlangan · Toshkentda saqlanadi"
- Empatik xato xabarlari: "Parol mos kelmadi. Qayta urin yoki tikla."
- Password toggle kontrasti WCAG AA (ikkala holatda)
- Google birinchi (default bias), email/parol keyin

**Metrika:** Auth error → retry rate, signup completion.

### 🥇 G5 — Dashboard F-Pattern + Peak Moment (Impact 8 / Effort 4)

**Ilmiy asos:** F-pattern reading (Nielsen), peak-end rule (Kahneman), dopamin RPE (Schultz), progressive disclosure.

**O'zgarishlar:**
- Yuqori-chapda: streak + bugungi 1 asosiy amal (katta, urg'u)
- Bento grid: har blok = 1 vazifa (cognitive chunking)
- Har kirishda 1 marta subtle amber pulse — faqat progress bo'lsa (dopamin micro-hit)
- **Skeleton loader'lar** — spinner o'rniga (perceived performance)
- Empty state har blokda: "keyingi qadam" ko'rsatiladi
- 1-hafta oddiy, 2-haftadan ilg'or metrikalar ochiladi (progressive complexity)

**Metrika:** Dashboard TTI, daily active, sessions/week, empty-state → action %.

### 🥇 G6 — Habits: Implementation Intention + Stacking + Milestone (Impact 9 / Effort 5)

**Ilmiy asos:** Implementation intentions (Gollwitzer, 2-3x bajarilish), habit stacking (Clear), Lally 2010 (66-kun), Ulysses contract (commitment device).

**O'zgarishlar:**
- Yangi odat formasi: **"Agar [cue], men [routine] qilaman"** strukturasi
- Habit stacking dropdown: "Mavjud odatimga bog'lash"
- 3 / 7 / 21 / 66 / 100 kun **milestone rasm + confetti** (1 marta har milestone)
- Shield / streak-freeze copy: **"O'zingni kelajakdagi o'zingdan himoya qil"**
- Variable reward: XP kichik diapazonda tebranadi (salomatlik uchun Skinner box)

**Metrika:** Habit creation → 7-day retention, streak > 21-day %, shield usage.

---

## Qo'shimcha ko'p qatlamli ishlar (G1-G6 tugagach)

**Onboarding — IKEA + Zeigarnik**
- Har javob "sening tizimingni" quradi (endowment)
- Alohida "Aha!" ekran: javoblardan arxetip + shaxsiy prognoz
- Yakunlanmagan onboarding — dashboard'da eslatma banner (Zeigarnik)

**Mentor — Reflective + CBT**
- Avval takrorlaydi ("Sen shu tuyg'ular haqida yozding..."), keyin so'raydi
- CBT reframing: negativ fikrni qayta shakllantirish
- Bounded response: 3-6 gap
- **AI Elements** komponentlariga o'tish (Conversation, Message, PromptInput, Shimmer)

**Community — Dunbar + Reciprocity**
- Har kanal 150 dan oshsa sub-guruhlarga bo'linadi
- Yordam berganga XP (reciprocity halqasi)
- Real progress ko'rsatish (privacy'ni saqlagan holda)

**Profile — Identity affirmation + Timeline**
- "Men — [arxetip]" banner, streak/level tasdiqlaydi
- 30 / 60 / 90 kunlik o'zgarish timeline vizualizatsiyasi
- Growth mindset copy: "hali erisha olmadim"

**Legal — Founder story + Plain language**
- 8-sinf tili
- "Biz X qilamiz. Biz Y qilmaymiz." formati
- Founder yuzi + imzo (parasocial trust)

**Design system — universal**
- Tipografiya modular scale 1.25 (matematik uyg'unlik)
- 8pt grid — hamma masofalar shu multiplikatorda
- Motion 200-300ms (Doherty threshold), reduced-motion har doim
- Focus ring — 2px amber, hech qachon `outline: none`
- Kontrast WCAG AAA matn, AA sekondar

**Performance**
- LCP < 2.5s, INP < 200ms, CLS < 0.1
- Hero image o'lchami aniq (CLS 0)
- Route-level code splitting (allaqachon bor)
- Font preload critical + `font-display: swap`
- Prefetch on hover (TanStack intent)

**A11y**
- Har icon-only tugmaga aria-label
- Klaviatura bilan har amal
- Color-blind: ma'no faqat rangda emas
- Motor: tap-target min 44×44px

---

## Bajarilish tartibi

Har guruhdan keyin sizga quyidagi hisobot keladi:

1. **Ilmiy asos** — qaysi tadqiqot, muallif, yil
2. **Kutilayotgan xulq-atvor ta'siri** — konkret gipoteza
3. **O'lchanadigan metrika** — nima yaxshilanishi kutiladi

### Ish tartibi variantlari

**A) 🥇 Top-impact uchtasi — G1 + G3 + G6** (landing + pul + odat, ~1-2 sessiya)
Eng ko'p ta'sir, eng kam vaqt. Tavsiya etaman.

**B) Tartib bo'yicha** — G1 → G2 → G3 → G4 → G5 → G6, keyin qo'shimchalar (~4-5 sessiya, to'liq)

**C) Bitta aniq guruh** — masalan faqat G5 dashboard yoki G6 habits

---

## Muvaffaqiyat mezoni

Reja tugaganda har sahifa quyidagi 6 savolga HA javob beradi:

1. Qaysi ilmiy tadqiqotga asoslangan?
2. Qaysi kognitiv/hissiy ehtiyojni qondiradi?
3. LCP/INP/CLS'ni yomonlashtirmaydimi?
4. A11y'ni buzmaydimi?
5. 30 soniyada tushuntirib bo'ladimi?
6. Brand ovozini kuchaytiradimi (halol, ilmiy, empatik)?

Umumiy baho: **6.5 → 9+ / 10**.

**Qaysi variantdan boshlaymiz — A, B yoki C?**
