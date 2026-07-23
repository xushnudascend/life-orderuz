# ASCEND — Psixologik chuqurlashtirish rejasi

Ilmiy asosda (QISM A) 4 bosqichli qayta qurish. Har bir bosqichdan keyin QISM A tamoyillari qayerda qo'llangani sanab beriladi. QISM B'dagi 8 band buzilmaydi, faqat kengaytiriladi. Vizual "Life Order" tili (QISM D) — libos, buzilmaydi.

---

## BOSQICH 1 — Nadir'ni yagona uzluksiz mentor qilish (eng katta o'zgarish)

Hozir Nadir 4 joyda alohida-alohida yashaydi (Dashboard, Body, Habits, HubAdvisor). Uni bitta doimiy oqimga birlashtiraman.

**Backend:**
- `nadir_threads` va `nadir_messages` jadvallari (RLS + GRANT). Har bir foydalanuvchining bitta faol "asosiy thread"i + eski xabar tarixi.
- `nadir_memories`'dagi profil + `peak_failure_time` + so'nggi 3 ta assessment score system-promptga avtomatik quyiladi.
- `src/routes/api/chat.ts`'ni AI SDK `streamText` + `toUIMessageStreamResponse({ onFinish })` bilan qayta yozaman — xabarlar `onFinish`'da saqlanadi.
- MI (OARS) elementi system-promptga qo'shiladi: "3 xabardan 1 tasida foydalanuvchini o'zi javob topishga yo'naltiruvchi ochiq savol ber". Brutal-halol persona saqlanadi.
- Topic cheklovi ("Refuse other topics") olib tashlanadi — Nadir umumiy hayotiy murabbiy bo'ladi, lekin kontekst-page moyilligi qoladi.

**Frontend:**
- Global `NadirFab` — istalgan sahifadan yagona chat drawer'ni ochadi. AI Elements (`Conversation`, `Message`, `MessageResponse`, `PromptInput`, `Shimmer`) bilan qurilgan.
- Sahifa kontekstini `openNadir({ contextHint })` orqali uzatish — bu system-promptga "foydalanuvchi hozir X sahifasida" satr sifatida qo'shiladi.
- Eski `AICoPilot`, `HubAdvisor`, `BodyHub`/`HabitsExtras` mini-chatlari FAB'ga ulanadi (o'z UI ochish tugmasi qoladi, lekin ostidagi thread bitta).
- `/_authenticated/mentor` sahifasi yagona thread'ning to'liq ko'rinishi.

**QISM A moslashuv:** A6 (MI + Working Alliance uzluksizligi), A7 (peak_failure_time real-time ishlatiladi), A4 (mavjud etik cheklovlar saqlanadi).

---

## BOSQICH 2 — Kunlik halqa: Dashboard, Odatlar, Streak/Himoya

**Dashboard:**
- "Bugun 2/5" — Zeigarnik chala-halqa (`ProgressRing` neytral-amber, hech qanday qizil/alarm).
- "Bugungi eng kuchli qadam" Peak-End kartochkasi kechqurun 20:00'dan keyin ochiladi — kichik animatsiya + XP tabrigi.
- Hick qonuni: dashboard'da faqat 3 asosiy CTA (Quest, Habit, Nadir), qolganlari "Ko'proq" ostiga.

**Odatlar formasi:**
- 2 ta yangi majburiy maydon: **"Qachon?"** (soat/signal) + **"Qayerda?"** (lokatsiya/kontekst).
- Kartochkada uch qism vizual: **Signal → Rutina → Mukofot** (Duhigg halqasi bir qarashda).
- Odat detalida "Bugun qiyinmi?" tugmasi — bosilsa avtomatik mikro-versiya (2 daqiqa) taklif etiladi.

**Streak/Himoya matn auditi:**
- "himoyang tugayapti" → "bugun bitta himoyang ishlatildi — xavfsizsan".
- Streak uzilganda: "sen muvaffaqiyatsizsan" → "naqsh sindi — bu ma'lumot. Ertaga qayta quramiz."
- `src/components/streak-at-risk.tsx`, `shield-indicator.tsx`, `streak-milestone.tsx` matnlari qayta yoziladi.

**Yangi foydalanuvchi (kun 1-5):** `daily_quests.difficulty` va `habits.xp_reward` ataylab pasaytirilib boshlanadi (Bandura self-efficacy).

