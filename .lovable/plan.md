
## Vaziyat

4 ta PDF megaprompt (jami ~2500 satr) "Life Order" (avval Ascend) — o'zbek yoshlari uchun self-control OS. Bu **kamida 25–40 sahifa, ~15 edge function, to'liq Supabase sxemasi, i18n, PWA, testlar, xavfsizlik** talab qiladigan katta loyiha. Bitta xabarda hammasini yopib bo'lmaydi — sifatsiz, buzuq va xavfsiz-emas kod chiqadi. Shu sabab **fazalarga bo'lib** quramiz. Har fazadan keyin siz ko'rib, tasdiqlaysiz.

## Umumiy stek (barcha fazalarda qat'iy)

- TanStack Start (loyihada allaqachon o'rnatilgan — React Router DOM emas, PDF'dagi eslatmadan farq qiladi)
- Tailwind + shadcn/ui, HSL semantik tokenlar (`--background`, `--primary` = `72 100% 50%` chartreuse-sariq)
- Lovable Cloud (Supabase) — RLS har bir jadvalda majburiy
- Lovable AI Gateway — `ai-mentor`, `ai-analyzer` va boshqa AI oqimlari uchun
- i18n: o'zbek asosiy til, keyin ru/en
- Serif (Times) display + Karla UI matni, 14px radius, "Obsidian" qora tema standart

## Fazalar

### Faza 1 — Fundament + Landing (shu turnda quraman)
- Dizayn tizimi: `src/styles.css`da 3 ta tema (Obsidian qora, Light, Blue) HSL tokenlar, soyalar, animatsiyalar (`fade-in`, `route-in`, `data-reveal`), `prefers-reduced-motion`
- Tipografiya: Times serif + Karla sans, root'da font linklari
- shadcn baza komponentlari mavjud (Button, Card, Dialog, Tabs, Sheet, Sonner)
- `/` marshruti — Landing sahifasi: hero ("Self-Control OS — o'z-o'zini boshqarishning operatsion tizimi..."), 3 ta asosiy feature bloki, "Nadir" mentor tanishtiruvi, pricing teaser, CTA "Boshlash" → `/auth`
- SEO: `head()` unikal title/description/og
- i18n skeleton: `src/i18n/uz.ts`, `t()` helper (react-i18next `bun add` bilan)
- PWA manifest + favicon placeholder

### Faza 2 — Auth + Onboarding
- Lovable Cloud'ni yoqib, `/auth` (email+parol, Google, Apple)
- `profiles` jadvali + `handle_new_user` trigger
- `/onboarding`: A (yosh/jins/bo'y/vazn/aktivlik + BMI) → B (trigger savollari) → reja davomiyligi (7/30 kun)
- `OnboardingGate` wrapper: `_authenticated` layout ostida
- Muhim: `answers` har doim o'zbekcha manba matnda saqlanadi

### Faza 3 — Nerv tizimi (XP/Streak/Discipline/Shield)
- Sxema: `xp_events`, `user_stats`, `streaks`, `shields`, `achievements`, `user_achievements`, `daily_quests`
- **SECURITY DEFINER** funksiyalari: `award_xp()`, `user_rank()`, `apply_shield()` — client to'g'ridan-to'g'ri yoza olmaydi
- Discipline Score 6-daraja tier (`Boshlovchi` → `Apex`)
- Sirkadian holat helperlari

### Faza 4 — Dashboard + Habits + Journal
- `/dashboard`: HubToday, HubAdvisor, bugungi 3 qadam, streak/shield ko'rsatkichi
- `/habits`: CRUD, qiyinlik 1–5, kunlik check-in → `award_xp` chaqiradi
- `/journal`: matn + kayfiyat kuzatuvi
- BottomNav (faqat authenticated + onboarded)

### Faza 5 — AI Mentor "Nadir"
- Edge function `ai-mentor` (Lovable AI Gateway, `google/gemini-2.5-flash`)
- `ai-analyzer` (kunlik, session-locked, keshlangan)
- `ai-micro-insight`, `generate-daily-quests`
- Nadir personasi: halol, murosasiz, aduляция yo'q

### Faza 6 — Workout + Diet + Analytics
- `/workout`, `/diet` — asosiy CRUD + AI tavsiya
- `/analytics` — Recharts, haftalik hisobot

### Faza 7 — Community + Leaderboard + Profile
- `/community`, `/community/party`, `/leaderboard`, `/profile`, `/u/:username`
- Ommaviy profil viewer

### Faza 8 — Monetizatsiya + PWA + Xavfsizlik yakunlash
- Paddle (yoki Stripe fallback), `/pricing`, `/checkout/success`
- `freeTierLimits` markazlashgan konfiguratsiya
- Service worker, offline sahifasi
- CSP headers, security regression testlari
- `/terms`, `/privacy`, `/refund`, `/security`

### Faza 9 — Sozlamalar + Bildirishnomalar + Kurslar + Sayqallash
- `/settings`, `/notifications`, `/courses/:id`, `/c/:slug`
- Push + (ixtiyoriy) Telegram integratsiyasi
- E2E Playwright, Lighthouse CI

## Muhim savol siz uchun

PDF'da `react-router-dom` va Render.com hosting yozilgan. Bu loyiha esa **TanStack Start** ustida (Lovable'ning yangi standart steki, SSR bilan). Men PDF'ning **niyati va spetsifikatsiyasini** (ranglar, sahifalar, xavfsizlik, AI oqimlari, ohang) to'liq bajaraman, lekin **routing/SSR uchun TanStack Start**da qolaman — bu Lovable Cloud bilan mahkam integratsiya. Rozimi?

## Bugun nima bo'ladi

Bu reja tasdiqlangach, **Faza 1**ni to'liq bajaraman (dizayn tizimi + Landing + i18n skeleton + PWA manifest). Keyin siz ko'rib, "Faza 2 ga o't" desangiz davom etamiz.

## Texnik detallar (dev uchun)

- Marshrutlar TanStack file-based, `src/routes/`ga joylashadi
- Ranglar: `hsl(var(--primary))` — hech qachon `bg-black`/`text-white`
- Serverdagi maxfiy kalitlar faqat `.server.ts` fayllarida
- Har bir jadvalda `GRANT` + `RLS` + policy — public schema qoidasiga rioya
- `xp_events`, `user_achievements` — faqat SECURITY DEFINER orqali yoziladi
