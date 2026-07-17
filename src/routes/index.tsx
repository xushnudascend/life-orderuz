import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, Check } from "lucide-react";

const BRAND = "Life Order";
const SITE_URL = "https://life-orderuz.lovable.app";
const ONE_LINER =
  "Life Order — o'z-o'zini boshqarish tizimi. Kuniga uch mikro-qadam va halol AI mentor Nadir. Bepul, kartasiz.";

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Life Order nima?",
    a: "Motivatsion ilova emas — xulq-atvor tizimi. Trigger → mikro-harakat → tasdiq halqasi ustida ishlaydi.",
  },
  {
    q: "Bepulmi?",
    a: "Ha. Free reja doimiy — karta so'ralmaydi, avtomatik to'lov yo'q.",
  },
  {
    q: "Ma'lumotlarim xavfsizmi?",
    a: "Ha. Shifrlangan, sotilmaydi. Hisobingni istalgan paytda o'chirasan.",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${BRAND} — Motivatsiya emas, tizim` },
      { name: "description", content: ONE_LINER },
      { property: "og:title", content: `${BRAND} — Motivatsiya emas, tizim` },
      { property: "og:description", content: ONE_LINER },
      { property: "og:url", content: `${SITE_URL}/` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_ITEMS.map((it) => ({
            "@type": "Question",
            name: it.q,
            acceptedAnswer: { "@type": "Answer", text: it.a },
          })),
        }),
      },
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
        <HowItWorks />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="grid h-7 w-7 place-items-center rounded-[10px] bg-primary text-primary-foreground"
          >
            <span className="font-serif text-[15px] font-semibold leading-none">L</span>
          </span>
          <span className="font-serif text-lg font-bold tracking-tight">{BRAND}</span>
        </Link>
        <Button asChild size="sm" className="rounded-full font-ui font-semibold">
          <Link to="/auth">Boshlash</Link>
        </Button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-24 text-center md:pt-32">
        <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Beta
        </p>
        <h1 className="mt-6 font-serif text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl">
          Motivatsiya tugaydi.<br />
          <span className="text-muted-foreground">Tizim qoladi.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl leading-relaxed text-muted-foreground text-pretty">
          Har kuni uchta aniq qadam va halol AI mentor Nadir.
        </p>
        <div className="mt-9">
          <Button asChild size="lg" className="h-12 rounded-full px-6 font-ui font-semibold">
            <Link to="/auth">
              Bepul boshlash
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <p className="mt-4 font-ui text-xs text-muted-foreground">
          60 soniyada · Kartasiz
        </p>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Tashxis", body: "Qisqa savollar orqali zaif nuqtangni topamiz." },
    { n: "02", title: "Protokol", body: "Nadir sen uchun \"agar X — men Y\" reja tuzadi." },
    { n: "03", title: "Takror", body: "Har mikro-harakat XP va streak beradi. Naqsh avtomatlashadi." },
  ];
  return (
    <section id="how-it-works" className="border-t border-border">
      <div className="mx-auto max-w-5xl px-5 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n}>
              <p className="font-ui text-xs uppercase tracking-[0.22em] text-primary">{s.n}</p>
              <h3 className="mt-3 font-serif text-xl">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="border-t border-border">
      <div className="mx-auto max-w-4xl px-5 py-20">
        <div className="grid gap-5 md:grid-cols-2">
          <PricingCard
            title="Free"
            price="0 so'm"
            period="doimiy"
            features={[
              "Kunlik 3 ta mikro-missiya",
              "Streak, XP, intizom balli",
              "Nadir bilan asosiy suhbat",
            ]}
            cta="Boshlash"
            variant="outline"
          />
          <PricingCard
            title="Pro"
            price="49 000 so'm"
            period="oyiga"
            features={[
              "Free rejadagi hammasi",
              "Nadir Pro — kengroq kontekst",
              "Cheksiz missiya va odat",
              "Haftalik AI hisobot",
            ]}
            cta="Pro rejaga o'tish"
            variant="primary"
          />
        </div>
      </div>
    </section>
  );
}

function PricingCard({
  title,
  price,
  period,
  features,
  cta,
  variant,
}: {
  title: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  variant: "primary" | "outline";
}) {
  return (
    <div
      className={
        "rounded-[var(--radius)] p-7 " +
        (variant === "primary"
          ? "border-2 border-primary bg-background"
          : "border border-border bg-background")
      }
    >
      <h3 className="font-serif text-2xl">{title}</h3>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-serif text-3xl tracking-tight tabular-nums">{price}</span>
        <span className="font-ui text-sm text-muted-foreground">/ {period}</span>
      </div>
      <ul className="mt-6 space-y-3 font-ui text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <Check className={"mt-0.5 h-4 w-4 shrink-0 " + (variant === "primary" ? "text-primary" : "text-muted-foreground")} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Button
        asChild
        size="lg"
        variant={variant === "primary" ? "default" : "outline"}
        className="mt-8 w-full rounded-full font-ui font-semibold"
      >
        <Link to="/auth">{cta}</Link>
      </Button>
    </div>
  );
}

function Faq() {
  return (
    <section id="faq" className="border-t border-border">
      <div className="mx-auto max-w-2xl px-5 py-20">
        <h2 className="font-serif text-2xl leading-tight tracking-tight md:text-3xl">
          Savollar
        </h2>
        <Accordion type="single" collapsible defaultValue="q-0" className="mt-8">
          {FAQ_ITEMS.map((it, i) => (
            <AccordionItem key={i} value={`q-${i}`} className="border-border/60">
              <AccordionTrigger className="text-left font-serif text-base">
                {it.q}
              </AccordionTrigger>
              <AccordionContent className="font-ui text-sm text-muted-foreground leading-relaxed">
                {it.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function Footer() {
  const links = [
    { href: "/pricing", label: "Narxlar" },
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
    { href: "/auth", label: "Kirish" },
  ];
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-8 font-ui text-xs text-muted-foreground">
        <p>© 2026 {BRAND}</p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
