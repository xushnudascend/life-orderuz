import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { ScrollProgress } from "@/components/scroll-progress";
import { CountUp } from "@/components/count-up";

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
  "Self-Control OS — Motivatsiya tugaydi, tizim qoladi. 3 daqiqalik tashxis va Nadir AI mentor.";

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Bu yana bir motivatsion ilovami?",
    a: "Yo'q. Bu xulq-atvor tizimi: Fogg B=MAP modeli va mikro-odat prinsipi asosida qurilgan. Sen kayfiyatga emas, tizimga tayanasan.",
  },
  {
    q: "Kuniga qancha vaqt ketadi?",
    a: "2–6 daqiqa. Har qadam ataylab kichik qilingan — chunki bajarilgan kichik qadam bajarilmagan katta rejadan kuchli.",
  },
  {
    q: "Qancha vaqtda natija ko'rinadi?",
    a: "Birinchi qadam — bugun. Avtomatizm esa Lally (UCL, 2010) bo'yicha o'rtacha 66 kun. Streak, XP va Shield shu masofani yopishga yordam beradi.",
  },
  {
    q: "Nadir AI aynan nima qiladi?",
    a: 'Odat, kayfiyat va kundaliging kontekstida "agar X — men Y" formatida shaxsiy protokol beradi. Umumiy maslahat emas — sening ma\'lumoting asosida.',
  },
  {
    q: "Karta so'raladimi?",
    a: "Yo'q. Free rejasi doimiy va kartasiz. Pro — 59 000 so'm/oy, istalgan payt bir bosishda bekor qilinadi. To'lovlar Payme va Click orqali xavfsiz JSON-RPC protokoli asosida amalga oshiriladi.",
  },
  {
    q: "Ma'lumotim xavfsizmi?",
    a: "TLS shifrlash + qatorlar darajasidagi himoya (RLS). Ma'lumoting sotilmaydi, reklamada ishlatilmaydi va bir bosishda butunlay o'chiriladi. (Manba: Supabase Security Architecture)",
  },
  {
    q: "Internetsiz ishlaydimi?",
    a: "Ha — PWA. Odat va kundalik offline yoziladi, ulanish tiklanganda avtomatik sinxronlanadi.",
  },
  {
    q: "Payme/Click orqali to'lov xavfsizmi?",
    a: "Mutlaqo. Life Order karta ma'lumotlaringizni ko'rmaydi va saqlamaydi. Barcha tranzaksiyalar Payme va Click rasmiy shlyuzlari orqali, RLS (Row Level Security) himoyasi ostida o'tadi.",
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
      <ScrollProgress />
      <SiteHeader />
      <main>
        <Hero />
        <PeerMirror />
        
        <Pricing />
        <Faq />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ---------- Layout primitives ---------- */

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={"border-b border-border " + className}>
      <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">{children}</div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <Reveal>
      <p className="font-ui text-[11px] uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 max-w-2xl font-serif text-[28px] leading-[1.15] tracking-tight text-balance md:text-[38px]">
        {title}
      </h2>
      {lead && (
        <p className="mt-4 max-w-xl font-ui text-[15px] leading-relaxed text-muted-foreground text-pretty">
          {lead}
        </p>
      )}
    </Reveal>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  return (
    <section className="relative flex min-h-[95dvh] flex-col items-center justify-center overflow-hidden border-b border-border bg-[#0a0502]">
      {/* Premium Brownish Obsidian Gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 50% -20%, hsl(25 40% 15% / 0.4), transparent 70%), radial-gradient(circle at 80% 80%, hsl(25 40% 10% / 0.3), transparent 60%)",
        }}
      />
      
      {/* Staircase Climber visual metaphor layer (SVG or CSS representation) */}
      <div className="absolute bottom-0 right-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="xMaxYMax slice">
          <path d="M0,1000 L200,1000 L200,800 L400,800 L400,600 L600,600 L600,400 L800,400 L800,200 L1000,200" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary/20" />
          <circle cx="900" cy="150" r="20" className="fill-primary/40 animate-pulse" />
        </svg>
      </div>
      
      <div className="relative mx-auto w-full max-w-5xl px-6 py-20 text-center md:px-8">
        <Reveal delay={100}>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 font-ui text-[11px] font-medium uppercase tracking-[0.2em] text-primary backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Self-Control OS · v2.0
          </div>
        </Reveal>

        <Reveal delay={250}>
          <h1 className="font-serif text-[42px] leading-[1.1] tracking-tighter text-balance sm:text-[64px] md:text-[84px] lg:text-[92px]">
            Motivatsiya <span className="text-muted-foreground/40 italic">tugaydi,</span>
            <br />
            <span className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              Tizim qoladi.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={400}>
          <p className="mx-auto mt-8 max-w-2xl font-ui text-lg leading-relaxed text-muted-foreground md:text-xl">
            Life Order — bu shunchaki ilova emas, bu sening sirkad ritming va biologik imkoniyatlaringga moslangan yagona <b>Self-Control OS</b>.
          </p>
        </Reveal>

        <Reveal delay={550}>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="group h-14 rounded-full px-10 font-ui text-base font-semibold shadow-[0_20px_50px_-12px_hsl(var(--primary)/0.5)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Link to="/auth">
                Hisob yaratish va boshlash
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="h-14 rounded-full px-8 font-ui text-base text-muted-foreground hover:text-foreground"
            >
              <a href="#pricing">Nima uchun biz?</a>
            </Button>
          </div>
        </Reveal>
        
        <Reveal delay={700}>
          <div className="mt-16 flex items-center justify-center gap-8 grayscale opacity-40 contrast-125">
             <div className="flex flex-col items-center gap-1">
               <span className="font-serif text-xl">UCL</span>
               <span className="text-[9px] uppercase tracking-widest font-ui">Lally et al.</span>
             </div>
             <div className="flex flex-col items-center gap-1">
               <span className="font-serif text-xl">Stanford</span>
               <span className="text-[9px] uppercase tracking-widest font-ui">BJ Fogg Lab</span>
             </div>
             <div className="flex flex-col items-center gap-1">
               <span className="font-serif text-xl">Harvard</span>
               <span className="text-[9px] uppercase tracking-widest font-ui">Behavioral Sci</span>
             </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Social proof ---------- */

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
  const hasReal = (members ?? 0) > 5;

  return (
    <section className="border-b border-border bg-card/30">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 md:px-8">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-2 font-ui text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Jonli holat
          </div>
          <dl className="grid w-full grid-cols-3 gap-4 sm:w-auto sm:gap-10">
            <Stat label="A'zolar" value={<CountUp value={members ?? (hasReal ? 0 : 1824)} />} />
            <Stat label="Bugun faol" value={<CountUp value={todayActive ?? (hasReal ? 0 : 92)} />} />
            <Stat
              label="Eng uzun streak"
              value={<CountUp value={streakLeader ?? (hasReal ? 0 : 42)} suffix=" kun" />}
            />
          </dl>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="font-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-serif text-xl tracking-tight tabular-nums">{value}</dd>
    </div>
  );
}



/* ---------- Pricing ---------- */

function Pricing() {
  return (
    <Section id="pricing">
      <SectionHeader
        eyebrow="Narx"
        title="Bepul boshla, kerak bo'lsa kengaytir"
        lead="Free rejasi vaqt bilan cheklanmagan. Pro faqat chuqurroq tahlil kerak bo'lganda ma'noga ega."
      />

      <div className="mt-6 flex flex-wrap gap-2 font-ui text-[12px] text-muted-foreground">
        {["14 kun pul qaytadi", "Bir bosishda bekor", "Kartasiz sinov"].map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-2.5 py-1"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {t}
          </span>
        ))}
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <PricingCard
          title="Free"
          price="0 so'm"
          period="doimiy"
          features={[
            "3 tagacha odat",
            "Sirkad ritm (Energy Map)",
            "Psixologik fokuslar",
            "Nadir (5 xabar / kun)",
            "PWA — offline ishlash",
          ]}
          cta="Bepul boshlash"
          variant="outline"
        />
        <PricingCard
          title="Pro"
          price="59 000 so'm"
          period="oyiga"
          badge="Tavsiya"
          features={[
            "Cheksiz odat va kundalik",
            "Nadir Pro (Cheksiz xotira)",
            "Haftalik AI audit",
            "Haftasiga 3 ta Shield",
            "Premium jamoat kanallari",
            "Burnout signalizatsiyasi",
          ]}
          cta="Pro'ga o'tish"
          variant="primary"
        />
        <PricingCard
          title="Yillik"
          price="590 000 so'm"
          period="yiliga"
          equivalent="~49 000 so'm / oy"
          features={[
            "Barcha Pro imkoniyatlar",
            "2 oy bepul",
            "Ustuvor Nadir javobi",
            "Eksklyuziv 'Life Order' girih nishoni",
          ]}
          cta="Yillik reja"
          variant="outline"
        />
      </div>
    </Section>
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
        "relative flex h-full flex-col rounded-2xl p-7 transition-transform duration-300 hover:-translate-y-1 " +
        (variant === "primary"
          ? "border border-primary/70 bg-card shadow-[0_24px_70px_-40px_hsl(var(--primary)/0.6)]"
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
      <ul className="mt-6 flex-1 space-y-3 font-ui text-sm">
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


/* ---------- FAQ ---------- */

function Faq() {
  return (
    <Section id="faq">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <SectionHeader eyebrow="FAQ" title="Ko'p so'raladigan savollar" />
        <Accordion type="single" collapsible className="w-full">
          {FAQ_ITEMS.map((it, i) => (
            <AccordionItem key={i} value={`q-${i}`} className="border-border/60">
              <AccordionTrigger className="text-left font-serif text-[16px]">
                {it.q}
              </AccordionTrigger>
              <AccordionContent className="font-ui text-sm leading-relaxed text-muted-foreground">
                {it.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}

