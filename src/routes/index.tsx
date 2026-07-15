import { createFileRoute, Link } from "@tanstack/react-router";
import { t, uz } from "@/i18n";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Compass, Sparkles, Check } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${uz.brand.name} — ${uz.brand.tagline}` },
      { name: "description", content: uz.brand.oneLiner },
      { property: "og:title", content: `${uz.brand.name} — ${uz.brand.tagline}` },
      { property: "og:description", content: uz.brand.oneLiner },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in">
      <Header />
      <main>
        <Hero />
        <Pillars />
        <NervousSystem />
        <Mentor />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

/* ---------------- Header ---------------- */
function Header() {
  const items: { key: string; label: string }[] = [
    { key: "features", label: t("nav.features") },
    { key: "method", label: t("nav.method") },
    { key: "mentor", label: t("nav.mentor") },
    { key: "pricing", label: t("nav.pricing") },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2 font-serif text-lg tracking-tight">
          <LogoMark />
          <span>{uz.brand.name}</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {items.map((item) => (
            <a
              key={item.key}
              href={`#${item.key}`}
              className="font-ui text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="hidden font-ui text-muted-foreground hover:text-foreground sm:inline-flex"
            asChild
          >
            <Link to="/auth">{t("nav.signIn")}</Link>
          </Button>
          <Button size="sm" className="font-ui font-semibold" asChild>
            <Link to="/auth">
              {t("nav.startFree")}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <span
      aria-hidden
      className="grid h-7 w-7 place-items-center rounded-[10px] bg-primary text-primary-foreground"
    >
      <span className="font-serif text-[15px] font-semibold leading-none">L</span>
    </span>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 0%, hsl(var(--primary) / 0.10), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-5 pb-24 pt-20 text-center md:pt-28">
        <p className="font-ui text-xs uppercase tracking-[0.28em] text-muted-foreground">
          {t("hero.eyebrow")}
        </p>
        <h1 className="mx-auto mt-6 max-w-3xl font-serif text-4xl leading-[1.05] tracking-tight text-balance md:text-6xl">
          {t("hero.title")}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
          {t("hero.subtitle")}
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" className="font-ui font-semibold" asChild>
            <Link to="/auth">
              {t("hero.ctaPrimary")}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="secondary" className="font-ui" asChild>
            <a href="#method">{t("hero.ctaSecondary")}</a>
          </Button>
        </div>
        <p className="mt-6 font-ui text-xs text-muted-foreground">
          {t("hero.trustLine")}
        </p>
      </div>
    </section>
  );
}

