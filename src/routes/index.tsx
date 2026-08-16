import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, Minus, Sparkles, Check, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";
import { ScrollProgress } from "@/components/scroll-progress";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { track } from "@/lib/analytics";
import { freeTierLimits } from "@/lib/limits";
import { useT } from "@/i18n/use-t";

const BRAND = "Life Order";
const SITE_URL = "https://life-orderuz.lovable.app";
const CANONICAL_URL = "https://life-orderuz.lovable.app/";
const TITLE = "Life Order — O'z-o'zini boshqarish tizimi. Motivatsiya tugaydi, tizim qoladi";
const DESCRIPTION = "Life Order bilan hayotingizni tartibga soling. Biologik ritm va psixologiyaga asoslangan premium habit tracker va AI mentor.";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },

      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/b42cdfab-e69a-4d7f-bbe4-846f5657aa60" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/b42cdfab-e69a-4d7f-bbe4-846f5657aa60" },
    ],
    links: [{ rel: "canonical", href: CANONICAL_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: BRAND,
          url: SITE_URL,
          description: DESCRIPTION,
          applicationCategory: "LifestyleApplication",
          operatingSystem: "Web, iOS, Android",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "UZS",
          },
        }),
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { t } = useT();
  


  return (
    <div className="min-h-dvh bg-background text-foreground selection:bg-primary/20">
      <ScrollProgress />
      <SiteHeader />
      <main id="main-content">
        <Hero t={t} />
        <Features t={t} />
        <HowItWorks t={t} />
        <PricingSection t={t} />
        <FaqSection t={t} />
        <FinalCta t={t} />
      </main>
      <SiteFooter />
    </div>
  );
}

function Hero({ t }: { t: any }) {
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden border-b border-border bg-background">
      {/* Static Radial Gradient Background */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--primary)_0%,_transparent_70%)] opacity-[0.03] pointer-events-none" />
      
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-20 text-center md:px-8">
        <Reveal delay={100}>
          <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-6 py-2 font-ui text-[11px] font-bold uppercase tracking-[0.25em] text-primary shadow-[0_0_30px_hsl(var(--primary)/0.25)] backdrop-blur-md">
            <Sparkles className="h-4 w-4" />
            Beta 2.0 · Self-Control OS
          </div>
        </Reveal>

        <Reveal delay={250}>
          <h1 className="font-serif text-[48px] leading-[0.9] tracking-tighter text-balance sm:text-[72px] md:text-[84px] lg:text-[100px] text-text-primary">
            {t("hero.title").split(".")[0]}.<br />
            <span className="text-primary italic">
              {t("hero.title").split(".")[1] || ""}
            </span>
          </h1>
        </Reveal>

        <Reveal delay={400}>
          <p className="mx-auto mt-10 max-w-2xl font-ui text-xl leading-relaxed text-text-secondary md:text-2xl">
            {t("hero.subtitle")}
          </p>
        </Reveal>

        <Reveal delay={550}>
          <div className="mt-16 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Button
              asChild
              size="lg"
              onClick={() => track("signup_click", { source: "hero" })}
              className="group relative h-14 rounded-full px-12 font-ui text-base font-bold transition-all hover:scale-105 active:scale-[0.98] shadow-premium bg-primary text-primary-foreground"
            >
              <Link to="/auth">
                {t("auth.signUp")}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1.5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="h-14 rounded-full px-10 font-ui text-base font-bold border-border bg-transparent hover:bg-muted/30 transition-all active:scale-[0.98]"
            >
              <Link to="/pricing">{t("nav.pricing")}</Link>
            </Button>
          </div>
        </Reveal>
        
        <Reveal delay={700}>
          <div className="mt-20 flex flex-col items-center gap-6">
            <p className="font-ui text-xs font-medium text-muted-foreground tracking-wide">
              Beta 2.0 · Erta kirish ochiq
            </p>
          </div>
        </Reveal>

        <Reveal delay={850}>
          <div className="mt-24 flex items-center justify-center gap-12 grayscale opacity-60">
            <div className="text-[10px] uppercase tracking-[0.3em] font-bold">Fogg Behavior Model</div>
            <div className="h-1 w-1 rounded-full bg-border" />
            <div className="text-[10px] uppercase tracking-[0.3em] font-bold">Self-Determination Theory</div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}

