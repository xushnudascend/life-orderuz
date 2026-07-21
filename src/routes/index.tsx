import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
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
import { getPeerMirror } from "@/lib/peer-mirror.functions";

const BRAND = "Life Order";
const SITE_URL = "https://life-orderuz.lovable.app";
const ONE_LINER =
  "Motivatsiya tugaydi — tizim qoladi. Kuniga 3 ta 2-daqiqalik qadam, Nadir AI mentor. Kartasiz, o'zbek tilida.";

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Nima farqi bor?",
    a: "Motivatsion ilova emas — xulq-atvor tizimi. Fogg B=MAP va James Clear'ning mikro-odat prinsipi.",
  },
  {
    q: "Qancha vaqtda mustahkamlanadi?",
    a: "Lally, UCL 2010: o'rtacha 66 kun. Streak, XP va Shield shu jarayonni ushlab turadi.",
  },
  {
    q: "Nadir AI nima qiladi?",
    a: "Odat, kayfiyat va kundaliging asosida \"agar X — men Y\" formatida shaxsiy protokol beradi.",
  },
  {
    q: "Karta so'raladimi?",
    a: "Yo'q. Free doimiy. Pro — 49 000 so'm/oy, istalgan payt bekor qilinadi.",
  },
  {
    q: "Ma'lumotim xavfsizmi?",
    a: "TLS + RLS. Sotilmaydi, reklamada ishlatilmaydi, bir bosishda o'chirasan.",
  },
  {
    q: "Offline ishlaydimi?",
    a: "Ha — PWA. Odat va kundalik offline yoziladi, ulanish tiklanganda sinxron.",
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
        <PeerMirror />
        <HowItWorks />
        <Features />
        <Science />
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
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full halo-drift"
        style={{
          background:
            "radial-gradient(closest-side, hsl(var(--primary) / 0.10), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-5 pb-16 pt-16 text-center md:pb-24 md:pt-28">
        <h1 className="font-serif text-[36px] leading-[1.03] tracking-tight text-balance sm:text-5xl md:text-[64px]">
          <span className="rise-2 inline-block">Motivatsiya tugaydi.</span>
          <br />
          <span className="rise-3 inline-block text-muted-foreground">Tizim qoladi.</span>
        </h1>

        <p className="rise-4 mx-auto mt-6 max-w-lg text-[16px] leading-relaxed text-foreground/85 text-pretty">
          Kuniga 3 ta 2-daqiqalik qadam. Nadir AI — motivatsion so'zlar emas,
          shaxsiy protokol.
        </p>

        <div className="rise-4 mt-8 flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
          <Button asChild size="lg" className="group h-12 rounded-full px-6 font-ui font-semibold">
            <Link to="/auth">
              3 daqiqada boshlash
              <ArrowRight className="cta-arrow ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="h-12 rounded-full px-5 font-ui">
            <a href="#how">Qanday ishlaydi</a>
          </Button>
        </div>

        <p className="rise-4 mt-5 font-ui text-xs text-muted-foreground">
          Kartasiz · Reklamasiz · O'zbek tilida
        </p>
      </div>
    </section>
  );
}

function PeerMirror() {
  const load = useServerFn(getPeerMirror);
  const { data } = useQuery({
    queryKey: ["peer-mirror"],
    queryFn: () => load(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const members = data?.members ?? null;
  const todayActive = data?.today_active ?? null;
  const streakLeader = data?.streak_leader ?? null;
  const hasReal = (members ?? 0) > 0;

  return (
    <section className="border-b border-border bg-background/60">
      <div className="mx-auto max-w-5xl px-5 py-8">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-2 font-ui text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Live
          </div>
          <dl className="grid w-full grid-cols-3 gap-4 sm:w-auto sm:gap-8">
            <div>
              <dt className="font-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground">A'zolar</dt>
              <dd className="mt-1 font-serif text-xl tracking-tight tabular-nums">
                {hasReal ? members : "Beta"}
              </dd>
            </div>
            <div>
              <dt className="font-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Bugun</dt>
              <dd className="mt-1 font-serif text-xl tracking-tight tabular-nums">
                {hasReal ? (todayActive ?? 0) : "—"}
              </dd>
            </div>
            <div>
              <dt className="font-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Streak</dt>
              <dd className="mt-1 font-serif text-xl tracking-tight tabular-nums">
                {hasReal ? `${streakLeader ?? 0} kun` : "—"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Tashxis", body: "5 daqiqalik onboarding — arxetip va zaif nuqta." },
    { n: "02", title: "Protokol", body: "Har kun 3 ta \"agar X — men Y\" mikro-qadam." },
    { n: "03", title: "Takror", body: "Bajarilgan qadam → XP + streak. Shield xatoni kechiradi." },
    { n: "04", title: "Tahlil", body: "Haftalik AI hisobot — bitta aniq tuzatish." },
  ];
  return (
    <section id="how" className="border-b border-border">
      <div className="mx-auto max-w-5xl px-5 py-14 md:py-20">
        <SectionHeader eyebrow="Jarayon" title="4 bosqichli halqa" />
        <div className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius)] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 90} className="cell-hover bg-background p-5">
              <p className="font-ui text-xs uppercase tracking-[0.22em] text-primary">{s.n}</p>
              <h3 className="mt-3 font-serif text-lg">{s.title}</h3>
              <p className="mt-2 font-ui text-[13px] leading-relaxed text-muted-foreground">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Sparkles, title: "Nadir AI", body: "Kundalik va odat kontekstida shaxsiy javob." },
    { icon: Flame, title: "Streak + XP", body: "Har mikro-qadam ballanadi." },
    { icon: Shield, title: "Shield", body: "Haftada 1 kechirim — xato tizimni buzmaydi." },
    { icon: BookText, title: "Kundalik", body: "3 satr. Pastlik sezilsa nudge." },
    { icon: Clock, title: "Sirkadian", body: "Ertalab, kunduz, kech — o'z bloki." },
    { icon: BarChart3, title: "Hisobot", body: "Haftalik AI tahlil + tuzatish." },
  ];
  return (
    <section id="features" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
        <SectionHeader eyebrow="Modullar" title="Nima bor" />
        <div className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius)] border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f, i) => (
            <Reveal key={f.title} delay={i * 70} className="cell-hover bg-background p-5">
              <f.icon className="h-4 w-4 text-primary" />
              <h3 className="mt-3 font-serif text-base">{f.title}</h3>
              <p className="mt-2 font-ui text-[13px] leading-relaxed text-muted-foreground">{f.body}</p>
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
      <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
        <SectionHeader eyebrow="Narx" title="Bepul boshla" />

        <div className="mt-6 flex flex-wrap items-center gap-3 font-ui text-[12px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            14 kun pul qaytadi
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Bir bosishda bekor
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Kartasiz sinov
          </span>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <PricingCard
            title="Free"
            price="0 so'm"
            period="doimiy"
            features={[
              "3 ta kunlik mikro-missiya",
              "Streak, XP, intizom",
              "Nadir asosiy suhbat",
              "Kundalik + kayfiyat",
              "PWA",
            ]}
            cta="Boshlash"
            variant="outline"
          />
          <PricingCard
            title="Pro"
            price="49 000 so'm"
            period="oyiga"
            badge="Eng mashhur"
            features={[
              "Free'dagi hammasi",
              "Nadir Pro — kengroq kontekst",
              "Cheksiz odat va quest",
              "Haftalik AI hisobot",
              "Burnout signal",
            ]}
            cta="Pro'ga o'tish"
            variant="primary"
          />
          <PricingCard
            title="Yillik"
            price="490 000 so'm"
            period="yiliga"
            equivalent="2 oy tekin"
            features={[
              "Pro'dagi hammasi",
              "12 oy narxida 10",
              "Yillik retrospektiv",
              "Narx qotiriladi",
            ]}
            cta="Yillik olish"
            variant="outline"
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
  equivalent,
  features,
  cta,
  variant,
  badge,
}: {
  title: string;
  price: string;
  period: string;
  equivalent?: string;
  features: string[];
  cta: string;
  variant: "primary" | "outline";
  badge?: string;
}) {
  return (
    <div
      className={
        "relative h-full rounded-[var(--radius)] p-7 " +
        (variant === "primary"
          ? "border-2 border-primary bg-background shadow-[0_20px_60px_-30px_hsl(var(--primary)/0.55)]"
          : "border border-border bg-background")
      }
    >
      {badge && (
        <span className="absolute -top-3 left-6 rounded-full border border-primary bg-background px-2.5 py-0.5 font-ui text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
          {badge}
        </span>
      )}
      <h3 className="font-serif text-2xl">{title}</h3>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-serif text-3xl tracking-tight tabular-nums">{price}</span>
        <span className="font-ui text-sm text-muted-foreground">/ {period}</span>
      </div>
      {equivalent && (
        <p className="mt-1 font-ui text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          {equivalent}
        </p>
      )}
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
        <SectionHeader eyebrow="FAQ" title="Ko'p so'raladi" />
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

function Science() {
  const refs = [
    {
      claim: "Kunlik xulqning ~43% — ongsiz odat",
      src: "Wood et al., 2002",
      href: "https://doi.org/10.1037/0022-3514.83.6.1281",
    },
    {
      claim: "Odat avtomatlashuvi o'rtacha 66 kun",
      src: "Lally et al., 2010",
      href: "https://doi.org/10.1002/ejsp.674",
    },
    {
      claim: "\"Agar X — men Y\" niyati bajarilishni 2–3× oshiradi",
      src: "Gollwitzer, 1999",
      href: "https://doi.org/10.1037/0003-066X.54.7.493",
    },
    {
      claim: "Xulq = Motivatsiya × Qobiliyat × Ilgak",
      src: "Fogg, Stanford",
      href: "https://behaviormodel.org/",
    },
  ];
  return (
    <section id="science" className="border-b border-border">
      <div className="mx-auto max-w-4xl px-5 py-14 md:py-20">
        <SectionHeader eyebrow="Ilm" title="Nima uchun ishlaydi" />
        <ul className="mt-10 divide-y divide-border overflow-hidden rounded-[var(--radius)] border border-border">
          {refs.map((r, i) => (
            <Reveal key={i} delay={i * 60}>
              <li className="flex flex-col gap-1 bg-background p-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <p className="font-serif text-base leading-snug">{r.claim}</p>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-ui text-[11px] uppercase tracking-[0.16em] text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                >
                  {r.src}
                </a>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
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
