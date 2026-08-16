# Rebuild Plan: Premium Marketplace Landing & Auth UI

Upgrade the landing page and auth flow to a high-conversion, marketplace-style "Premium OS" experience.

## Landing Page Overhaul (`src/routes/index.tsx`)
- **Header Update**: Move "Sign In" and "Sign Up" to the top-right corner.
- **Hero Transformation**: 
  - Add a "Social Proof" counter (e.g., "10,000+ users").
  - Centralize a "Start Trial" or "Diagnose" action while keeping "Pricing" visible.
- **Marketplace Visuals**: Integrate "Gold Standard" bento grids showing real app screens (Habits, Nadir AI, Biorythms).
- **Pricing Visibility**: Add a dedicated pricing overview section directly on the landing page (not just a separate route).
- **Behavioral Anchoring**: Use "Pain vs Gain" messaging (Motivatsiya tugaydi, tizim qoladi).

## Navigation & Auth UI (`src/components/site-header.tsx`, `src/routes/auth.tsx`)
- **Header**: Restructure navigation to prioritize conversion (Auth buttons on right).
- **Auth Page**: Premium glassmorphism UI with a focus on "Joining the Elite System" rather than just "Signing up".

## Technical Implementation Details
- **Localization**: Ensure all new strings use `t()` from `src/i18n`.
- **Performance**: Use `Reveal` components for high-end scroll animations.
- **Consistency**: Enforce Deep Teal and Gold palette globally.

## User-facing summary
Landing sahifasi va kirish tizimi dunyo bo'ylab eng muvaffaqiyatli marketplace saytlari darajasiga ko'tariladi.
- Tepada o'ngda "Kirish/Ro'yxatdan o'tish" tugmalari.
- Hero qismida 10,000+ foydalanuvchi ishonchi va "Motivatsiya tugaydi, tizim qoladi" shiori.
- Narxlar va tizim imkoniyatlari landingning o'zidayoq yaqqol ko'rinib turadi.
- Dizayn: Deep Teal va Oltin ranglardagi premium "Apple-style" interfeys.
