# Landing Page Audit and Polish Plan

Address honesty, consistency, and accessibility issues on the landing page, aligning with the ASCEND 2.0 standards and the project constitution.

## Honesty & Social Proof
- Remove fabricated "12,400+" user count and placeholder avatars from the Hero section.
- Replace with an honest "Beta 2.0 · Early Access" positioning.
- Use the existing `archetypePeers` function (or a new public variant if needed) to show real, live user statistics instead of static fake numbers.

## Pricing Consistency
- Refactor `PricingSection` in `src/routes/index.tsx` to use `i18n` keys (`t("pricing.free.features")`, etc.) instead of hardcoded content.
- Align the landing page pricing details byte-for-byte with the `/pricing` route and `src/lib/limits.ts`.
- Clarify CTA matni: remove the misleading "7-day free trial" if it's not technically implemented in the backend, focusing on a clear "Get Pro" instead.

## Navigation & SPA Polish
- Replace all remaining `<a href="...">` internal links in `SiteHeader` and `SiteFooter` with TanStack Router `<Link to="...">` to prevent full page reloads.
- Fix the duplicate "Narxlar" link in `SiteFooter`.

## Visual & Accessibility Hardening
- Remove the `animate-orb-float` background effects as per previous rebuild plans, replacing them with subtle, static radial gradients.
- Increase text contrast: replace low-opacity utilities (like `/60`, `/70`) with higher opacity (min 85%) or dedicated semantic tokens to meet WCAG AA standards.
- Add `aria-hidden="true"` to decorative elements.

## Content & FAQ
- Replace the "composed" dynamic FAQ with a set of 6+ hand-written, meaningful questions in `uz.ts`, `ru.ts`, and `en.ts`.
- Enhance "Trust Badges" with scientific basis labels (e.g., "Fogg Behavior Model") instead of generic marketing terms.

## Technical Details
- Files modified: `src/routes/index.tsx`, `src/components/site-header.tsx`, `src/components/site-footer.tsx`, `src/i18n/uz.ts`, `src/i18n/ru.ts`, `src/i18n/en.ts`.
- Ensure `archetypePeers` is used to drive the `SocialMirror` component honestly.
- Verify color contrast ratios for dark backgrounds.
