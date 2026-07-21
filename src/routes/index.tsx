import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  Check,
  Shield,
  Flame,
  BarChart3,
  Sparkles,
  BookText,
  Clock,
} from "lucide-react";

const BRAND = "Life Order";
const SITE_URL = "https://life-orderuz.lovable.app";
const ONE_LINER =
  "Life Order — xulq-atvor tizimi. Trigger → mikro-harakat → tasdiq halqasi. Nadir AI mentor bilan. Bepul, kartasiz.";

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Life Order boshqa ilovalardan qanday farq qiladi?",
    a: "Motivatsion ilova emas — xulq-atvor tizimi. BJ Fogg va James Clear tadqiqotlariga asoslangan: mikro-harakat (2 daqiqadan kam), aniq trigger va darhol tasdiq.",
  },
  {
    q: "Odat qancha vaqtda mustahkamlanadi?",
    a: "Phillippa Lally (UCL, 2010): o'rtacha 66 kun (18–254). Streak, XP va Shield tizimi shu jarayonni boshqaradi.",
  },
  {
    q: "Nadir AI mentor nima qiladi?",
    a: "Sening ma'lumotlaring (odatlar, kayfiyat, streak, kundalik) asosida shaxsiy javob beradi va \"agar X — men Y\" formatida reja tuzadi.",
  },
  {
    q: "Bepulmi? Karta so'raladimi?",
    a: "Free reja doimiy, karta so'ralmaydi. Pro (49 000 so'm/oy) — kengroq AI konteksti va haftalik hisobot.",
  },
  {
    q: "Ma'lumotlarim xavfsizmi?",
    a: "TLS + RLS izolyatsiya. Sotilmaydi, reklama uchun ishlatilmaydi. Bir bosishda o'chirasan.",
  },
  {
    q: "Offline ishlaydimi?",
    a: "Ha — PWA sifatida telefonga o'rnatiladi. Odat va kundalik offline yoziladi, ulanish tiklanganda sinxron.",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${BRAND} — Motivatsiya tugaydi, tizim qoladi` },
      { name: "description", content: ONE_LINER },
      { property: "og:title", content: `${BRAND} — Motivatsiya tugaydi, tizim qoladi` },
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
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main>
        <Hero />
        <ProofStrip />
        <HowItWorks />
        <Features />
        <Pricing />
        <Faq />
      </main>
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Ambient halo — extremely subtle */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full halo-drift"
        style={{
          background:
            "radial-gradient(closest-side, hsl(var(--primary) / 0.10), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-5 pb-16 pt-16 text-center md:pb-24 md:pt-28">
        <p className="rise-1 font-ui text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Xulq-atvor tizimi · Beta
        </p>
        <h1 className="mt-5 font-serif text-[36px] leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl">
          <span className="rise-2 inline-block">Motivatsiya tugaydi.</span>
          <br />
          <span className="rise-3 inline-block text-muted-foreground">Tizim qoladi.</span>
        </h1>
        <p className="rise-4 mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground text-pretty">
          Kuniga uchta 2-daqiqalik qadam. Nadir AI mentor sen uchun shaxsiy protokol tuzadi.
        </p>
        <div className="rise-4 mt-8 flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
          <Button asChild size="lg" className="group h-12 rounded-full px-6 font-ui font-semibold">
            <Link to="/auth">
              Bepul boshlash
              <ArrowRight className="cta-arrow ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="h-12 rounded-full px-5 font-ui">
            <a href="#how">Qanday ishlaydi</a>
          </Button>
        </div>
        <p className="rise-4 mt-5 font-ui text-xs text-muted-foreground">
          60 soniyada · Kartasiz · O'zbek tilida
        </p>
      </div>
    </section>
  );
}

function ProofStrip() {
  const items = [
    { k: "43%", v: "kunlik xulq — odat", src: "Wood, USC 2019" },
    { k: "66 kun", v: "o'rtacha avtomatlashuv", src: "Lally, UCL 2010" },
    { k: "1%", v: "kunlik yaxshilanish", src: "J. Clear, 2018" },
    { k: "B=MAP", v: "xulq formulasi", src: "BJ Fogg, Stanford" },
  ];
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
          {items.map((s, i) => (
            <Reveal key={s.k} delay={i * 90}>
              <dt className="tick-in font-serif text-2xl tracking-tight tabular-nums md:text-3xl">
                {s.k}
              </dt>
              <dd className="mt-1 font-ui text-[13px] leading-tight text-foreground/80">
                {s.v}
              </dd>
              <p className="mt-1.5 font-ui text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {s.src}
              </p>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Tashxis", body: "5 daqiqalik onboarding: arxetip, uyqu, energiya, zaif nuqta." },
    { n: "02", title: "Protokol", body: "Har kun 3 ta \"agar X — men Y\" formatidagi mikro-qadam." },
    { n: "03", title: "Takror", body: "Har bajarilgan qadam → XP + streak. Shield xatoni kechiradi." },
    { n: "04", title: "Tahlil", body: "Haftalik AI hisobot: nima ishladi, qayerda susaydik." },
  ];
  return (
    <section id="how" className="border-b border-border">
      <div className="mx-auto max-w-5xl px-5 py-14 md:py-20">
        <SectionHeader eyebrow="Jarayon" title="4 bosqichli halqa" />
        <div className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius)] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal
              key={s.n}
              delay={i * 90}
              className="cell-hover bg-background p-5"
            >
              <p className="font-ui text-xs uppercase tracking-[0.22em] text-primary">
                {s.n}
              </p>
              <h3 className="mt-3 font-serif text-lg">{s.title}</h3>
              <p className="mt-2 font-ui text-[13px] leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Sparkles, title: "Nadir AI mentor", body: "Kundalik, kayfiyat va odatlaring kontekstida shaxsiy javob." },
    { icon: Flame, title: "Streak va XP", body: "Ketma-ket kunlar zanjiri — har mikro-qadam ballanadi." },
    { icon: Shield, title: "Shield tizimi", body: "Haftada 1 kun kechirim. Bitta xato tizimni buzmaydi." },
    { icon: BookText, title: "Kundalik + kayfiyat", body: "3 satrlik yozuv. Nadir pastlikni sezsa nudge yuboradi." },
    { icon: Clock, title: "Sirkadian jadval", body: "Ertalab, kunduz, kech — o'z blogiga qadam." },
    { icon: BarChart3, title: "Haftalik hisobot", body: "AI tahlili + keyingi hafta uchun bitta aniq tuzatish." },
  ];
  return (
    <section id="features" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
        <SectionHeader eyebrow="Nima bor" title="Asosiy modullar" />
        <div className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius)] border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f, i) => (
            <Reveal
              key={f.title}
              delay={i * 70}
              className="cell-hover bg-background p-5"
            >
              <f.icon className="h-4 w-4 text-primary" />
              <h3 className="mt-3 font-serif text-base">{f.title}</h3>
              <p className="mt-2 font-ui text-[13px] leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="border-b border-border">
      <div className="mx-auto max-w-4xl px-5 py-14 md:py-20">
        <SectionHeader eyebrow="Narx" title="Bepul boshla" />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <PricingCard
            title="Free"
            price="0 so'm"
            period="doimiy"
            features={[
              "Kunlik 3 ta mikro-missiya",
              "Streak, XP, intizom balli",
              "Nadir bilan asosiy suhbat",
              "Kundalik va kayfiyat",
              "PWA — telefonga o'rnatiladi",
            ]}
            cta="Bepul boshlash"
            variant="outline"
          />
          <PricingCard
            title="Pro"
            price="49 000 so'm"
            period="oyiga"
            features={[
              "Free rejadagi hammasi",
              "Nadir Pro — kengroq kontekst",
              "Cheksiz odat va quest",
              "Haftalik AI hisobot",
              "Burnout signal + nudge",
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
        "relative h-full rounded-[var(--radius)] p-7 " +
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
            <Check
              className={
                "mt-0.5 h-4 w-4 shrink-0 " +
                (variant === "primary" ? "text-primary" : "text-muted-foreground")
              }
            />
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
    <section id="faq" className="border-b border-border">
      <div className="mx-auto max-w-2xl px-5 py-14 md:py-20">
        <SectionHeader eyebrow="Savollar" title="Ko'p so'raladi" />
        <Accordion type="single" collapsible className="mt-8">
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

function SectionHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <Reveal>
      <div className="flex items-center gap-3">
        <span aria-hidden className="line-sweep" />
        <p className="font-ui text-xs uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
      </div>
      <h2 className="mt-3 font-serif text-2xl leading-tight tracking-tight md:text-3xl">
        {title}
      </h2>
    </Reveal>
  );
}
