import { Link } from "@tanstack/react-router";
import { useT } from "@/i18n/use-t";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Mahsulot",
    links: [
      { href: "/", label: "Bosh sahifa" },
      { href: "/pricing", label: "Narxlar" },
      { href: "/pricing", label: "Narxlar" },
      { href: "/#faq", label: "Savollar" },
    ],
  },
  {
    title: "Kompaniya",
    links: [
      { href: "/blog/hayot-sohalari", label: "Blog" },
      { href: "/security", label: "Xavfsizlik" },
    ],
  },
  {
    title: "Huquqiy",
    links: [
      { href: "/terms", label: "Foydalanish shartlari" },
      { href: "/privacy", label: "Maxfiylik" },
      { href: "/refund", label: "To'lov qaytarish" },
    ],
  },
];

export function SiteFooter() {
  const { t } = useT();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="grid h-8 w-8 place-items-center rounded-[10px] bg-primary text-primary-foreground"
              >
                <span className="font-serif text-base font-semibold leading-none">L</span>
              </span>
              <span className="font-serif text-lg font-bold tracking-tight">{t("brand.name")}</span>
            </Link>
            <p className="mt-4 max-w-[240px] font-ui text-[13px] leading-relaxed text-muted-foreground">
              {t("brand.tagline")} — {t("footer.tagline")}
            </p>
            <p className="mt-4 font-ui text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Toshkent · O'zbekiston
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-primary">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5 font-ui text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 font-ui text-xs text-muted-foreground">
          <p>
            © {year} {uz.brand.name}. Barcha huquqlar himoyalangan.
          </p>
          <p className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_hsl(var(--success)/0.6)]"
            />
            Beta · v0.9 · 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
