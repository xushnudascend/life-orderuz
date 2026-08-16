import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/use-t";
import { LanguageSwitcher } from "@/components/language-switcher";
import { track } from "@/lib/analytics";

type NavLink = { href: string; label: string };

const DEFAULT_NAV: NavLink[] = [
  { href: "/", label: "brand.home" },
  { href: "/#features", label: "brand.features" },
  { href: "/pricing", label: "brand.pricing" },
  { href: "/blog/hayot-sohalari", label: "brand.blog" },
  { href: "/#faq", label: "brand.faq" },
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
        <Link to="/" className="group flex items-center gap-2.5 outline-none">
          <span
            aria-hidden
            className="grid h-7 w-7 place-items-center rounded-[10px] bg-primary text-primary-foreground shadow-[0_0_18px_hsl(var(--primary)/0.35)] transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[0_0_24px_hsl(var(--primary)/0.55)] group-focus-visible:ring-2 group-focus-visible:ring-primary group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background"
          >
            <span className="font-serif text-[15px] font-semibold leading-none">L</span>
          </span>
          <span className="font-serif text-[17px] font-bold tracking-tight">{t("brand.name")}</span>
        </Link>
        <nav className="hidden items-center gap-10 md:flex font-ui text-[14px] font-medium text-muted-foreground">
          {nav.map((l) => (
            <Link
              key={l.href}
              to={l.href.startsWith("/#") ? "/" : (l.href as any)}
              hash={l.href.startsWith("/#") ? l.href.slice(2) : undefined}
              className="group relative transition-all hover:text-foreground hover:scale-105 active:scale-95"
            >
              {t(l.label as any)}
              <span
                aria-hidden
                className="absolute -bottom-1.5 left-0 h-[2px] w-full origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100"
              />
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <Link 
            to="/auth" 
            onClick={() => track("login_click")}
            className="hidden sm:block font-ui text-[12px] font-medium text-text-secondary hover:text-foreground transition-colors"
          >
            {t("auth.signIn")}
          </Link>
          <Button
            asChild
            size="sm"
            onClick={() => track("signup_click")}
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
