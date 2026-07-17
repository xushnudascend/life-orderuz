import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check } from "lucide-react";

const BRAND = "Life Order";
const SITE_URL = "https://life-orderuz.lovable.app";
const ONE_LINER =
  "O'z-o'zini boshqarish tizimi. Kuniga uch mikro-qadam va AI mentor Nadir.";

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Bepulmi?",
    a: "Ha. Free reja doimiy. Karta so'ralmaydi.",
  },
  {
    q: "Ma'lumotlarim xavfsizmi?",
    a: "Shifrlangan. Sotilmaydi. Istalgan paytda o'chirasan.",
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
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 h-14 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-4xl items-center justify-between px-5">
        <Link to="/" className="font-serif text-lg font-bold tracking-tight">
          {BRAND}
        </Link>
        <Button asChild size="sm" variant="ghost" className="rounded-full font-ui">
          <Link to="/auth">Kirish</Link>
        </Button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section>
      <div className="mx-auto max-w-2xl px-5 pb-28 pt-24 text-center md:pt-36">
        <h1 className="font-serif text-5xl leading-[1.05] tracking-tight text-balance md:text-6xl">
          Motivatsiya tugaydi.<br />
          <span className="text-muted-foreground">Tizim qoladi.</span>
        </h1>
        <p className="mx-auto mt-8 max-w-md leading-relaxed text-muted-foreground text-pretty">
          Kuniga uch mikro-qadam. AI mentor Nadir.
        </p>
        <Button asChild size="lg" className="mt-10 h-12 rounded-full px-8 font-ui font-semibold">
          <Link to="/auth">Boshlash</Link>
        </Button>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing">
      <div className="mx-auto max-w-3xl px-5 py-20">
        <div className="grid gap-4 md:grid-cols-2">
          <PricingCard
            title="Free"
            price="0"
            features={["3 mikro-missiya / kun", "Streak va XP", "Nadir bilan suhbat"]}
            variant="outline"
          />
          <PricingCard
            title="Pro"
            price="49 000"
            features={["Cheksiz missiya", "Nadir Pro", "Haftalik hisobot"]}
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
  features,
  variant,
}: {
  title: string;
  price: string;
  features: string[];
  variant: "primary" | "outline";
}) {
  return (
    <div
      className={
        "rounded-[var(--radius)] p-7 " +
        (variant === "primary"
          ? "border border-primary/60 bg-background"
          : "border border-border bg-background")
      }
    >
      <h3 className="font-serif text-xl">{title}</h3>
      <div className="mt-3 font-serif text-3xl tracking-tight tabular-nums">
        {price} <span className="font-ui text-sm text-muted-foreground">so'm</span>
      </div>
      <ul className="mt-6 space-y-2.5 font-ui text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Faq() {
  return (
    <section id="faq">
      <div className="mx-auto max-w-xl px-5 py-20">
        <Accordion type="single" collapsible className="w-full">
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
  return (
    <footer>
      <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-8 font-ui text-xs text-muted-foreground">
        <p>© 2026 {BRAND}</p>
        <nav className="flex gap-5">
          <a href="/terms" className="hover:text-foreground">Terms</a>
          <a href="/privacy" className="hover:text-foreground">Privacy</a>
        </nav>
      </div>
    </footer>
  );
}
