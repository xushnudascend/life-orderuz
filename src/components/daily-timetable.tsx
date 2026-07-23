import { useEffect, useMemo, useState } from "react";

/**
 * Kunlik jadval — foydalanuvchining profili (yosh, jins, vazn/bo'y, arxetip)
 * asosida shaxsiylashtirilgan bloklar. Chronobiologiya (Roenneberg MCTQ),
 * ACSM sport tavsiyalari va Fogg BMAP tamoyillari asosida.
 */
type Tone = "peak" | "steady" | "micro" | "rest";
type Block = {
  from: number;
  to: number;
  label: string;
  hint: string;
  tone: Tone;
};

export type TimetableProfile = {
  age?: number | null;
  sex?: string | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  archetype?: string | null;
};

function bmi(p: TimetableProfile): number | null {
  if (!p.height_cm || !p.weight_kg) return null;
  const m = p.height_cm / 100;
  return p.weight_kg / (m * m);
}

/**
 * Chronotype hint: yoshga qarab peak vaqti (Roenneberg 2007).
 * <25: kechki, 25-45: neytral, >45: erta.
 */
function chronoShift(age: number | null | undefined): number {
  if (!age) return 0;
  if (age < 25) return 1; // 1 soat kechroq
  if (age > 45) return -1; // 1 soat erta
  return 0;
}

function buildBlocks(p: TimetableProfile): Block[] {
  const shift = chronoShift(p.age);
  const b = bmi(p);
  const isMale = (p.sex || "").toLowerCase().startsWith("m") || p.sex === "erkak";
  const arch = (p.archetype || "").toLowerCase();

  // Ertalabki blok: sport tavsiyasi vazn/BMI ga bog'liq
  const morningLabel =
    b && b >= 25
      ? "10 daqiqa yurish + suv"
      : b && b < 18.5
      ? "Nonushta + oqsil"
      : isMale
      ? "5 daqiqa mobilizatsiya"
      : "5 daqiqa cho'zilish";

  // Peak vaqti — kognitiv zo'r ish
  const peakLabel =
    arch.includes("achiever") || arch.includes("scholar")
      ? "Chuqur ish — eng qiyin vazifa"
      : arch.includes("creator")
      ? "Ijodiy blok — telefon off"
      : "Bir vazifaga fokus (25 min)";

  // Kunduzgi
  const midLabel = arch.includes("connector")
    ? "Aloqa va javoblar"
    : "Reja tekshir · qisqa yurish";

  // Kechki mikro-qadam
  const eveningLabel =
    (p.age && p.age > 40)
      ? "Yengil cho'zilish + kundalik"
      : "Bugungi 3-qadam · streak";

  const nightLabel = "Ekran off · nafas · uyquga tayyorlik";

  return [
    {
      from: 6 + shift,
      to: 8 + shift,
      label: `Uyg'onish — ${morningLabel}`,
      hint: "Cortizol tabiiy peak. Yorug'lik va suv.",
      tone: "peak" as Tone,
    },
    {
      from: 9 + shift,
      to: 12 + shift,
      label: peakLabel,
      hint: "Kognitiv peak. Chalg'itmalar off.",
      tone: "peak",
    },
    {
      from: 12 + shift,
      to: 14 + shift,
      label: "Ovqat + 10 daqiqa yurish",
      hint: "Qon shakarini stabilashtir.",
      tone: "steady",
    },
    {
      from: 14 + shift,
      to: 17 + shift,
      label: midLabel,
      hint: "Post-lunch dip — engil vazifa.",
      tone: "steady",
    },
    {
      from: 17 + shift,
      to: 20 + shift,
      label: isMale && (!p.age || p.age < 45) ? "Sport / harakat (30 min)" : "Yurish (20-30 min)",
      hint: "Tana harorati peak — mushak samarasi.",
      tone: "peak",
    },
    {
      from: 20 + shift,
      to: 22 + shift,
      label: eveningLabel,
      hint: "Kichik g'alaba streakni saqlaydi.",
      tone: "micro",
    },
    {
      from: 22 + shift,
      to: 24,
      label: nightLabel,
      hint: "Melatonin uchun qorong'ilik.",
      tone: "rest" as Tone,
    },
  ].map((x) => ({ ...x, from: Math.max(0, Math.min(23, x.from)), to: Math.max(1, Math.min(24, x.to)) }));
}

export function DailyTimetable({ profile }: { profile?: TimetableProfile }) {
  const [hour, setHour] = useState<number>(() => new Date().getHours());
  useEffect(() => {
    const t = setInterval(() => setHour(new Date().getHours()), 60_000);
    return () => clearInterval(t);
  }, []);

  const blocks = useMemo(() => buildBlocks(profile ?? {}), [profile]);
  const personalized = !!(profile && (profile.age || profile.archetype));

  return (
    <div className="rounded-[var(--radius)] border border-border p-5">
      <div className="flex items-center justify-between">
        <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Kunlik jadval
        </p>
        {personalized && (
          <span className="font-ui text-[10px] uppercase tracking-[0.2em] text-primary">
            Senga moslashgan
          </span>
        )}
      </div>
      <ul className="mt-3 space-y-2 font-ui text-sm">
        {blocks.map((b) => {
          const active = hour >= b.from && hour < b.to;
          return (
            <li
              key={`${b.from}-${b.to}`}
              className={
                "border-b border-border/60 pb-2 last:border-none last:pb-0 " +
                (active ? "text-foreground" : "text-muted-foreground/80")
              }
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 tabular-nums">
                  {active && (
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                  )}
                  {String(b.from).padStart(2, "0")}:00–{String(b.to).padStart(2, "0")}:00
                </span>
                <span className={"text-right " + (active ? "text-foreground" : "")}>{b.label}</span>
              </div>
              {active && (
                <p className="mt-1 text-[11px] text-muted-foreground">{b.hint}</p>
              )}
            </li>
          );
        })}
      </ul>
      {!personalized && (
        <p className="mt-3 font-ui text-[11px] text-muted-foreground/80">
          Onboardingni tugatgach — jadval sen uchun moslashadi.
        </p>
      )}
    </div>
  );
}