**QISM A moslashuv:** A3 (Zeigarnik, Peak-End, Hick), A1 (Duhigg, if-then, 2-daqiqa), A2 (Bandura, Dweck til), A3 (loss aversion — xotirjam ohang).

---

## BOSQICH 3 — Ijtimoiy qatlam va bildirishnomalar

**Party:**
- Har kuni yagona "Bugun nima qilaman" ochiq va'da posti (Cialdini izchillik). A'zolar ko'radi.
- Reaksiyalar faqat qo'llab-quvvatlash: 🔥 💪 👏 ❤️ — qoralash/tanqid tugmalari yo'q.
- Solishtirish blokirovkasi: hech qanday "kim ko'proq" ko'rinmaydi guruh ichida.

**Leaderboard:**
- "Sen (o'ziga nisbatan progress)" va "Global top" — ikkalasi teng kenglikda, ikki panel yonma-yon. Global birinchi emas.

**Bildirishnomalar/nudge budgeti:**
- `notification_budget` jadvali: haftada max 5 push (default). Foydalanuvchi sozlay oladi (Avtonomiya).
- `motivational-nudge` mantig'i budjetni tekshiradi, oshib ketsa jimlik.

**QISM A moslashuv:** A5 (Cialdini + Festinger), A2 (Avtonomiya), A4 (o'z-anti-qaramlik etikasi).

---

## BOSQICH 4 — Pricing, Profile, Analytics, Content hublari

**Pricing:** Timer/countdown/"faqat bugun" YO'Q. Shaffof narx + 7 kun sinov. Etik izohli "Nima uchun bepul rejadan yaxshiroq?" bloki.

**Profile/Settings:** Har bir raqam yoniga kontekst: `47 XP → "+12% o'tgan haftaga nisbatan"`, streak → "o'rtachangdan +3 kun". Yalang'och raqam yo'q.

**Analytics/Weekly Report:**
- Hikoya-egri: **Peak kun** markazda kattaroq, **peak_failure_time** alohida "Tayyorgarlik zonasi" kartasida (ayblov emas, oldindan tayyorgarlik ohangi).
- Nadir'ga "shu peak_failure_time uchun reja tuz" tugmasi.

**Workout/Diet/Learn hublari:** if-then mikro-nusxa (`"Agar ertalab uyg'onsang → 1 stakan suv"` kabi) va "Bugun qiyin" mikro-tushirish tugmasi.

**QISM A moslashuv:** A4 (Pricing etikasi), A8 (kontekstli raqamlar + Pennebaker refleksiyasi), A7 (peak_failure_time ko'rinadi), A1 (if-then hamma joyda).

---

## Texnik tafsilotlar

- **Yangi jadvallar:** `nadir_threads`, `nadir_messages`, `notification_budget`. Har biri RLS + `GRANT`.
- **Yangi/o'zgaradigan fayllar:** `src/components/nadir-fab.tsx`, `src/components/nadir-chat-drawer.tsx`, `src/routes/api/chat.ts` (rewrite), `src/lib/nadir-context.tsx` (provider), `src/routes/_authenticated/mentor.tsx` (yagona thread), `src/components/daily-timetable.tsx` (Zeigarnik ring), `src/routes/_authenticated/habits.tsx` (Signal/Rutina/Mukofot + if-then form), streak/shield komponentlari, `src/routes/_authenticated/party.tsx`, `leaderboard.tsx`, `analytics.tsx`, `profile.tsx`, `pricing.tsx`, `src/routes/api/ai.weekly-report.ts`.
- **AI Elements o'rnatish:** `bunx ai-elements@latest add conversation message prompt-input shimmer` (agar hali yo'q bo'lsa).
- **Til:** Barcha yangi matnlar i18n (`t()`) orqali, uz/ru/en.
- **Backward compat:** eski `HubAdvisor`, `AICoPilot` komponentlari drawer-launcherga aylanadi, eski API'lar deprecate qilinadi lekin darhol o'chirilmaydi.

---

## Amalga oshirish tartibi

1. Migration: `nadir_threads` + `nadir_messages` + `notification_budget`.
2. Bosqich 1 (Nadir birlashtirish) — bitta katta iteratsiya, ohirida test.
3. Bosqich 2 → 3 → 4 ketma-ket.
4. Har bosqich oxirida QISM A tamoyillari checklisti.

Tasdiqlasangiz, Bosqich 1'dan boshlayman (avval migration).
