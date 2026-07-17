import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  Check,
  Brain,
  Target,
  Repeat,
  Shield,
  Flame,
  BarChart3,
  Sparkles,
  BookText,
  Clock,
  Lock,
} from "lucide-react";


const BRAND = "Life Order";
const SITE_URL = "https://life-orderuz.lovable.app";
const ONE_LINER =
  "Life Order — xulq-atvor tizimi. Trigger → mikro-harakat → tasdiq halqasi. Nadir AI mentor bilan. Bepul, kartasiz.";

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Life Order nima va boshqa ilovalardan qanday farq qiladi?",
    a: "Motivatsion ilova emas — xulq-atvor tizimi. BJ Fogg va James Clear tadqiqotlariga asoslangan: mikro-harakat (2 daqiqadan kam), aniq trigger va darhol tasdiq. Motivatsiyaga tayanmaydi — takror va kontekstga tayanadi.",
  },
  {
    q: "Odat qancha vaqtda mustahkamlanadi?",
    a: "Phillippa Lally (UCL, 2010) tadqiqotiga ko'ra o'rtacha 66 kun — lekin murakkabligiga qarab 18-254 kun oralig'ida. Life Order streak, XP va Shield tizimi orqali shu jarayonni boshqaradi.",
  },
  {
    q: "Nadir AI mentor nima qiladi?",
    a: "Sening ma'lumotlaring (odatlar, kayfiyat, streak, kundalik) asosida shaxsiy javob beradi. Burnout signallarini oldindan sezadi va \"agar X — men Y\" formatida aniq reja tuzadi.",
  },
  {
    q: "Bepulmi? Karta so'raladimi?",
    a: "Free reja doimiy va karta so'ralmaydi. Pro (49 000 so'm/oy) — kengroq AI konteksti, cheksiz odat, haftalik AI hisobot. Istalgan paytda bekor qilinadi.",
  },
  {
    q: "Ma'lumotlarim xavfsizmi?",
    a: "TLS shifrlash, RLS bilan izolyatsiya, sotilmaydi va reklama uchun ishlatilmaydi. Hisobingni bir bosishda o'chirasan — barcha ma'lumot 30 kun ichida yo'q qilinadi.",
  },
  {
    q: "Offline ishlaydimi?",
    a: "Ha — PWA sifatida telefonga o'rnatiladi. Odat belgilash va kundalik yozish offline ishlaydi, ulanish tiklanganda avtomatik sinxron.",
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
    <div className="min-h-screen bg-background text-foreground animate-fade-in">
      <SiteHeader />
      <main>
        <Hero />
        <ProofStrip />
        <Pillars />
        <HowItWorks />
        <Features />
        <Science />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}


