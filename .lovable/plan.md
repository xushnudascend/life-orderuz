# Rebuild & Stability Plan — Life Order

Ijtimoiy-psixologik tizimning barqarorligini ta'minlash va "Sahifa yuklanmadi" kabi kritik xatolarni butkul bartaraf etish.

## 1. Stability (Hydration & Locale Guards)
TanStack Router SSR rejimida `useT()` hooki hidratatsiyadan oldin `undefined` qaytarishi mumkin. Bu React komponentlarining qulashiga sabab bo'ladi.
- `src/routes/_authenticated/dashboard.tsx` ga `if (!t) return null` guard qo'shish.
- `src/routes/_authenticated/habits.tsx` ga `if (!t) return null` guard qo'shish (i18n ishlatilmasa ham, kelajak uchun xavfsizlik).
- `src/routes/_authenticated/journal.tsx` va `hub.tsx` ga xuddi shunday xavfsizlik choralarini qo'shish.

## 2. i18n Optimization (Hardcoded Texts)
Tizimdagi o'zbek tilidagi qattiq yozilgan (hardcoded) matnlarni dinamik va xavfsiz qilish.
- `pricing.tsx` va `limits.ts` dagi matnlarni `i18n` lug'atlariga o'tkazish.
- `auth.tsx` dagi xatolik xabarlarini to'liq i18n orqali boshqarish (Landing Page fixi kabi).

## 3. UI/UX Polishing
Audit natijasida topilgan mayda vizual nuqsonlarni tuzatish.
- `onboarding.tsx`: "SocialMirror" va "FirstTaskCard" komponentlarini alohida fayllarga chiqarish yoki inline rejimda i18n ni to'g'rilash (hozirda hardcoded o'zbekcha).
- `profile.tsx`: "Shield" ishlatishdagi xatolik xabarlarini i18n ga o'tkazish.

## 4. Onboarding Improvement
- Onboarding savollarini (src/lib/onboarding.ts) i18n lug'atiga bog'lash, shunda foydalanuvchi tilni o'zgartirganda savollar ham o'zgaradi.
- Onboarding oxiridagi AI "Aha!" nudgesini tillar bo'yicha to'g'ri qaytarishini ta'minlash.

## Texnik o'zgarishlar
- `src/i18n/uz.ts`, `ru.ts`, `en.ts` ga yangi kalitlar qo'shiladi.
- `src/routes/` ostidagi barcha asosiy komponentlar hidratatsiya holatini tekshiradigan bo'ladi.
