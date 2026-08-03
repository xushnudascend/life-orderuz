import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { uz } from "@/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";

type NavLink = { href: string; label: string };

const DEFAULT_NAV: NavLink[] = [
  { href: "/#science", label: "Ilm" },
  { href: "/pricing", label: "Narx" },
  { href: "/blog", label: "Blog" },

  { href: "/#faq", label: "Savollar" },
];

export function SiteHeader({
  nav = DEFAULT_NAV,
  cta = { label: "Boshlash", to: "/auth" },
}: {
  nav?: NavLink[];
  cta?: { label: string; to: string };
}) {
  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border/70 bg-background/75 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      {/* amber hairline — subtle authority signal */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-5">
        <Link to="/" className="group flex items-center gap-2.5">
          <span
            aria-hidden
            className="grid h-7 w-7 place-items-center rounded-[10px] bg-primary text-primary-foreground shadow-[0_0_18px_hsl(var(--primary)/0.35)] transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[0_0_24px_hsl(var(--primary)/0.55)]"
          >
            <span className="font-serif text-[15px] font-semibold leading-none">L</span>
          </span>
          <span className="font-serif text-[17px] font-bold tracking-tight">{uz.brand.name}</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex font-ui text-[13px] text-muted-foreground">
          {nav.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative transition-colors hover:text-foreground"
            >
              {l.label}
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
              />
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <Button
            asChild
            size="sm"
            className="group rounded-full font-ui font-semibold shadow-[0_0_0_1px_hsl(var(--primary)/0.4),0_8px_24px_-12px_hsl(var(--primary)/0.55)] transition-shadow hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.6),0_12px_32px_-10px_hsl(var(--primary)/0.75)]"
          >
            <Link to={cta.to}>
              {cta.label}
              <span aria-hidden className="cta-arrow ml-1 inline-block">
                →
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
