import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, Minus, Sparkles } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { ScrollProgress } from "@/components/scroll-progress";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const BRAND = "Life Order";
const SITE_URL = "https://life-orderuz.lovable.app";
const ONE_LINER = "Self-Control OS — Motivatsiya tugaydi, tizim qoladi. Har kuni uchta aniq qadam va Nadir AI mentor.";

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
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
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
    <section className="relative flex min-h-[96dvh] flex-col items-center justify-center overflow-hidden border-b border-border bg-[#0a0502]">
      {/* Premium 3D Orb Backgrounds */}
      <div className="absolute top-[-15%] right-[-15%] h-[800px] w-[800px] animate-orb-float rounded-full bg-primary/15 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-15%] h-[700px] w-[700px] animate-orb-float-delayed rounded-full bg-primary/8 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[900px] w-[900px] animate-blob-breathe rounded-full bg-primary/[0.05] blur-[180px] pointer-events-none" />
      
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-20 text-center md:px-8">
        <Reveal delay={100}>
          <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-6 py-2 font-ui text-[11px] font-bold uppercase tracking-[0.25em] text-primary shadow-[0_0_30px_hsl(var(--primary)/0.25)] backdrop-blur-md">
            <Sparkles className="h-4 w-4" />
            Beta 2.0 · Self-Control OS
          </div>
        </Reveal>

        <Reveal delay={250}>
          <h1 className="font-serif text-[72px] leading-[0.88] tracking-tighter text-balance sm:text-[104px] md:text-[128px] lg:text-[152px]">
            Motivatsiya tugaydi,<br />
            <span className="text-primary italic relative">
              Tizim qoladi.
              <span className="absolute -bottom-4 left-0 h-1.5 w-full bg-primary/25 blur-md" />
            </span>
          </h1>
        </Reveal>

        <Reveal delay={400}>
          <p className="mx-auto mt-14 max-w-3xl font-ui text-xl leading-relaxed text-muted-foreground/80 md:text-2xl">
            Life Order — biologik ritming va xulq-atvor arxitekturangga moslangan,<br className="hidden md:block" />
            o'zbek tilidagi yagona premium intizom tizimi.
          </p>
        </Reveal>

        <Reveal delay={550}>
          <div className="mt-20 flex flex-col items-center justify-center gap-8 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="group relative h-18 rounded-full px-16 font-ui text-xl font-bold transition-all hover:scale-105 active:scale-[0.98] shadow-[0_32px_64px_-16px_hsl(var(--primary)/0.6)]"
            >
              <Link to="/auth">
                Tashxisni boshlash
                <ArrowRight className="ml-2.5 h-6 w-6 transition-transform group-hover:translate-x-1.5" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { n: "01", t: "AI mentor", d: "Har kuni progressingni tekshiradi va keyingi qadamni aniq ko'rsatadi." },
    { n: "02", t: "Intizom o'lchovi", d: "Streak, XP va 0–100 intizom balli. O'sishing raqamlarda ko'rinadi." },
    { n: "03", t: "Kunlik missiyalar", d: "Uchta qisqa vazifa. Bugun bajarish mumkin, ortiqcha tanlov yo'q." },
  ];

  return (
    <section className="border-b border-border py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="grid md:grid-cols-3 gap-x-16 gap-y-12">
          {items.map((f, i) => (
            <Reveal key={f.n} delay={i * 100}>
              <div className="border-t border-border pt-8">
                <div className="font-ui text-[11px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-6 tabular-nums">{f.n}</div>
                <h3 className="font-serif text-2xl font-bold mb-4 tracking-tight">{f.t}</h3>
                <p className="font-ui text-base leading-relaxed text-muted-foreground/80">{f.d}</p>
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
    { n: "01", t: "Bir necha savolga javob ber", d: "60 soniyada hozirgi nuqtangni belgilaymiz." },
    { n: "02", t: "Shaxsiy rejangni ol", d: "AI har kuni uchta aniq vazifa tuzadi." },
    { n: "03", t: "Streakni qur", d: "Har bir missiya XP va streak beradi." },
  ];

  return (
    <section className="border-b border-border py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="max-w-2xl">
          <Reveal>
            <h2 className="font-serif text-[42px] leading-[0.95] tracking-tighter mb-16 sm:text-[54px]">
              Uch qadam.
            </h2>
          </Reveal>
          <ol className="space-y-12">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 100}>
                <li className="flex gap-8 group">
                  <span className="font-ui text-[11px] uppercase tracking-[0.2em] text-muted-foreground/40 pt-1.5 w-6 shrink-0 tabular-nums transition-colors group-hover:text-primary">{s.n}</span>
                  <div>
                    <div className="font-serif text-2xl font-bold mb-3 tracking-tight">{s.t}</div>
                    <p className="font-ui text-base leading-relaxed text-muted-foreground/80">{s.d}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
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
    <section className="border-b border-border py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="max-w-2xl">
          <Reveal>
            <h2 className="font-serif text-[42px] leading-[0.95] tracking-tighter mb-16 sm:text-[54px]">
              Savollar.
            </h2>
          </Reveal>
          <div className="space-y-0">
            {items.map((it, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={i} delay={i * 50}>
                  <div className="border-t border-border last:border-b">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-6 py-8 text-left group"
                    >
                      <span className="font-serif text-xl font-bold tracking-tight transition-colors group-hover:text-primary">{it.q}</span>
                      {isOpen
                        ? <Minus className="h-5 w-5 text-primary shrink-0 transition-transform" />
                        : <Plus className="h-5 w-5 text-muted-foreground shrink-0 transition-transform group-hover:text-primary" />}
                    </button>
                    <div
                      className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
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
    <section className="py-24 md:py-40">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="max-w-3xl">
          <Reveal>
            <h2 className="font-serif text-[54px] leading-[0.9] tracking-tighter mb-12 sm:text-[72px] md:text-[92px]">
              Bugun boshla.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <Button
              asChild
              size="lg"
              className="group h-18 rounded-full px-16 font-ui text-xl font-bold transition-all hover:scale-105 active:scale-[0.98] shadow-[0_32px_64px_-16px_hsl(var(--primary)/0.6)]"
            >
              <Link to="/auth">
                Bepul boshlash
                <ArrowRight className="ml-2.5 h-6 w-6 transition-transform group-hover:translate-x-1.5" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
