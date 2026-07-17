# UI Rebuild — Obsidian Green, Dashboard, Max Density

## Visual system

- **Palette**: chuqur qora asos + terminal yashil aksent
  - `--background: 150 8% 4%` (deep charcoal-green)
  - `--card: 150 8% 6%` / `--muted: 150 6% 10%`
  - `--border: 150 8% 14%`
  - `--primary: 142 76% 45%` (rich green, not neon)
  - `--primary-glow: 142 90% 55%`
  - `--foreground: 150 6% 92%`
- **Fonts**: Sora (headings, UI), Manrope (body) — Google Fonts orqali `__root.tsx`da
- **Radius**: `0.5rem` (dashboard uslubi — kichikroq, aniqroq)
- **Density**: tight paddings (`p-3`/`p-4`), `text-sm` default, ko'proq ma'lumot ko'rinadi

## Layout: Dashboard shell

Yangi `AppShell` (autentifikatsiyalangan sahifalar uchun):

```text
+-------------------------------------------+
| Topbar: brand · breadcrumb · search · me  |  56px sticky
+---------+---------------------------------+
| Sidebar | Main content                    |
| 220px   |                                 |
| Bosh    |   dense grid, panels            |
| Tana    |                                 |
| Odatlar |                                 |
| Nadir   |                                 |
| ...     |                                 |
+---------+---------------------------------+
```

- Desktop: sticky sidebar (220px), scrollable main
- Tablet: collapsible sidebar (icon-only 64px)
- Mobile: sidebar → bottom-nav (mavjud, polish)

## Dashboard sahifasi — max density

12-column grid, information-rich panels:

```text
+------ Hero strip (streak · level · XP · shields · rank) ------+
+----- Progress ring --+-- Today's habits (compact list) -------+
+--- Weekly chart -----+-- Circadian timetable (now indicator) -+
+--- Quests (3 up) ----+-- Journal preview --+-- AI insight ----+
+--- Quick actions grid: workout / diet / quests / mentor ------+
```

- Har bir panel: `border`, `bg-card`, `p-4`, eyebrow (uppercase 11px), value (2xl), micro-caption
- Habit item — 1 qatorda: checkbox · nom · +XP · tick action

## Global UX polish (barcha sahifalar)

- Topbar sticky + backdrop-blur, active route left-border yashil chiziq (sidebar)
- Kbd shortcut `⌘K` — search palette (yo'nalish, keyingi turda)
- Toast pozitsiya: top-center, kompakt
- Skeletonlar — full-screen spinner o'rniga
- Focus rings: yashil `--ring`
- Custom scrollbar
- `.tap` (44px) mobil, `.card-hover` interaktiv panellar

## Sahifalar (bir uslubda)

Barcha `_authenticated/*` sahifalari yangi `<PageHeader eyebrow title actions>` +
`<PanelGrid>` primitivlariga o'tadi. Landing (`/`) va `pricing` — yangi
palitra/font, lekin tuzilishi o'zgarmaydi (foydalanuvchi so'ramagan).

## Technical

- `src/styles.css`: yangi tokenlar, sidebar utility'lari
- `src/routes/__root.tsx`: Sora + Manrope link tag'lari, family metadata
- `src/components/app-shell.tsx`: to'liq qayta yozish (topbar + sidebar + main)
- `src/components/sidebar-nav.tsx`: yangi (desktop sidebar)
- `src/components/bottom-nav.tsx`: yashil primary bilan
- `src/components/page-header.tsx`: yangi umumiy sarlavha
- `src/components/panel.tsx`: yangi (eyebrow/title/value/caption bilan card)
- `src/routes/_authenticated/dashboard.tsx`: bento-grid qayta tartib
- Boshqa `_authenticated/*` sahifalari: `AppShell` yangi shell'ni oladi, ichki
  kontent shu turda o'zgartirilmaydi (keyingi turlarda alohida polish)

## Scope guardrails

- Ma'lumot va biznes-logika **o'zgarmaydi** — faqat visual va layout
- Landing/pricing — tokenlar yangilanadi, tuzilish saqlanadi
- Onboarding — polish, ammo qadamlar/sarlavhalar o'zgarmaydi
