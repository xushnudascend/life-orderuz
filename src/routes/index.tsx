import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, Minus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";
import { ScrollProgress } from "@/components/scroll-progress";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const BRAND = "Life Order";
const SITE_URL = "https://life-orderuz.lovable.app";
const CANONICAL_URL = "https://life-orderuz.lovable.app/";
const ONE_LINER = "Life Order — O'z-o'zini boshqarish tizimi. Motivatsiya tugaydi, tizim qoladi. Kunlik 3 qadam va AI mentor.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${BRAND} — Motivatsiya tugaydi, tizim qoladi` },
      { name: "description", content: ONE_LINER },
      { property: "og:title", content: `${BRAND} — Motivatsiya tugaydi, tizim qoladi` },
      { property: "og:description", content: ONE_LINER },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
          description: ONE_LINER,
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
  return (
    <div className="min-h-dvh bg-background text-foreground selection:bg-primary/20">
      <ScrollProgress />
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <Features />
        <HowItWorks />
        <FaqSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-[90dvh] flex-col items-center justify-center overflow-hidden border-b border-border bg-background py-20">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: Animation/Image */}
          <Reveal delay={200} className="relative order-2 lg:order-1">
            <div className="group relative aspect-[4/5] overflow-hidden rounded-[40px] bg-secondary shadow-premium transition-all duration-700 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
              <img 
                src="/images/staircase-man.jpg" 
                alt="Man climbing stairs - persistence" 
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute bottom-8 left-8 right-8 z-20">
                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-xl border border-white/20">
                  <p className="font-serif text-lg text-white leading-snug">
                    "Kichik qadamlar buyuk natijalarga olib keladi."
                  </p>
                </div>
              </div>
            </div>
            {/* Decorative Orbs for Light Theme */}
            <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-accent/10 blur-[60px]" />
            <div className="absolute -bottom-10 -right-10 h-60 w-60 rounded-full bg-accent/5 blur-[80px]" />
          </Reveal>

          {/* Right: Content */}
          <div className="order-1 text-left lg:order-2">
            <Reveal delay={100}>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-6 py-2 font-ui text-[11px] font-bold uppercase tracking-[0.25em] text-accent">
                <Sparkles className="h-4 w-4" />
                Beta 2.0 · Self-Control OS
              </div>
            </Reveal>

            <Reveal delay={300}>
              <h1 className="font-serif text-[56px] leading-[0.95] tracking-tighter text-balance sm:text-[72px] md:text-[84px] lg:text-[96px] text-text-primary">
                Motivatsiya tugaydi,<br />
                <span className="text-accent italic">Tizim qoladi.</span>
              </h1>
            </Reveal>

            <Reveal delay={450}>
              <p className="mt-10 max-w-xl font-ui text-xl leading-relaxed text-text-secondary md:text-2xl">
                Biologik ritm va psixologiyaga asoslangan premium tizim. Hayotingizni tartibga soling, charchoqni emas.
              </p>
            </Reveal>

            <Reveal delay={600}>
              <div className="mt-14 flex flex-col gap-5 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="group relative h-16 rounded-full px-10 font-ui text-lg font-bold transition-all hover:scale-105 active:scale-[0.98] shadow-premium bg-accent text-white hover:bg-accent-hover"
                >
                  <Link to="/auth">
                    Boshlash
                    <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1.5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-16 rounded-full px-10 font-ui text-lg font-bold border-border bg-white hover:bg-muted/30 transition-all active:scale-[0.98]"
                >
                  <Link to="/pricing">Narxlar</Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Problems and Solutions Section */}
        <div className="mt-32 grid gap-8 md:grid-cols-2">
          <Reveal delay={700}>
            <div className="rounded-[32px] bg-secondary p-10 border border-border/50">
              <h3 className="font-serif text-2xl font-bold mb-6 text-error/80 flex items-center gap-3">
                <Minus className="h-6 w-6" /> Aniq Muammolar
              </h3>
              <ul className="space-y-4 font-ui text-lg text-text-secondary">
                <li className="flex gap-3"><span>•</span> Motivatsiyaning beqarorligi va tez tugashi.</li>
                <li className="flex gap-3"><span>•</span> Tartibsiz ish kuni va doimiy charchoq.</li>
                <li className="flex gap-3"><span>•</span> Maqsadsiz o'tgan vaqt va o'zlikni yo'qotish.</li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={800}>
            <div className="rounded-[32px] bg-accent/5 p-10 border border-accent/20">
              <h3 className="font-serif text-2xl font-bold mb-6 text-accent flex items-center gap-3">
                <Sparkles className="h-6 w-6" /> Aniq Yechimlar
              </h3>
              <ul className="space-y-4 font-ui text-lg text-text-secondary">
                <li className="flex gap-3"><span>•</span> Motivatsiyaga tayanmaydigan mustahkam tizim.</li>
                <li className="flex gap-3"><span>•</span> Kunlik 3 ta eng muhim va biologik ritmga mos vazifa.</li>
                <li className="flex gap-3"><span>•</span> AI Mentor yordamida shaxsiy o'sish nazorati.</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { 
      n: "01", 
      t: "AI Mentor", 
      d: "Progressingizni tahlil qiladi va shaxsiy tavsiyalar beradi. O'zlik o'zgarishiga yordam beruvchi aqlli yordamchi." 

    },
    { 
      n: "02", 
      t: "Obsidian intizom", 
      d: "Streak, XP va 0–100 intizom balli. Motivatsiya so'nganda ham tizimni ushlab turish uchun mo'ljallangan 'forgiving' (kechirimli) mexanizm." 
    },
    { 
      n: "03", 
      t: "Aniq reja", 
      d: "Kunlik uchta eng muhim vazifa. Ortiqcha charchoqsiz, faqat natija beruvchi qadamlar." 

    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-border py-24 md:py-32">
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
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


function HowItWorks() {
  const steps = [
    { n: "01", t: "Savollarga javob bering", d: "Hozirgi holatingizni 60 soniyada aniqlaymiz." },
    { n: "02", t: "Shaxsiy reja oling", d: "Har kunlik 3 ta eng muhim vazifa tuziladi." },
    { n: "03", t: "Natijani ko'ring", d: "Har bir qadam bilan intizomingizni kuchaytiring." },
  ];

  return (
    <section className="relative overflow-hidden border-b border-border py-24 md:py-40">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[140px] pointer-events-none" />
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <Reveal>
              <div className="mb-6 inline-flex rounded-full bg-primary/10 px-4 py-1.5 font-ui text-[10px] font-bold uppercase tracking-widest text-primary">
                Amaliyot
              </div>
              <h2 className="font-serif text-[44px] leading-[1.05] tracking-tighter mb-8 sm:text-[56px]">
                Motivatsiyani emas, <br/>
                <span className="italic opacity-80">hayotingizni boshqaring.</span>
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
                      <p className="font-ui text-[15px] leading-relaxed text-muted-foreground/70">{s.d}</p>
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

function FaqSection() {
  const items = [
    { q: "Life Order nima?", a: "O'z-o'zini boshqarish tizimi. Har kuni uchta aniq qadam va AI mentor." },
    { q: "Bepulmi?", a: "Ha. Bepul reja cheksiz ishlaydi va karta so'ralmaydi." },
    { q: "Qancha vaqt kerak?", a: "Kuniga 10–15 daqiqa yetarli." },
  ];
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
                Ko'p so'raladigan savollar.
              </h2>
              <p className="font-ui text-muted-foreground/70 leading-relaxed max-w-sm">
                Tizim qanday ishlashi va sizga qanday foyda berishi haqida barcha javoblar.
              </p>
            </Reveal>
          </div>
          <div className="space-y-0 border-t border-border">
            {items.map((it, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={i} delay={i * 50}>
                  <div className="border-b border-border">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-6 py-8 text-left group"
                    >
                      <span className="font-serif text-xl font-bold tracking-tight transition-colors group-hover:text-primary">{it.q}</span>
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border border-border transition-all",
                        isOpen ? "bg-primary border-primary text-primary-foreground" : "group-hover:border-primary/50"
                      )}>
                        {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </div>
                    </button>
                    <div
                      className="grid transition-[grid-template-rows] duration-300 ease-out"
                      style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <div className="pb-8 font-ui text-base leading-relaxed text-muted-foreground/80 max-w-xl">{it.a}</div>
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


function FinalCta() {
  return (
    <section className="relative py-24 md:py-48 overflow-hidden">
      <div className="absolute inset-0 bg-primary/[0.02] pointer-events-none" />
      <div className="mx-auto max-w-6xl px-6 md:px-8 text-center">
        <Reveal>
          <h2 className="font-serif text-[56px] leading-[1] tracking-tighter mb-10 sm:text-[80px] md:text-[100px] text-balance">
            Ertadan emas,<br/>
            <span className="text-primary italic">hozirdan.</span>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="mx-auto mt-6 mb-14 max-w-xl font-ui text-lg text-muted-foreground/80">
            Intizom — bu o'zingga bergan va'dangni bajarish. <br className="hidden md:block"/>
            Life Order bilan buni osonlashtir.
          </p>
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="group h-16 rounded-full px-12 font-ui text-lg font-bold transition-all hover:scale-105 active:scale-[0.98] shadow-premium bg-primary text-primary-foreground"
            >
              <Link to="/auth">
                Bepul boshlash
                <ArrowRight className="ml-2.5 h-6 w-6 transition-transform group-hover:translate-x-1.5" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

