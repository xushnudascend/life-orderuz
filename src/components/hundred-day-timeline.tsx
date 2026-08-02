import { Panel, PanelHeader } from "@/components/panel";

/**
 * HundredDayTimeline — Lally (2010) + Duhigg + Dispenza.
 * 7 / 21 / 66 / 100 kunlik neyrobiologik bosqichlar egri chizig'i.
 * Har bosqichda miya nima qilayotgani qisqa yozilgan.
 */
const STAGES = [
  { day: 7, title: "Issinish", note: "Prefrontal yuklama · niyat" },
  { day: 21, title: "Bog'lanish", note: "Bazal ganglii izlanishi" },
  { day: 66, title: "Avtomatlashuv", note: "Miya energiya tejaydi (Lally, 2010)" },
  { day: 100, title: "Identitet", note: '"Men shunday odamman" (Clear)' },
];

export function HundredDayTimeline({ streakDays = 0 }: { streakDays?: number }) {
  const pct = Math.min(100, (streakDays / 100) * 100);
  return (
    <Panel className="p-5">
      <PanelHeader title="100 kun · neyrobiologik yo'l" eyebrow={`Sen: ${streakDays} kun`} />
      <div className="relative mt-5 h-2 rounded-full bg-primary/10">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary/70 to-primary"
          style={{ width: `${pct}%` }}
        />
        {STAGES.map((s) => {
          const passed = streakDays >= s.day;
          return (
            <div
              key={s.day}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${s.day}%` }}
            >
              <div
                className={
                  "h-3.5 w-3.5 rounded-full ring-2 " +
                  (passed ? "bg-primary ring-primary/30" : "bg-card ring-border")
                }
                aria-label={`${s.day} kun · ${s.title}`}
              />
            </div>
          );
        })}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STAGES.map((s) => {
          const passed = streakDays >= s.day;
          return (
            <li
              key={s.day}
              className={
                "rounded-[var(--radius)] border p-3 " +
                (passed ? "border-primary/50 bg-primary/5" : "border-border bg-card/40")
              }
            >
              <p className="font-ui text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {s.day} kun
              </p>
              <p className="mt-0.5 font-serif text-sm">{s.title}</p>
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{s.note}</p>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
