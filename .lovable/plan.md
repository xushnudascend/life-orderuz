# Life Order — psixologik rebuild (4 to'lqin)

Nom **Life Order** qoladi. Har bir to'lqin ishlab chiqarish darajasida yakunlanadi — UI + backend + kopirayting + a11y + animatsiyalar. To'lqinlar ketma-ket, chunki keyingisi oldingisining chiqishidan foydalanadi (Score → Landing "senga o'xshaganlar" → AI xotira → XP tizimi).

---

## To'lqin 1 — Onboarding: Human Potential Assessment

**Maqsad:** 3 daqiqada foydalanuvchi haqida psixologik profil yig'ish, real natija ko'rsatish, personal yo'l xarita berish.

**Yangi baho blokelari (9 shkala, har biri 2-3 savol, Likert 1-5):**
- Self-Control (Tangney SCS-13 qisqartma)
- Dopamine Dependence (short-form video, doomscroll chastota)
- Goal Clarity (aniq, o'lchanadigan)
- Confidence (self-efficacy, Bandura)
- Discipline (consistency last 30 kun)
- Sleep Quality (PSQI-lite 3 savol)
- Social Media Addiction (Bergen SMAS qisqartma)
- Purpose Level (Meaning in Life Q qisqartma)
- Environment Quality (uy/telefon/atrof)

**Chiqadigan skorlar (0–100, formula shaffof):**
- Human Potential Score (barcha 9 shkala og'irlikli)
- Discipline Score (self-control + discipline + environment)
- Focus Score (dopamine + social media + sleep, teskari)
- Addiction Risk Score (yuqori = xavf)

**Ekranlar:**
1. Intro — "Sizning hozirgi 'men' — yakuniy 'men' emas" (identity framing, Higgins self-discrepancy)
2. 9 blok, har biri progress bar bilan (goal gradient effect)
3. Hisoblash animatsiyasi (2s, anticipatsiya, dopamin RPE)
4. Reveal — 4 ta skor ring bilan, peer benchmark ("sizga o'xshagan 24 yoshli erkaklar orasida 34-persentil")
5. Personal roadmap — 3 bosqichli (Reclaim/Rebuild/Rise), avval qaysi shkala eng past — o'sha birinchi
6. Commitment — "Men [ism] o'zimga so'z beraman..." + sanani yozadi (Cialdini commitment)

**Backend:**
- `assessment_responses` (user_id, question_key, value 1-5)
- `assessment_scores` (user_id, potential, discipline, focus, addiction_risk, computed_at)
- `roadmap_stages` (user_id, stage_index, focus_area, target_date, status)
- Server function `computeScores` — deterministik, snapshot saqlaydi
- `archetypePeers` allaqachon bor — persentil hisobi qo'shiladi

---

## To'lqin 2 — Landing: 5 sekundli xabar

**Maqsad:** birinchi 5 sekundda foydalanuvchi tushunsin — nima, nima uchun, transformatsiya qanday. Har bir bo'lim psixologik funksiyaga bog'langan.

**Yangi struktura:**
1. **Hero (5s test):** "Telefon sizni yeb qo'ymoqda. Vaqt qaytaring." + 1 ta CTA "3 daqiqalik testni boshlang" (concrete, no jargon)
2. **Trust whisper:** "Reklama yo'q · Kuzatuv yo'q · Toshkentda qurilgan" (bor edi — saqlanadi)
3. **Peer mirror (yangi):** "Bugun 1,247 kishi telefonini yopib, o'z ustida ishladi" — jonli tribe signal (Cialdini social proof)
4. **Loss aversion frame:** "Har kuni Instagram'da 4 soat = yiliga 60 kun. Bir umr — ...yil" — real hisob (Kahneman)
5. **Transformation narrative:** 3-panel "Ilgari / Hozir / 90 kundan keyin" — identity ladder (James Clear)
6. **Mechanism:** allaqachon bor — sayqallanadi (Duhigg loop)
7. **Anti-value:** "Life Order NIMA EMAS" — o'yin emas, terapiya emas, motivatsiya app emas (paradoks: rad qilish orqali ishonch — Cialdini)
8. **Pricing:** allaqachon 3-tier — CTA to'g'rilanadi
9. **Founder pledge:** bor, saqlanadi

**Kopirayting:** har bir da'vo bir DOI/ref bilan (Wood 2002, Lally 2010, Fogg 2020, Kahneman 1979).

---

## To'lqin 3 — Nadir AI: shaxsiyat + xotira

**Maqsad:** Nadir foydalanuvchi haqida hamma narsani biladigan mentor bo'lsin — muloyim, lekin excusesga chidamli.

**Shaxsiyat:**
- System prompt qayta yoziladi: 30% Goggins (challenge), 30% Huberman (mechanism), 30% James Clear (identity), 10% oqsoqol (Uzbek warmth)
- Ta'qiqlangan: shame, "you should", empty affirmations
- Ruxsat: aniq savol, kognitiv qayta shakllantirish (CBT), mikro-topshiriq

**Xotira (RAG-lite):**
- Har suhbatdan keyin `mentor_memory` jadvaliga structured summary:
  - `goals` (aniq, o'lchanadigan)
  - `failures` (qachon nega toyilgan)
  - `patterns` (emotional trigger)
  - `wins` (streak, milestone)
- Har yangi suhbat boshida top-K memory kontekstga inject
- Server function `writeMemory` va `loadMemory` — Gemini bilan summarize

**UI:**
- "Nadir sizni biladi" strip — 3-4 fakt ko'rsatiladi ("21 kun streak, sabab #1: kechqurun telefon")
- Har javobga tegishli xotira chip (transparency, trust)
- Mentor tinch, hech qachon "!" bilan tugatmaydi

---

## To'lqin 4 — Retention: XP / Level / Season / Unlock

**Maqsad:** Duolingo/Chess.com darajasidagi qaytish tsikllari, o'yinga aylantirmasdan.

**Mexanikalar (kod):**
- XP allaqachon bor — kengaytiriladi: mikro (5 XP), o'rta (25), catharsis (100 milestone)
- **Levels:** 1-100 sqrt curve (bor) — nomlar qo'shiladi: Novice → Seeker → Disciplined → Steel → Master (evolutionary rank, Diener)
- **Streak Shield:** bor
- **Seasons (yangi):** har 90 kun (bir kvartal). Har sezon oxirida ranking snapshot + limited badge. Cheklangan vaqt = shoshilinch (scarcity)
- **Weekly challenge (yangi):** dushanba–yakshanba, bitta aniq: "5 kun screen time <3s" — qo'shilish variantli, majburiy emas
- **Unlockables:** avatar ramka, dashboard theme, quote pack — level bilan ochiladi (endowment effect)
- **Milestone celebrations:** 3/7/21/66/100 kun (bor) — sezon jamlanmasi bilan bog'lanadi

**Backend:**
- `seasons` jadvali (index, start_at, end_at, title)
- `season_progress` (user_id, season_id, xp_in_season, rank)
- `weekly_challenges` + `weekly_challenge_participants`
- `unlocks` (user_id, unlock_key, unlocked_at)

**Anti-addiction guardrail:**
- Kunlik "yetarli" ekrani — 30 XP dan keyin "Bugungi ish bajarildi. Yakunlash tavsiya etiladi." (Cal Newport digital minimalism — o'zi ilova ham dopamin loop emas)

---

## Technical section

**Migrations (4 ta, to'lqin bo'yicha):**
1. `assessment_responses`, `assessment_scores`, `roadmap_stages`
2. — (landing to'liq frontend)
3. `mentor_memory` (user_id, kind, key, value jsonb, created_at)
4. `seasons`, `season_progress`, `weekly_challenges`, `weekly_challenge_participants`, `unlocks`

**Server functions:**
- `src/lib/assessment.functions.ts` — submit, computeScores, generateRoadmap
- `src/lib/mentor-memory.functions.ts` — write/load, summarize via Gemini
- `src/lib/seasons.functions.ts` — currentSeason, leaderboard, joinChallenge

**Routes (yangi/o'zgartirilgan):**
- `_authenticated/onboarding.tsx` — 9-blok assessment (mavjud onboarding kengaytiriladi)
- `_authenticated/roadmap.tsx` — yangi, 3-bosqichli
- `_authenticated/dashboard.tsx` — 4 ta score ring + weekly challenge card
- `_authenticated/mentor.tsx` — memory strip + shaxsiyat
- `_authenticated/season.tsx` — yangi, sezon ranking + unlocks
- `index.tsx` — 9-bo'lim struktura

**Test:** har to'lqindan keyin build clean + Playwright smoke (auth → tanlangan flow).

---

## Bajarilish tartibi

Reja to'lqin **1 → 2 → 3 → 4**. Har to'lqin boshida sizga qisqa xabar; har biri to'liq shippable — istagan joyingizda to'xtatishingiz mumkin.

**Boshlaymanmi 1-to'lqindan (Onboarding + Human Potential Score)?**