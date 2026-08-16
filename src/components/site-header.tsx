import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/use-t";
import { LanguageSwitcher } from "@/components/language-switcher";

type NavLink = { href: string; label: string };

const DEFAULT_NAV: NavLink[] = [
  { href: "/#features", label: "Imkoniyatlar" },
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
  const { t } = useT();
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border/70 bg-background/80 backdrop-blur-xl">
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
          <span className="font-serif text-[17px] font-bold tracking-tight">{t("brand.name")}</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex font-ui text-[13px] text-muted-foreground">
          {nav.map((l) => (
            <Link
              key={l.href}
              to={l.href.startsWith("/#") ? "/" : (l.href as any)}
              hash={l.href.startsWith("/#") ? l.href.slice(2) : undefined}
              className="group relative transition-colors hover:text-foreground"
            >
              {l.label}
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
              />
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <Link 
            to="/auth" 
            className="hidden sm:block font-ui text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("auth.signIn")}
          </Link>
          <Button
            asChild
            size="sm"
            className="group rounded-full px-4 font-ui font-bold shadow-premium transition-all hover:scale-105 active:scale-[0.98] text-[12px] h-8"
          >
            <Link to="/auth" search={{ mode: "signup" }}>
              {t("auth.signUp")}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
