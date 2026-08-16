# ASCEND 3.0: Premium Polish & Functional Clarity

The goal is to eliminate UX friction, refine UI aesthetics, and improve content clarity for the landing page.

## Design Updates
- Replace "Karla" with "Instrument Serif" (Headings) and "Inter" (UI/Body) for a premium, high-contrast look.
- Refine the Deep Navy/Gold palette: use more subtle gradients and clearer depth markers.
- Standardize all radii to `32px` (Obsidian style) and increase whitespace between sections.
- Add a "Trust Layer": replace generic social proof with verified beta stats and real-world behavioral science anchors.

## UX & Content Polish
- **Hero Section**: Clearer value proposition ("Self-Control OS" focus). Simplify the Split-Title effect for better readability.
- **Features**: Group by "Diagnosis", "Practice", "AI Mentorship". Use clearer icon metaphors.
- **How It Works**: Rebuild as a cohesive timeline/protocol.
- **Pricing**: Add a toggle for Monthly vs Yearly (30% discount). Clarify "Halol Narxlar" (Fair Pricing) values.
- **FAQ**: Improve question phrasing for modern users.

## Functional Fixes
- Fix navigation hash scrolling (offset for sticky header).
- Ensure all CTA tracking events are reliable.
- Improve accessibility (ARIA labels, focus states).
- Resolve any text overflows or weird alignments on small screens.

## Technical Tasks
- Update `src/styles.css` with new typography and refined tokens.
- Update `src/i18n/uz.ts` with polished copy.
- Refactor `src/routes/index.tsx` for layout consistency.
- Implement `PricingToggle` component.
