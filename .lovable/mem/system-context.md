---
name: Life Order System Context
description: The master architectural, design, and behavioral science guidelines for the Life Order product.
type: feature
---
# Life Order System Context

This document is the source of truth for all Life Order development. 

## Core Behavioral Science Constitution
1. **Fogg Behavior Model (B=MAP)**: Simplify actions (tiny habits) when motivation is low.
2. **Hook Model**: Under 3 taps for habit logging; reward earned, not mechanical.
3. **Self-Determination Theory**: Protect Autonomy, Competence, and Relatedness.
4. **Zeigarnik Effect**: Use progress rings and "1 step left" framing.
5. **Implementation Intentions**: End goals with "If [trigger], then I will [action] at [time/place]".
6. **Stages of Change**: Adapt copy/tone based on user readiness.
7. **Loss Aversion**: Defensive, not offensive. Forgiving streaks by default.
8. **Circadian Physiology**: Notifications respect sleep cycles (cortisol awakening/melatonin suppression).
9. **Cognitive Load (Hick's/Miller's Law)**: Max 5 primary actions per screen, max 7 nav items.
10. **WCAG 2.2 AA**: Contrast, keyboard navigation, screen-reader labels, reduced-motion.
11. **Notification Budget**: Max 2 proactive/day (Push + Telegram combined).
12. **Relational Friction**: Escalate from passive (breathing) to reflective (Nadir's prompt).

## Architecture
- **Stack**: TanStack Start (React 19), Supabase, Obsidian Design System.
- **Design**: "Obsidian" (deep black + neon chartreuse), archetype hue-shifting, consistent modular scale (1.25).
- **Security**: RLS mandatory on every table (write table + RLS together), Admin-only RPCs via `has_role`, no silent catch blocks.
- **Testing**: Vitest + Testing Library + vitest-axe. 100% coverage on scoring/money/scoring logic.
- **Localization**: Uzbek primary; RU/EN variants required for Telegram and critical UI.
