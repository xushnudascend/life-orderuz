import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal, TiltCard } from "@/components/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  Check,
  Repeat,
  Shield,
  Flame,
  BarChart3,
  Sparkles,
  BookText,
  Clock,
  Plus,
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
    a: "Free reja doimiy, karta so'ralmaydi. Pro (49 000 so'm/oy) — kengroq AI konteksti va haftalik hisobot. Istalgan paytda bekor qilinadi.",
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
    <div className="min-h-dvh bg-background text-foreground animate-fade-in">
      <SiteHeader />
      <main className="pb-24 md:pb-0">
        <Hero />
        <ProofStrip />
        <HowItWorks />
        <Features />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
      <StickyMobileCta />
    </div>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--px", `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--py", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, []);
  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden border-b border-border"
      style={{ ["--px" as never]: "50%", ["--py" as never]: "30%" }}
    >
      {/* Animated aurora + grid + spotlight */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora" />
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(600px circle at var(--px) var(--py), hsl(var(--primary) / 0.14), transparent 55%)",
          }}
        />
        {/* floating orbs */}
        <div className="orb-a absolute left-[8%] top-[15%] h-40 w-40 rounded-full bg-primary/25 blur-3xl" />
        <div className="orb-b absolute right-[10%] top-[45%] h-52 w-52 rounded-full bg-primary-glow/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-5 pb-14 pt-16 text-center md:pb-20 md:pt-28">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-ui text-[11px] uppercase tracking-[0.24em] text-primary/90">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Beta · Xulq-atvor tizimi
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-5 font-serif text-[36px] leading-[1.02] tracking-tight text-balance sm:text-5xl md:text-6xl">
            <span className="title-sweep">Motivatsiya tugaydi.</span>
            <br />
            <span className="text-muted-foreground">Tizim qoladi.</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground text-pretty">
            Kuniga uchta 2-daqiqalik qadam. Nadir AI mentor sen uchun shaxsiy protokol tuzadi.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <div className="mt-8 flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
            <Button asChild size="lg" className="h-12 rounded-full px-6 font-ui font-semibold btn-shine glow-amber">
              <Link to="/auth">
                Bepul boshlash
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="h-12 rounded-full px-5 font-ui">
              <a href="#how">Qanday ishlaydi ↓</a>
            </Button>
          </div>
        </Reveal>
        <Reveal delay={280}>
          <p className="mt-5 font-ui text-xs text-muted-foreground">
            60 soniyada · Kartasiz · O'zbek tilida
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function ProofStrip() {
  const items = [
    {
      k: "43%",
      v: "kunlik xulq — odat",
      src: "Wood, USC 2019",
      more: "Wendy Wood tadqiqoti: kundalik xatti-harakatlarimizning ~43% ongsiz takror — irodaga emas, kontekstga bog'liq.",
    },
    {
      k: "66 kun",
      v: "o'rtacha avtomatlashuv",
      src: "Lally, UCL 2010",
      more: "Yangi odat o'rtacha 66 kunda avtomatik holatga o'tadi. Diapazon: 18–254 kun. Life Order streak/Shield tizimi shu oynani boshqaradi.",
    },
    {
      k: "1%",
      v: "kunlik yaxshilanish",
      src: "J. Clear, 2018",
      more: "Har kuni 1% yaxshilansang — bir yilda 37×. Kichik takrorlar birlashib identifikatsiyani o'zgartiradi.",
    },
    {
      k: "B=MAP",
      v: "xulq formulasi",
      src: "BJ Fogg, Stanford",
      more: "Xulq = Motivatsiya × Ability × Prompt. Motivatsiya tushganda ham xulq saqlanishi uchun Ability yuqori, Prompt aniq bo'lishi kerak.",
    },
  ];
  return (
    <section className="border-b border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <p className="text-center font-ui text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          Ilmiy asos · peer-reviewed manba
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {items.map((s, i) => (
            <Reveal key={s.k} delay={i * 60}>
              <TiltCard className="h-full">
                <ExpandableStat {...s} />
              </TiltCard>
            </Reveal>
          ))}
        </dl>
        <p className="mt-4 text-center font-ui text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Kartochkani bos — batafsil
        </p>
      </div>
    </section>
  );
}

