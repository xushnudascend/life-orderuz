import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { uz } from "@/i18n";

type NavLink = { href: string; label: string };

const DEFAULT_NAV: NavLink[] = [
  { href: "/#science", label: "Ilm" },
  { href: "/pricing", label: "Narx" },
  { href: "/blog", label: "Blog" },
  { href: "/investors", label: "Investorlar" },
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
    <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="grid h-7 w-7 place-items-center rounded-[10px] bg-primary text-primary-foreground shadow-[0_0_18px_hsl(var(--primary)/0.35)]"
          >
            <span className="font-serif text-[15px] font-semibold leading-none">L</span>
          </span>
          <span className="font-serif text-[17px] font-bold tracking-tight">
            {uz.brand.name}
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex font-ui text-[13px] text-muted-foreground">
          {nav.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <Button asChild size="sm" className="rounded-full font-ui font-semibold">
          <Link to={cta.to}>{cta.label}</Link>
        </Button>
      </div>
    </header>
  );
}