function Features({ t }: { t: any }) {
  const items = [
    { 
      n: "01", 
      t: t("dashboard.quick.quests"), 
      d: t("dashboard.habits.emptyDesc") 
    },
    { 
      n: "02", 
      t: "Obsidian intizom", 
      d: "Obsidian intizom tizimi. Motivatsiya so'nganda ham tizimni ushlab turish uchun mo'ljallangan 'forgiving' mexanizm." 
    },
    { 
      n: "03", 
      t: t("dashboard.sections.timetable"), 
      d: t("dashboard.habits.emptyDesc") 
    },
  ];

  return (
    <section id="features" className="relative overflow-hidden border-b border-border py-24 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)] opacity-[0.02] pointer-events-none" />
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="grid md:grid-cols-3 gap-x-12 gap-y-16">
          {items.map((f, i) => (
            <Reveal key={f.n} delay={i * 100}>
              <div className="group relative">
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <span className="font-serif text-lg font-bold">{f.n}</span>
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4 tracking-tight group-hover:text-text-primary transition-colors">{f.t}</h3>
                <p className="font-ui text-[15px] leading-relaxed text-text-secondary">{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}


function HowItWorks({ t }: { t: any }) {
  const steps = [
    { n: "01", t: t("onboarding.questions.goal"), d: t("onboarding.subtitle") },
    { n: "02", t: t("dashboard.habits.emptyCta"), d: t("dashboard.habits.emptyDesc") },
    { n: "03", t: t("dashboard.hero.plan"), d: t("dashboard.hero.discipline") },
  ];

  return (
    <section className="relative overflow-hidden border-b border-border py-24 md:py-40">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--primary)_0%,_transparent_70%)] opacity-[0.02] pointer-events-none" />
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <Reveal>
              <div className="mb-6 inline-flex rounded-full bg-primary/10 px-4 py-1.5 font-ui text-[10px] font-bold uppercase tracking-widest text-primary">
                Amaliyot
              </div>
              <h2 className="font-serif text-[44px] leading-[1.05] tracking-tighter mb-8 sm:text-[56px]">
                {t("hero.title")}
              </h2>
            </Reveal>
            <div className="space-y-10 mt-12">
              {steps.map((s, i) => (
                <Reveal key={s.n} delay={i * 100}>
                  <div className="group flex gap-6">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/30 font-serif text-sm font-bold transition-colors group-hover:border-primary/50 group-hover:text-primary">
                      {s.n}
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold mb-2 tracking-tight">{s.t}</h3>
                      <p className="font-ui text-[15px] leading-relaxed text-muted-foreground/85">{s.d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={300} className="relative aspect-square lg:aspect-auto lg:h-[600px]">
            <div className="absolute inset-0 rounded-[var(--radius-xl)] border border-border bg-gradient-to-br from-card/80 to-card/20 backdrop-blur-sm overflow-hidden shadow-premium">
               {/* Mock UI visualization */}
               <div className="absolute inset-x-0 top-0 h-12 border-b border-border bg-muted/20 px-4 flex items-center gap-2">
                 <div className="h-2 w-2 rounded-full bg-border" />
                 <div className="h-2 w-2 rounded-full bg-border" />
                 <div className="h-2 w-2 rounded-full bg-border" />
               </div>
               <div className="p-8 pt-20 space-y-6">
                 <div className="h-24 w-full rounded-2xl bg-primary/5 border border-primary/10 p-4 flex items-center justify-between">
                   <div className="space-y-2">
                     <div className="h-2 w-24 bg-primary/20 rounded" />
                     <div className="h-4 w-32 bg-primary/40 rounded" />
                   </div>
                   <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin-slow" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="h-32 rounded-2xl border border-border bg-muted/20" />
                   <div className="h-32 rounded-2xl border border-border bg-muted/20" />
                 </div>
                 <div className="h-40 rounded-2xl border border-border bg-muted/20 relative overflow-hidden">
                    <div className="absolute inset-0 backdrop-grid opacity-30" />
                 </div>
               </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>

  );
}

function FaqSection({ t }: { t: any }) {
  const items = Array.isArray(t("faq.items")) ? (t("faq.items") as any[]) : [];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="border-b border-border py-24 md:py-32 bg-muted/5">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 lg:gap-24">
          <div>
            <Reveal>
              <div className="mb-6 inline-flex rounded-full bg-primary/10 px-4 py-1.5 font-ui text-[10px] font-bold uppercase tracking-widest text-primary">
                FAQ
              </div>
              <h2 className="font-serif text-[42px] leading-[1] tracking-tighter mb-8 sm:text-[54px]">
                Savol va javoblar.
              </h2>
              <p className="font-ui text-muted-foreground/80 leading-relaxed max-w-sm">
                Tizim qanday ishlashi va sizga qanday foyda berishi haqida barcha javoblar.
              </p>
            </Reveal>
          </div>
          <div className="space-y-0 border-t border-border">
            {items.map((it: any, i: number) => {
              const isOpen = open === i;
              return (
                <Reveal key={i} delay={i * 50}>
                  <div className="border-b border-border">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-content-${i}`}
                      id={`faq-button-${i}`}
                      className="w-full flex items-center justify-between gap-6 py-8 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                    >
                      <span className="font-serif text-xl font-bold tracking-tight transition-colors group-hover:text-primary">{it.q}</span>
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border border-border transition-all",
                        isOpen ? "bg-primary border-primary text-primary-foreground" : "group-hover:border-primary/50"
                      )}>
                        {isOpen ? <Minus className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
                      </div>
                    </button>
                    <div
                      id={`faq-content-${i}`}
                      role="region"
                      aria-labelledby={`faq-button-${i}`}
                      className="grid transition-[grid-template-rows] duration-300 ease-out"
                      style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <div className="pb-8 font-ui text-base leading-relaxed text-text-secondary max-w-xl">{it.a}</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


function PricingSection({ t }: { t: any }) {
  const freeFeatures = [
    `${freeTierLimits.habits} tagacha odat`,
    `Kunlik ${freeTierLimits.journalEntriesPerDay} ta kundalik yozuv`,
    `Nadir bilan kunda ${freeTierLimits.mentorMessagesPerDay} ta xabar`,
    "Kunlik 3 ta mikro-vazifa",
    "Streak, XP va intizom balli",
    "PWA offline rejim"
  ];

  const premiumFeatures = [
    "Cheksiz odatlar",
    "Nadir Pro (Full Memory)",
    "Haftalik AI hisobotlar",
    "Burnout oldini olish",
    "Premium yordam"
  ];

  const f_feats = t("pricing.free.features");
  const displayFree = Array.isArray(f_feats) 
    ? (f_feats as string[]) 
    : freeFeatures;
    
  const p_feats = t("pricing.premium.features");
  const displayPremium = Array.isArray(p_feats) 
    ? (p_feats as string[]) 
    : premiumFeatures;

  return (
    <section id="pricing" className="relative py-24 md:py-40 bg-muted/5 border-b border-border overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="mb-20 text-center">
          <Reveal>
            <h2 className="font-serif text-[44px] leading-[1.05] tracking-tighter mb-6 sm:text-[56px]">
              Halol narxlar. <span className="text-muted-foreground">Yashirin to'lovsiz.</span>
            </h2>
            <p className="mx-auto max-w-2xl font-ui text-lg text-muted-foreground/80">
              Karta so'ralmaydi. Free bilan boshlang, o'zingizga kerak bo'lganda Pro ga o'ting.
            </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Reveal delay={0}>
            <div className="relative rounded-3xl p-10 transition-all hover:scale-[1.02] bg-background border border-border">
              <div className="mb-8">
                <h3 className="font-serif text-2xl font-bold mb-2">{t("pricing.free.title")}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-4xl font-bold tracking-tighter tabular-nums">{t("pricing.free.price")}</span>
                  <span className="text-sm font-ui text-muted-foreground tracking-wide uppercase">{t("pricing.free.period")}</span>
                </div>
              </div>
              <ul className="mb-10 space-y-4">
                {displayFree.map((feat: string) => (
                  <li key={feat} className="flex items-start gap-3 text-sm font-ui text-muted-foreground/90">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" variant="outline" className="w-full rounded-full h-12 font-ui font-bold">
                <Link to="/auth">{t("pricing.free.cta")}</Link>
              </Button>
            </div>
          </Reveal>

          {/* Pro Plan */}
          <Reveal delay={150}>
            <div className="relative rounded-3xl p-10 transition-all hover:scale-[1.02] bg-card border-2 border-primary shadow-[0_32px_64px_-16px_hsl(var(--primary)/0.15)]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                {t("pricing.premium.badge")}
              </div>
              <div className="mb-8">
                <h3 className="font-serif text-2xl font-bold mb-2">{t("pricing.premium.title")}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-4xl font-bold tracking-tighter tabular-nums">{t("pricing.premium.price")}</span>
                  <span className="text-sm font-ui text-muted-foreground tracking-wide uppercase">{t("pricing.premium.period")}</span>
                </div>
              </div>
              <ul className="mb-10 space-y-4">
                {displayPremium.map((feat: string) => (
                  <li key={feat} className="flex items-start gap-3 text-sm font-ui text-muted-foreground/90">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="w-full rounded-full h-12 font-ui font-bold bg-primary text-primary-foreground">
                <Link to="/pricing">{t("pricing.premium.cta")}</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FinalCta({ t }: { t: any }) {
  return (
    <section className="relative py-24 md:py-48 overflow-hidden">
      <div className="absolute inset-0 bg-primary/[0.02] pointer-events-none" />
      <div className="mx-auto max-w-6xl px-6 md:px-8 text-center">
        <Reveal>
          <h2 className="font-serif text-[56px] leading-[1] tracking-tighter mb-10 sm:text-[80px] md:text-[100px] text-balance">
            {t("cta.heading")}
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="mx-auto mt-6 mb-14 max-w-xl font-ui text-lg text-muted-foreground/80">
            {t("cta.body")}
          </p>
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="group h-16 rounded-full px-12 font-ui text-lg font-bold transition-all hover:scale-105 active:scale-[0.98] shadow-premium bg-primary text-primary-foreground"
            >
              <Link to="/auth">
                {t("cta.button")}
                <ArrowRight className="ml-2.5 h-6 w-6 transition-transform group-hover:translate-x-1.5" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