function ExpandableStat({
  k,
  v,
  src,
  more,
}: {
  k: string;
  v: string;
  src: string;
  more: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      className="group text-left rounded-[var(--radius)] border border-border bg-background/60 p-4 transition hover:border-primary/40 hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <div className="flex items-baseline justify-between gap-2">
        <dt className="font-serif text-2xl tracking-tight tabular-nums md:text-3xl">
          {k}
        </dt>
        <Plus
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-45" : ""}`}
          aria-hidden
        />
      </div>
      <dd className="mt-1 font-ui text-[13px] leading-tight text-foreground/80">{v}</dd>
      <p className="mt-1.5 font-ui text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {src}
      </p>
      <div
        className={`grid transition-all duration-300 ease-out ${open ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <p className="font-ui text-[12px] leading-relaxed text-muted-foreground">
            {more}
          </p>
        </div>
      </div>
    </button>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Tashxis",
      short: "5 daqiqalik onboarding: arxetip, uyqu, energiya, zaif nuqta.",
      more: "Nadir javoblardan profil quradi: sirkadian ritm, motivatsion arxetip (SDT), asosiy trigger nuqtalari. Bu keyingi barcha protokollarga asos.",
    },
    {
      n: "02",
      title: "Protokol",
      short: "Har kun 3 ta \"agar X — men Y\" formatidagi mikro-qadam.",
      more: "Gollwitzer (1999) implementation intentions: aniq trigger'ga bog'langan niyat oddiy niyatdan 2–3× ko'proq bajariladi. Har qadam <2 daqiqa.",
    },
    {
      n: "03",
      title: "Takror",
      short: "Har bajarilgan qadam → XP + streak. Shield xatoni kechiradi.",
      more: "Ferster & Skinner: darhol tasdiq (reinforcement) xulqni mustahkamlaydi. Shield tizimi \"all-or-nothing\" psixologik tuzoqni sindiradi.",
    },
    {
      n: "04",
      title: "Tahlil",
      short: "Haftalik AI hisobot: nima ishladi, qayerda susaydik.",
      more: "Nadir haftalik ma'lumotni tahlil qiladi: qaysi odat mustahkam, kayfiyat trendi, keyingi hafta uchun 1 aniq tuzatish.",
    },
  ];
  return (
    <section id="how" className="border-b border-border">
      <div className="mx-auto max-w-5xl px-5 py-14 md:py-20">
        <SectionHeader
          eyebrow="Jarayon"
          title="4 bosqichli halqa"
          sub="Har bosqich keyingisini oziqlantiradi. Kartochkani bos — batafsil."
        />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <ExpandableCard
              key={s.n}
              eyebrow={s.n}
              title={s.title}
              short={s.short}
              more={s.more}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      icon: Sparkles,
      title: "Nadir AI mentor",
      short: "Sening ma'lumotlaring bilan gaplashadi.",
      more: "Umumiy maslahat emas — kundalik, kayfiyat, streak va odatlaring kontekstida shaxsiy javob. Burnout signalini oldindan sezadi.",
    },
    {
      icon: Flame,
      title: "Streak va XP",
      short: "Har mikro-qadam ballanadi.",
      more: "Ketma-ket kunlar zanjiri — variable reward tizimi (Skinner). XP progressbari sifatida vizual tasdiq beradi.",
    },
    {
      icon: Shield,
      title: "Shield tizimi",
      short: "Haftada 1 kun kechirim.",
      more: "Bitta xato butun mehnatni yo'q qilmaydi. Bu \"nima bo'lsa ham davom etaman\" ustanovkasini o'rgatadi va tark etish darajasini kamaytiradi.",
    },
    {
      icon: BookText,
      title: "Kundalik + kayfiyat",
      short: "3 satrlik yozuv.",
      more: "Pennebaker (1997) expressive writing: qisqa reflektsiya stress markerlarini pasaytiradi. Nadir kayfiyat pastligini sezsa nudge yuboradi.",
    },
    {
      icon: Clock,
      title: "Sirkadian jadval",
      short: "Ertalab, kunduz, kech — o'z blogiga qadam.",
      more: "Circadian rhythm tadqiqotlariga muvofiq har blokka moslashgan qadam. Kognitiv unumdorlik pigida bajariladi.",
    },
    {
      icon: BarChart3,
      title: "Haftalik hisobot",
      short: "AI tahlili + 1 aniq tuzatish.",
      more: "Qaysi odat mustahkam, qayerda susayapsan, keyingi hafta uchun bitta konkret o'zgarish — ortiqcha ma'lumot yuklamaydi.",
    },
  ];
  return (
    <section id="features" className="border-b border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
        <SectionHeader
          eyebrow="Nima bor"
          title="Asosiy modullar"
          sub="Har biri bir maqsad uchun. Bezak emas — mexanizm."
        />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {items.map((f) => (
            <ExpandableFeature key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExpandableFeature({
  icon: Icon,
  title,
  short,
  more,
}: {
  icon: typeof Repeat;
  title: string;
  short: string;
  more: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      className="group text-left rounded-[var(--radius)] border border-border bg-background p-5 transition hover:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <div className="flex items-start justify-between gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <Plus
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-45" : ""}`}
          aria-hidden
        />
      </div>
      <h3 className="mt-3 font-serif text-base">{title}</h3>
      <p className="mt-1.5 font-ui text-[13px] leading-relaxed text-muted-foreground">
        {short}
      </p>
      <div
        className={`grid transition-all duration-300 ease-out ${open ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <p className="border-t border-border/60 pt-3 font-ui text-[12px] leading-relaxed text-foreground/70">
            {more}
          </p>
        </div>
      </div>
    </button>
  );
}

function ExpandableCard({
  eyebrow,
  title,
  short,
  more,
}: {
  eyebrow: string;
  title: string;
  short: string;
  more: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      className="relative text-left rounded-[var(--radius)] border border-border p-5 transition hover:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-ui text-xs uppercase tracking-[0.22em] text-primary">
          {eyebrow}
        </p>
        <Plus
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-45" : ""}`}
          aria-hidden
        />
      </div>
      <h3 className="mt-3 font-serif text-lg">{title}</h3>
      <p className="mt-2 font-ui text-[13px] leading-relaxed text-muted-foreground">
        {short}
      </p>
      <div
        className={`grid transition-all duration-300 ease-out ${open ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <p className="border-t border-border/60 pt-3 font-ui text-[12px] leading-relaxed text-foreground/70">
            {more}
          </p>
        </div>
      </div>
    </button>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="border-b border-border">
      <div className="mx-auto max-w-4xl px-5 py-14 md:py-20">
        <SectionHeader
          eyebrow="Narx"
          title="Bepul boshla, xohlasang chuqurlash"
          sub="Free doimiy. Pro — kengroq AI konteksti va cheksiz odat."
        />
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
              "Davra kanallariga to'liq kirish",
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

function FinalCta() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-3xl px-5 py-14 md:py-20 text-center">
        <h2 className="font-serif text-3xl leading-tight tracking-tight md:text-4xl">
          Ertaga emas, bugun bitta kichkina qadam.
        </h2>
        <p className="mx-auto mt-4 max-w-lg font-ui text-muted-foreground">
          60 soniya — profilingni tuzasan. Bugun kechqurun Nadir birinchi qadamingni beradi.
        </p>
        <Button asChild size="lg" className="mt-8 h-12 rounded-full px-7 font-ui font-semibold">
          <Link to="/auth">
            Bepul boshlash <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="font-ui text-xs uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-2xl leading-tight tracking-tight md:text-3xl">
        {title}
      </h2>
      {sub && (
        <p className="mt-3 font-ui text-sm leading-relaxed text-muted-foreground">{sub}</p>
      )}
    </div>
  );
}

function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-serif text-[15px] leading-tight">Bugun boshla</p>
          <p className="font-ui text-[11px] text-muted-foreground">
            60 soniya · Kartasiz
          </p>
        </div>
        <Button asChild size="sm" className="rounded-full px-5 font-ui font-semibold">
          <Link to="/auth">
            Bepul <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
