# Plan: Landing Page Cleanup & Clarity Optimization

I will reorganize the landing page into a logical, high-conversion narrative by removing redundancy, simplifying the hero, and focusing on the core problem/solution loop based on the "Life Order Constitution".

## Information Architecture Rebuild

### 1. Simplified Hero
- **Headline**: "Motivatsiya tugaydi, tizim qoladi." (Keep branding strong).
- **Sub-headline**: Concise explanation: What it is (Self-Control OS), who it's for, and the main outcome.
- **CTA**: Single primary action ("Tashxisdan o'tish").
- **Visual**: Keep the existing "Self-Control OS" visualization but ensure it communicates functionality.

### 2. The Problem
- Focus on recognizable failure modes: willpower depletion, lack of plan, invisible progress.
- Move from generic text to relatable "recognize yourself" situations.

### 3. The Solution & Mechanism
- Merge "Features" and "Mechanism" into a cohesive "How it works" flow.
- Process: **Diagnose (Tashxis)** -> **Act (Protokol)** -> **Adapt (Nadir AI)**.

### 4. Product Visualization
- Show the REAL dashboard preview (already exists in the code but needs to be prioritized).
- Focus on the 66-day automation journey and AI mentor interaction.

### 5. Why It's Different
- Contrast "Life Order" against generic habit trackers (Forgiving Discipline, Biorhythm sync).

### 6. FAQ & Final CTA
- Condense FAQ to high-objection questions.
- Single final reinforcing CTA.

## Technical Tasks

### Content & i18n
- Update `src/i18n/uz.ts`, `en.ts`, and `ru.ts` with restructured landing keys.
- Remove redundant descriptions and buzzwords.

### Component Refactoring
- Modify `src/routes/index.tsx` to follow the new 8-section sequence.
- Remove `MechanismSection` if redundant with `Features`.
- Standardize radii (32px), shadows (Obsidian), and spacing (standard padding/gaps).
- Ensure mobile-first layout with no overflow.

### Navigation
- Simplify `src/components/site-header.tsx` to: Logo | Qanday ishlaydi | Savollar | Boshlash.

## Verification Plan

### Automated Checks
- Run a Playwright scan to ensure:
    - No broken links (fix remaining blog redirects).
    - Mobile responsiveness (no horizontal scroll).
    - ARIA attributes for accessibility.
    - Performance (lazy loading images/visuals).

### Manual Review
- Simulate a 5-10 second first-time visitor test.
- Check visual hierarchy: Headline > Subhead > Visual > CTA.
