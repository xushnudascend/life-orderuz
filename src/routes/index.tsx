import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  Sparkles,
  BarChart3,
  Target,
  Flame,
  BookOpen,
  Users,
  Check,
  LineChart,
} from "lucide-react";

const BRAND = "Life Order";
const SITE_URL = "https://life-orderuz.lovable.app";
const ONE_LINER =
  "Life Order — o'z-o'zini boshqarish tizimi. Trigger tashxisi, kunlik uchta mikro-qadam va halol AI mentor Nadir. 60 soniyada boshla, kartasiz.";

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Life Order nima?",
    a: "Motivatsion ilova emas — xulq-atvor tizimi. Trigger → mikro-harakat → tasdiq halqasi ustida ishlaydi.",
  },
  {
    q: "Nega motivatsion kontentdan farq qiladi?",
    a: "Motivatsiya bir-ikki kunda so'nadi. Life Order o'rniga takrorlanadigan mikro-harakatlarni o'rnatadi — ular vaqt o'tishi bilan avtomatlashadi.",
  },
  {
    q: "Bepulmi?",
    a: "Ha. Free reja doimiy — karta so'ralmaydi, avtomatik to'lov yo'q.",
  },
  {
    q: "Kim uchun mos?",
    a: "Telefon qaramligi, prokrastinatsiya yoki tarqoq diqqatni tan olgan har bir kishi uchun.",
  },
  {
    q: "Ma'lumotlarim xavfsizmi?",
    a: "Ha. Shifrlangan, sotilmaydi, uchinchi tomon trekerlari yo'q. Hisobingni istalgan paytda o'chirasan.",
  },
  {
    q: "Qancha vaqt oladi?",
    a: "Kuniga 10–15 daqiqa. Ataylab qisqa — kichik harakat takrorlanadi.",
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
        <DashboardPreview />
        <ThreePillars />
        <HowItWorks />
        <FeaturesGrid />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}


/* ================= Header ================= */
function Header() {
  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2">
          <LogoMark />
          <span className="font-serif text-lg font-bold tracking-tight">{BRAND}</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="font-ui text-muted-foreground">
            <Link to="/auth">Kirish</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full font-ui font-semibold">
            <Link to="/auth">Boshlash</Link>
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

/* ================= Hero ================= */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px]"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 0%, hsl(var(--primary) / 0.10), transparent 60%)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-20 pt-16 md:grid-cols-[1.15fr_1fr] md:items-center md:pt-24">
        <div>
          <p className="flex items-center gap-2 font-ui text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
            Beta
          </p>
          <h1 className="mt-5 font-serif text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl">
            Motivatsiya tugaydi. <span className="text-muted-foreground">Tizim qoladi.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty md:text-lg">
            Har kuni uchta aniq qadam va halol AI mentor Nadir. 60 soniyada boshla — kartasiz.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-full font-ui font-semibold">
              <Link to="/auth">
                Bepul boshlash
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="h-12 rounded-full font-ui">
              <a href="#how-it-works">Qanday ishlaydi</a>
            </Button>
          </div>
          <p className="mt-5 font-ui text-xs text-muted-foreground">
            Kartasiz · O'zbek tilida
          </p>
        </div>
        <HeroOrnament />
      </div>
    </section>
  );
}

