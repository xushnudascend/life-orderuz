import { useEffect, useState } from "react";

/**
 * Kunlik jadval (sirkadian jadvalga bog'langan). Hozirgi vaqt bo'yicha aktiv
 * blok belgilanadi (sariq nuqta + kuchli matn).
 */
type Block = { from: number; to: number; label: string; hint: string; tone: "peak" | "steady" | "micro" };
const BLOCKS: Block[] = [
  { from: 5, to: 9, label: "Peak — eng qiyin ish", hint: "Eng qiyin vazifadan boshla", tone: "peak" },
  { from: 9, to: 12, label: "Peak — chuqur fokus", hint: "Chuqur ish oynasi", tone: "peak" },
  { from: 12, to: 15, label: "Steady — reja tekshir", hint: "Sur'atni ushla", tone: "steady" },
  { from: 15, to: 18, label: "Steady — yengil vazifa", hint: "Yopilgan ishlarni yakunla", tone: "steady" },
  { from: 18, to: 22, label: "Micro — 2 daqiqa qadam", hint: "Streakni saqla", tone: "micro" },
  { from: 22, to: 24, label: "Micro — dam olishga tayyorlan", hint: "Ekranni yop", tone: "micro" },
];

export function DailyTimetable() {
  const [hour, setHour] = useState<number>(() => new Date().getHours());
  useEffect(() => {
    const t = setInterval(() => setHour(new Date().getHours()), 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="rounded-[var(--radius)] border border-border p-5">
      <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        Kunlik jadval
      </p>
      <ul className="mt-3 space-y-2 font-ui text-sm">
        {BLOCKS.map((b) => {
          const active = hour >= b.from && hour < b.to;
          return (
            <li
              key={`${b.from}-${b.to}`}
              className={
                "flex items-center justify-between border-b border-border/60 pb-1.5 last:border-none last:pb-0 " +
                (active ? "text-foreground" : "text-muted-foreground/80")
              }
            >
              <span className="flex items-center gap-2 tabular-nums">
                {active && (
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                )}
                {String(b.from).padStart(2, "0")}:00–{String(b.to).padStart(2, "0")}:00
              </span>
              <span className={active ? "text-foreground" : ""}>{b.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
