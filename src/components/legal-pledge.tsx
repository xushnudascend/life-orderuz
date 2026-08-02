/**
 * FounderPledge — "biz X qilamiz / qilmaymiz" bloki + founder imzosi.
 * Parasocial trust (Horton & Wohl, 1956) + commitment cue (Cialdini).
 */
export function FounderPledge({ will, wont }: { will: string[]; wont: string[] }) {
  return (
    <section className="mt-10 rounded-[var(--radius)] border border-border bg-card p-6">
      <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
        Ochiq va'da
      </p>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div>
          <p className="font-serif text-lg">Biz qilamiz</p>
          <ul className="mt-3 space-y-2 font-ui text-sm">
            {will.map((it) => (
              <li key={it} className="flex items-start gap-2">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-serif text-lg">Biz qilmaymiz</p>
          <ul className="mt-3 space-y-2 font-ui text-sm">
            {wont.map((it) => (
              <li key={it} className="flex items-start gap-2">
                <span
                  aria-hidden
                  className="mt-1.5 h-1.5 w-3 shrink-0 rounded-full border border-border"
                />
                <span className="text-muted-foreground">{it}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-serif text-sm text-primary">
          LO
        </span>
        <div>
          <p className="font-serif text-sm">Life Order jamoasi · Toshkent</p>
          <p className="font-ui text-[11px] text-muted-foreground">
            Bu va'daga qo'l qo'yamiz. Buzsak — hisobingizni bir bosishda olib chiqasiz.
          </p>
        </div>
      </div>
    </section>
  );
}