/* ---------------- Pillars ---------------- */
function Pillars() {
  const icons = [Compass, Sparkles, ShieldCheck];
  return (
    <section id="features" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <SectionHeading
          eyebrow="Uchta ustun"
          title={uz.pillars.heading}
          subtitle={uz.pillars.subheading}
        />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {uz.pillars.items.map((item, idx) => {
            const Icon = icons[idx] ?? Compass;
            return (
              <article
                key={item.tag}
                className="glass lift rounded-[var(--radius)] p-7"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="grid h-10 w-10 place-items-center rounded-[10px] border border-border bg-secondary text-foreground"
                    aria-hidden
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-ui text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {item.tag}
                  </span>
                </div>
                <h3 className="mt-6 font-serif text-2xl leading-tight">
                  {item.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Nervous system (tiers) ---------------- */
function NervousSystem() {
  const tierColorClass: Record<string, string> = {
    Boshlovchi: "text-muted-foreground",
    Intizomli: "text-foreground",
    Kuchli: "text-foam",
    Elita: "text-primary",
    Usta: "text-sun",
    Apex: "text-coral",
  };
  return (
    <section id="method" className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <SectionHeading
          eyebrow="Nerv tizimi"
          title={uz.nervous.heading}
          subtitle={uz.nervous.subheading}
        />
        <div className="mt-14 grid gap-8 md:grid-cols-[1.1fr_1fr]">
          <div className="glass rounded-[var(--radius)] p-2">
            <table className="w-full font-ui text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="px-5 py-4 font-medium">Ball</th>
                  <th className="px-5 py-4 font-medium">Daraja</th>
                  <th className="px-5 py-4 font-medium">EN</th>
                </tr>
              </thead>
              <tbody>
                {uz.nervous.tiers.map((tier) => (
                  <tr
                    key={tier.uz}
                    className="border-t border-border/60"
                  >
                    <td className="px-5 py-4 tabular-nums text-muted-foreground">
                      {tier.range}
                    </td>
                    <td
                      className={`px-5 py-4 font-serif text-base ${
                        tierColorClass[tier.uz] ?? "text-foreground"
                      }`}
                    >
                      {tier.uz}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {tier.en}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col justify-center gap-6">
            <p className="font-serif text-2xl leading-tight text-pretty">
              Discipline Score serverda hisoblanadi. Frontend faqat ko'rsatadi
              — o'zgartira olmaydi.
            </p>
            <div className="rounded-[var(--radius)] border border-border bg-secondary/40 p-6">
              <div className="mb-3 flex items-center gap-2 font-ui text-xs uppercase tracking-[0.2em] text-primary">
                <ShieldCheck className="h-4 w-4" /> Himoya
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {uz.nervous.shield}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Mentor ---------------- */
function Mentor() {
  return (
    <section id="mentor" className="border-t border-border">
      <div className="mx-auto max-w-4xl px-5 py-24">
        <SectionHeading eyebrow="Nadir" title={uz.mentor.heading} centered />
        <p className="mx-auto mt-8 max-w-2xl text-center text-lg leading-relaxed text-muted-foreground text-pretty">
          {uz.mentor.body}
        </p>
        <figure className="mx-auto mt-12 max-w-2xl">
          <blockquote className="glass relative rounded-[var(--radius)] p-8 font-serif text-xl leading-relaxed">
            <span
              aria-hidden
              className="absolute -left-2 -top-4 select-none font-serif text-7xl leading-none text-primary/60"
            >
              &ldquo;
            </span>
            {uz.mentor.quote}
          </blockquote>
          <figcaption className="mt-4 text-center font-ui text-xs uppercase tracking-[0.24em] text-muted-foreground">
            {uz.mentor.quoteBy}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ---------------- Pricing ---------------- */
function Pricing() {
  const plans = [
    { ...uz.pricing.free, tone: "free" as const },
    { ...uz.pricing.premium, tone: "premium" as const, badge: "Tavsiya" },
  ];
  return (
    <section id="pricing" className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-5xl px-5 py-24">
        <SectionHeading
          eyebrow="Narxlar"
          title={uz.pricing.heading}
          subtitle={uz.pricing.subheading}
          centered
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.title}
              className={
                plan.tone === "premium"
                  ? "relative rounded-[var(--radius)] border-2 border-primary bg-card p-8"
                  : "relative rounded-[var(--radius)] border border-border bg-card p-8"
              }
              style={
                plan.tone === "premium"
                  ? { boxShadow: "var(--shadow-glow)" }
                  : undefined
              }
            >
              {plan.tone === "premium" && (
                <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-foreground">
                  {plan.badge}
                </span>
              )}
              <h3 className="font-serif text-2xl">{plan.title}</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-serif text-5xl tracking-tight">
                  {plan.price}
                </span>
                <span className="font-ui text-sm text-muted-foreground">
                  {plan.period}
                </span>
              </div>
              <ul className="mt-8 space-y-3 font-ui text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      className={
                        plan.tone === "premium"
                          ? "mt-0.5 h-4 w-4 shrink-0 text-primary"
                          : "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                      }
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                size="lg"
                variant={plan.tone === "premium" ? "default" : "secondary"}
                className="mt-8 w-full font-ui font-semibold"
                asChild
              >
                <Link to="/auth">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Final CTA ---------------- */
function FinalCta() {
  return (
    <section id="cta" className="border-t border-border">
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h2 className="font-serif text-4xl leading-tight tracking-tight text-balance md:text-5xl">
          {uz.cta.heading}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
          {uz.cta.body}
        </p>
        <div className="mt-9">
          <Button size="lg" className="font-ui font-semibold" asChild>
            <Link to="/auth">
              {uz.cta.button}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  const links = [
    { key: "terms", label: uz.footer.links.terms },
    { key: "privacy", label: uz.footer.links.privacy },
    { key: "refund", label: uz.footer.links.refund },
    { key: "security", label: uz.footer.links.security },
  ];
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-12 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="flex items-center gap-2 font-serif text-lg">
            <LogoMark />
            <span>{uz.brand.name}</span>
          </div>
          <p className="mt-3 max-w-md font-ui text-sm text-muted-foreground">
            {uz.footer.tagline}
          </p>
          <p className="mt-1 font-ui text-xs text-muted-foreground/80">
            {uz.footer.beta}
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 font-ui text-sm text-muted-foreground">
          {links.map((link) => (
            <a
              key={link.key}
              href={`/${link.key}`}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-5 font-ui text-xs text-muted-foreground">
          {uz.footer.rights}
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Shared ---------------- */
function SectionHeading({
  eyebrow,
  title,
  subtitle,
  centered,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className="font-ui text-xs uppercase tracking-[0.28em] text-primary">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-4 font-serif text-3xl leading-tight tracking-tight text-balance md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
          {subtitle}
        </p>
      )}
    </div>
  );
}