function Header() {
  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="grid h-7 w-7 place-items-center rounded-[10px] bg-primary text-primary-foreground"
          >
            <span className="font-serif text-[15px] font-semibold leading-none">L</span>
          </span>
          <span className="font-serif text-lg font-bold tracking-tight">{BRAND}</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex font-ui text-sm text-muted-foreground">
          <a href="#how" className="hover:text-foreground transition-colors">Qanday ishlaydi</a>
          <a href="#features" className="hover:text-foreground transition-colors">Imkoniyatlar</a>
          <a href="#science" className="hover:text-foreground transition-colors">Ilm</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Narx</a>
          <a href="#faq" className="hover:text-foreground transition-colors">Savollar</a>
        </nav>
        <Button asChild size="sm" className="rounded-full font-ui font-semibold">
          <Link to="/auth">Boshlash</Link>
        </Button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="mx-auto max-w-4xl px-5 pb-16 pt-20 text-center md:pt-28">
        <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Beta · Xulq-atvor tizimi
        </p>
        <h1 className="mt-6 font-serif text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl">
          Motivatsiya tugaydi.<br />
          <span className="text-muted-foreground">Tizim qoladi.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl leading-relaxed text-muted-foreground text-pretty">
          Kuniga uchta 2-daqiqalik qadam. Nadir AI mentor — sening ma'lumotlaringga qarab
          shaxsiy protokol tuzadi. Streak, XP, Shield — naqsh mustahkamlanguncha.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="h-12 rounded-full px-6 font-ui font-semibold">
            <Link to="/auth">
              Bepul boshlash
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="h-12 rounded-full px-5 font-ui">
            <a href="#how">Qanday ishlaydi ↓</a>
          </Button>
        </div>
        <p className="mt-4 font-ui text-xs text-muted-foreground">
          60 soniyada · Kartasiz · O'zbek tilida
        </p>

        {/* Micro stats */}
        <dl className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-border pt-8 text-center">
          {[
            { k: "2 daq", v: "Mikro-harakat" },
            { k: "66 kun", v: "O'rtacha odat" },
            { k: "3×/kun", v: "Tasdiq halqasi" },
          ].map((s) => (
            <div key={s.k}>
              <dt className="font-serif text-2xl tabular-nums">{s.k}</dt>
              <dd className="mt-1 font-ui text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {s.v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Pillars() {
  const items = [
    {
      icon: Brain,
      title: "Ong",
      body: "Kundalik, kayfiyat, refleksiya. Miya nima kechayotganini ko'radi.",
    },
    {
      icon: Repeat,
      title: "Odat",
      body: "Trigger'ga bog'langan mikro-harakat. Motivatsiyaga tayanmaydi.",
    },
    {
      icon: Target,
      title: "Maqsad",
      body: "Katta niyat → haftalik quest → kunlik qadam. Zanjir uzilmaydi.",
    },
  ];
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-5xl px-5 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((it) => (
            <div key={it.title} className="rounded-[var(--radius)] border border-border p-6">
              <it.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-serif text-xl">{it.title}</h3>
              <p className="mt-2 font-ui text-sm leading-relaxed text-muted-foreground">
                {it.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Tashxis",
      body: "5 daqiqalik onboarding: arxetip, uyqu, energiya, zaif nuqta. Nadir profilni tuzadi.",
    },
    {
      n: "02",
      title: "Protokol",
      body: "Har kun 3 ta \"agar X — men Y\" formatidagi mikro-qadam. Sirkadian ritmga moslashgan.",
    },
    {
      n: "03",
      title: "Takror",
      body: "Har bajarilgan qadam → XP + streak. Shield tizimi bir kunlik xatoni kechiradi.",
    },
    {
      n: "04",
      title: "Tahlil",
      body: "Haftalik AI hisobot: nima ishladi, qayerda susaydik, keyingi hafta uchun tuzatish.",
    },
  ];
  return (
    <section id="how" className="border-b border-border">
      <div className="mx-auto max-w-5xl px-5 py-20">
        <SectionHeader
          eyebrow="Jarayon"
          title="4 bosqichli halqa"
          sub="Har bosqich keyingisini oziqlantiradi. Uzilish emas, davomiylik."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-[var(--radius)] border border-border p-6">
              <p className="font-ui text-xs uppercase tracking-[0.22em] text-primary">{s.n}</p>
              <h3 className="mt-3 font-serif text-lg">{s.title}</h3>
              <p className="mt-2 font-ui text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Sparkles, title: "Nadir AI mentor", body: "Sening ma'lumotlaring bilan gaplashadi. Umumiy maslahat emas — shaxsiy javob." },
    { icon: Flame, title: "Streak va XP", body: "Har bajarilgan mikro-qadam ballanadi. Yopilmagan kun — Shield sarflaydi, streak saqlanadi." },
    { icon: Shield, title: "Shield tizimi", body: "Haftada 1 kun \"kechirim\" — bitta xato butun mehnatni yo'q qilmaydi. 7 kunlik earn-back oynasi." },
    { icon: BookText, title: "Kundalik + kayfiyat", body: "3 satrlik kunlik yozuv. Nadir kayfiyat pastligini sezsa — muloyim nudge yuboradi." },
    { icon: Clock, title: "Sirkadian jadval", body: "Ertalab, kunduz, kech — har blokka moslashgan qadam. Biologik ritmga qarshi bormaymiz." },
    { icon: BarChart3, title: "Haftalik hisobot", body: "AI tuzgan tahlil: qaysi odat mustahkam, qaysi qulayapti, keyingi hafta uchun 1 ta tuzatish." },
    { icon: Target, title: "Quest tizimi", body: "Haftalik maqsad → kunlik mikro-qadam. Katta niyat kichkina harakatga aylanadi." },
    { icon: Lock, title: "Xavfsiz va shaxsiy", body: "RLS izolyatsiya, TLS shifrlash. Ma'lumotlar sotilmaydi, reklama uchun ishlatilmaydi." },
  ];
  return (
    <section id="features" className="border-b border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeader
          eyebrow="Nima bor"
          title="8 ta asosiy modul"
          sub="Har biri bir maqsad uchun. Bezak emas — mexanizm."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((f) => (
            <div key={f.title} className="rounded-[var(--radius)] border border-border bg-background p-5">
              <f.icon className="h-4 w-4 text-primary" />
              <h3 className="mt-3 font-serif text-base">{f.title}</h3>
              <p className="mt-1.5 font-ui text-[13px] leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Science() {
  const refs = [
    {
      k: "BJ Fogg",
      v: "Tiny Habits (Stanford)",
      d: "Mikro-harakat + trigger + tasdiq — motivatsiyadan qat'iy nazar takrorlanadi.",
    },
    {
      k: "James Clear",
      v: "Atomic Habits",
      d: "1% qoidasi: kichik takrorlar birlashib, identifikatsiyani o'zgartiradi.",
    },
    {
      k: "P. Lally",
      v: "UCL, 2010",
      d: "Yangi odat o'rtacha 66 kun (18-254) da avtomatik holatga o'tadi.",
    },
    {
      k: "W. Wood",
      v: "USC, 2019",
      d: "Kunlik xulqning ~43% odat — irodaga emas, kontekstga bog'liq.",
    },
  ];
  return (
    <section id="science" className="border-b border-border">
      <div className="mx-auto max-w-5xl px-5 py-20">
        <SectionHeader
          eyebrow="Ilmiy asos"
          title="Sinalgan tadqiqotga tayanadi"
          sub="Har mexanizm ortida peer-reviewed ish. Sehr emas — takrorlanadigan naqsh."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {refs.map((r) => (
            <div key={r.k} className="rounded-[var(--radius)] border border-border p-5">
              <p className="font-ui text-xs uppercase tracking-[0.22em] text-primary">{r.k}</p>
              <p className="mt-1 font-serif text-base">{r.v}</p>
              <p className="mt-2 font-ui text-[13px] leading-relaxed text-muted-foreground">
                {r.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="border-b border-border">
      <div className="mx-auto max-w-4xl px-5 py-20">
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
              "Kundalik va kayfiyat kuzatuvi",
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
              "Nadir Pro — kengroq kontekst va tarix",
              "Cheksiz odat va quest",
              "Haftalik AI hisobot va tuzatish",
              "Burnout signal va oldindan nudge",
              "Reyting va davra kanallariga to'liq kirish",
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
    <section id="faq" className="border-b border-border">
      <div className="mx-auto max-w-2xl px-5 py-20">
        <SectionHeader eyebrow="Savollar" title="Ko'p so'raladi" />
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

function FinalCta() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
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

function Footer() {
  const links = [
    { href: "/pricing", label: "Narxlar" },
    { href: "/blog/hayot-sohalari", label: "Blog" },
    { href: "/security", label: "Xavfsizlik" },
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
    { href: "/refund", label: "Refund" },
    { href: "/auth", label: "Kirish" },
  ];
  return (
    <footer>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 font-ui text-xs text-muted-foreground">
        <p>© 2026 {BRAND} · Toshkent</p>
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