function HeroOrnament() {
  return (
    <div className="relative hidden aspect-square items-center justify-center md:flex">
      <div
        aria-hidden
        className="absolute inset-0 rounded-full opacity-40"
        style={{
          background:
            "conic-gradient(from 0deg, hsl(var(--primary) / 0.35), transparent 55%)",
          animation: "lo-spin-slow 24s linear infinite",
        }}
      />
      <div className="relative h-56 w-56 rounded-full border border-primary/40 bg-card/40" />
      <div className="absolute h-40 w-40 rounded-full border border-border" />
      <div className="absolute h-24 w-24 rounded-full border border-border/60" />
      <style>{`@keyframes lo-spin-slow{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/* ================= Dashboard preview ================= */
function DashboardPreview() {
  return (
    <section className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-4xl px-5 py-20">
        <div className="rounded-[var(--radius)] border border-border bg-background/60 p-6 md:p-8">
          <div className="flex items-center justify-between">
            <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              Bugungi kun
            </p>
            <p className="font-serif text-xl tabular-nums">
              <CountUp to={2} />/<span className="text-muted-foreground">3</span>
            </p>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <Stat label="Discipline" value={<CountUp to={74} />} />
            <Stat label="Streak" value={<><CountUp to={12} /> <span className="text-muted-foreground text-base">kun</span></>} />
            <Stat label="Bugungi XP" value={<><span className="text-primary">+</span><CountUp to={45} /></>} />
          </div>
          <ul className="mt-8 space-y-2">
            <PreviewTask done text="20 daqiqa yurish" tag="fizik" xp="+20" />
            <PreviewTask done text="10 daqiqa meditatsiya" tag="mental" xp="+25" />
            <PreviewTask text="1 sahifa journal" tag="mindset" xp="+30" />
          </ul>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-serif text-3xl tabular-nums">{value}</p>
    </div>
  );
}

function PreviewTask({ done, text, tag, xp }: { done?: boolean; text: string; tag: string; xp: string }) {
  return (
    <li className={"flex items-center justify-between rounded-md border border-border/60 bg-background p-3 " + (done ? "opacity-70" : "")}>
      <div className="flex items-center gap-3">
        <span className={"grid h-5 w-5 place-items-center rounded-full border " + (done ? "border-primary bg-primary text-primary-foreground" : "border-border")}>
          {done && <Check className="h-3 w-3" />}
        </span>
        <span className={"font-ui text-sm " + (done ? "line-through" : "")}>{text}</span>
        <span className="rounded-full border border-border px-2 py-0.5 font-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {tag}
        </span>
      </div>
      <span className="font-ui text-xs text-primary tabular-nums">{xp}</span>
    </li>
  );
}

function CountUp({ to }: { to: number }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0;
    let started = false;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (started) return;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          started = true;
          const start = performance.now();
          const dur = 900;
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(to * eased));
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);
  return <span ref={ref}>{n}</span>;
}

/* ================= Uch ustun ================= */
function ThreePillars() {
  const items = [
    {
      n: "01",
      icon: Sparkles,
      title: "AI Mentor — Nadir",
      body: "Halol koch. Bahona qabul qilmaydi, bo'sh maqtov aytmaydi.",
    },
    {
      n: "02",
      icon: BarChart3,
      title: "Intizom o'lchovi",
      body: "Streak, bajarilish foizi, 0–100 bal. O'lchash — o'zgarishning shartidir.",
    },
    {
      n: "03",
      icon: Target,
      title: "Mikro-missiyalar",
      body: "Kuniga 3 ta 2–15 daqiqalik harakat. Kichik + oson = takrorlanadi.",
    },
  ];
  return (
    <section className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((i) => {
            const Icon = i.icon;
            return (
              <article
                key={i.n}
                className="rounded-[var(--radius)] border border-border/60 bg-background/60 p-7"
              >
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-primary" strokeWidth={1.6} />
                  <span className="font-ui text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {i.n}
                  </span>
                </div>
                <h3 className="mt-6 font-serif text-2xl leading-tight">{i.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{i.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================= How it works ================= */
function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Tashxis",
      body: "Qisqa savollar orqali zaif nuqtangni topamiz.",
    },
    {
      n: "02",
      title: "Shaxsiy protokol",
      body: "Nadir sen uchun aniq \"agar X — men Y\" reja tuzadi.",
    },
    {
      n: "03",
      title: "Takror va avtomatlashuv",
      body: "Har mikro-harakat XP va streak beradi. Vaqt o'tishi bilan naqsh avtomatlashadi.",
    },
  ];
  return (
    <section id="how-it-works" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="max-w-3xl font-serif text-3xl leading-tight tracking-tight text-balance md:text-5xl">
          Uch qadam. Yangi arxitektura.
        </h2>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-[var(--radius)] border border-border/60 bg-card/40 p-7">
              <p className="font-ui text-xs uppercase tracking-[0.22em] text-primary">{s.n}</p>
              <h3 className="mt-4 font-serif text-xl">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= Features grid ================= */
function FeaturesGrid() {
  const items = [
    { icon: Flame,     title: "Streak",             body: "Kunlik uzluksiz naqsh. Buzilishi og'ir bo'lgan aktiv." },
    { icon: Sparkles,  title: "AI Mentor — Nadir",  body: "Savol beradi, bahona qabul qilmaydi." },
    { icon: Target,    title: "Mikro-missiyalar",   body: "2–15 daqiqalik harakatlar. Miyya qarshilik ko'rsatmaydi." },
    { icon: LineChart, title: "Haftalik tahlil",    body: "Kuchli kun, zaif kun, trend." },
    { icon: BookOpen,  title: "Bilim protokollari", body: "Odat, fokus va uyqu bo'yicha qisqa kurslar." },
    { icon: Users,     title: "Davra",              body: "Kanallar, Party va Leaderboard — halol o'sish maydoni." },
  ];
  return (
    <section className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map((i) => {
            const Icon = i.icon;
            return (
              <div key={i.title} className="rounded-[var(--radius)] border border-border/60 bg-background/60 p-6">
                <Icon className="h-5 w-5 text-primary" strokeWidth={1.6} />
                <h3 className="mt-4 font-serif text-lg">{i.title}</h3>
                <p className="mt-2 font-ui text-sm text-muted-foreground leading-relaxed">
                  {i.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================= Narxlar ================= */
function Pricing() {
  return (
    <section id="pricing" className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-4xl px-5 py-20">
        <div className="grid gap-5 md:grid-cols-2">
          <PricingCard
            title="Free"
            price="0 so'm"
            period="doimiy · karta so'ralmaydi"
            features={[
              "Kunlik 3 ta mikro-missiya",
              "Streak, XP, intizom balli",
              "Nadir bilan asosiy suhbat",
              "Davra kanallariga kirish",
            ]}
            cta="Bepul boshlash"
            variant="outline"
          />
          <PricingCard
            title="Pro"
            price="49 000 so'm"
            period="oyiga · yillikda −40%"
            badge="Chuqurroq ish"
            features={[
              "Free rejadagi hammasi",
              "Nadir Pro — kengroq kontekst",
              "Cheksiz missiya va odat",
              "Haftalik shaxsiy AI hisobot",
              "Barcha bilim protokollari",
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
  badge,
}: {
  title: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  variant: "primary" | "outline";
  badge?: string;
}) {
  const priceNumMatch = price.match(/(\d[\d\s]*)/);
  return (
    <div
      className={
        "relative rounded-[var(--radius)] p-7 " +
        (variant === "primary"
          ? "border-2 border-primary bg-background"
          : "border border-border bg-background")
      }
      style={variant === "primary" ? { boxShadow: "var(--shadow-glow)" } : undefined}
    >
      {badge && (
        <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-foreground">
          {badge}
        </span>
      )}
      <h3 className="font-serif text-2xl">{title}</h3>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-serif text-4xl tracking-tight tabular-nums">
          {priceNumMatch ? (
            <>
              <CountUp to={Number(priceNumMatch[1].replace(/\s/g, ""))} />
              <span>{price.replace(priceNumMatch[1], "")}</span>
            </>
          ) : (
            price
          )}
        </span>
      </div>
      <p className="mt-1 font-ui text-sm text-muted-foreground">{period}</p>
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

/* ================= FAQ ================= */
function Faq() {
  const items = FAQ_ITEMS;
  return (
    <section id="faq" className="border-t border-border">
      <div className="mx-auto max-w-3xl px-5 py-20">
        <h2 className="font-serif text-3xl leading-tight tracking-tight md:text-4xl">
          Ko'p so'raladiganlar
        </h2>
        <Accordion type="single" collapsible defaultValue="q-0" className="mt-8">
          {items.map((it, i) => (
            <AccordionItem key={i} value={`q-${i}`} className="border-border/60">
              <AccordionTrigger className="text-left font-serif text-lg">
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

/* ================= Final CTA ================= */
function FinalCta() {
  return (
    <section className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h2 className="font-serif text-3xl leading-tight tracking-tight text-balance md:text-5xl">
          Bugun boshla. Ertaga — kech.
        </h2>
        <p className="mx-auto mt-6 max-w-xl leading-relaxed text-muted-foreground text-pretty">
          60 soniyada tashxis. Bepul, kartasiz. Chiqib ketish bir bosishda.
        </p>
        <div className="mt-9">
          <Button asChild size="lg" className="h-14 rounded-full px-8 font-ui font-semibold">
            <Link to="/auth">
              Bepul boshlash
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ================= Footer ================= */
function Footer() {
  const links = [
    { href: "/pricing", label: "Narxlar" },
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
    { href: "/refund", label: "Refund" },
    { href: "/auth", label: "Kirish" },
  ];
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 font-ui text-xs text-muted-foreground">
        <p>© 2026 {BRAND}</p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="min-h-11 transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
