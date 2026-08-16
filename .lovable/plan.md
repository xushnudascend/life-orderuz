# Landing Page Optimization Plan — Life Order

This plan outlines a comprehensive redesign of the landing page to improve clarity, conversion, and professional appeal while maintaining the core "Life Order" identity (Karla font, dark theme, "Discipline remains").

## Primary Objectives
- **Understandability**: Communicating the value proposition in 5 seconds.
- **Conversion**: Optimizing CTAs and hierarchy for sign-ups.
- **Modern UI**: Using a consistent design system (Golden Ratio spacing, premium dark surfaces).
- **Mobile-First**: Ensuring a seamless experience across all devices.

## Proposed Changes

### 1. Hero Section Overhaul
- **Headline**: Clear, transformation-focused ("Motivatsiya tugaydi, tizim qoladi").
- **Sub-headline**: Problem-focused (From chaos to three daily steps).
- **Primary CTA**: "Tashxisdan o'tish" (Take the assessment) as the dominant action.
- **Visuals**: A realistic preview of the "Self-Control OS" dashboard instead of static gradients.

### 2. Problem & Solution Mechanics
- **Problem Section**: Adding a specific section identifying common user struggles (starting/quitting cycle).
- **Product Mechanism**: Explaining the "Understand → Diagnose → Act" loop clearly.
- **Differentiation**: A concise section explaining why this isn't just another habit tracker (AI Mentor integration).

### 3. Visual Design System
- **Consistency**: Standardizing border radii (32px), shadows (Obsidian), and spacing (80px/120px section gaps).
- **Hierarchy**: Using typographic scale to guide the eye to the most important information.
- **Accessibility**: Ensuring all text meets WCAG AA contrast standards.

### 4. Technical Refinement
- **Responsive Audit**: Fixing font sizes and container padding for mobile (320px-430px).
- **SEO/Metadata**: Enhancing Open Graph tags and JSON-LD for better social sharing and search indexing.
- **i18n Consistency**: Syncing new copy across English, Russian, and Uzbek translations.

## Technical Details
- **Framework**: TanStack Start v1 / React 19.
- **Styling**: Tailwind CSS v4 (@theme variables).
- **Components**: Framer Motion (subtle reveals), Lucide icons.
- **Architecture**: Separating landing sections into clean functional components in `src/routes/index.tsx`.
