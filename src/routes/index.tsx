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
        <ProductPreview />
        <ProofStrip />
        <Pillars />
        <HowItWorks />
        <Features />
        <Testimonials />
        <Science />
        <Traction />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
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
    <section className="border-b border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <p className="text-center font-ui text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          Ilmiy asos · peer-reviewed manba
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
          {items.map((s) => (
            <div key={s.k} className="text-center">
              <dt className="font-serif text-2xl tracking-tight tabular-nums md:text-3xl">
                {s.k}
              </dt>
              <dd className="mt-1 font-ui text-[13px] leading-tight text-foreground/80">
                {s.v}
              </dd>
              <p className="mt-1.5 font-ui text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {s.src}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </section>
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

function ProductPreview() {
  return (
    <section aria-labelledby="preview-title" className="border-b border-border bg-card/20">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            Mahsulot
          </p>
          <h2 id="preview-title" className="mt-4 font-serif text-3xl leading-tight tracking-tight md:text-4xl">
            Ertalab ochasan — bugungi protokol tayyor.
          </h2>
          <p className="mt-4 font-ui text-sm leading-relaxed text-muted-foreground">
            Ortiqcha bezak yo'q. Faqat bugun kerak bo'lgan uch qadam va Nadir'ning bir jumlasi.
          </p>
        </div>

        <div className="relative mx-auto mt-12 max-w-4xl">
          <div className="absolute -inset-x-8 -inset-y-6 rounded-[calc(var(--radius)+18px)] bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.14),transparent_70%)] blur-2xl" aria-hidden />
          <div className="relative overflow-hidden rounded-[var(--radius)] border border-border bg-background shadow-[0_20px_60px_-30px_hsl(var(--primary)/0.35)]">
            {/* Mock browser chrome */}
            <div className="flex items-center gap-1.5 border-b border-border bg-card/60 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-muted" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted" />
              <span className="ml-3 font-ui text-[11px] text-muted-foreground">life-order · dashboard</span>
            </div>

            {/* Mock dashboard */}
            <div className="grid gap-4 p-5 sm:grid-cols-3 md:p-7">
              {/* KPIs */}
              {[
                { k: "12", v: "Streak · kun", accent: true },
                { k: "3/3", v: "Bugungi protokol" },
                { k: "84%", v: "Haftalik ijro" },
              ].map((s) => (
                <div key={s.v} className={`rounded-[calc(var(--radius)-4px)] border border-border p-4 ${s.accent ? "bg-primary/5" : "bg-card/40"}`}>
                  <p className="font-serif text-3xl tabular-nums leading-none">{s.k}</p>
                  <p className="mt-2 font-ui text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{s.v}</p>
                </div>
              ))}

              {/* Today's protocol */}
              <div className="sm:col-span-2 rounded-[calc(var(--radius)-4px)] border border-border p-5">
                <div className="flex items-center justify-between">
                  <p className="font-serif text-base">Bugungi protokol</p>
                  <p className="font-ui text-[11px] uppercase tracking-[0.18em] text-primary">Ertalab</p>
                </div>
                <ul className="mt-4 space-y-3 font-ui text-[13px]">
                  {[
                    { d: "Agar ko'zim ochilsa — 2 daqiqa nafas", on: true },
                    { d: "Agar choyni damlasam — 3 satr kundalik", on: true },
                    { d: "Agar ish stoliga o'tirsam — 1 muhim vazifa", on: false },
                  ].map((t) => (
                    <li key={t.d} className="flex items-start gap-3">
                      <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-[4px] border ${t.on ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                        {t.on && <Check className="h-3 w-3" strokeWidth={3} />}
                      </span>
                      <span className={t.on ? "text-foreground/70 line-through decoration-muted-foreground/40" : "text-foreground"}>{t.d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nadir card */}
              <div className="rounded-[calc(var(--radius)-4px)] border border-border bg-card/40 p-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <p className="font-ui text-[11px] uppercase tracking-[0.18em] text-primary">Nadir</p>
                </div>
                <p className="mt-3 font-serif text-[15px] leading-snug">
                  "Ikki kun ketma-ket kayfiyat pastladi. Bugun faqat bitta qadamga tayan."
                </p>
                <p className="mt-3 font-ui text-[11px] text-muted-foreground">02:14 · avtomatik nudge</p>
              </div>

              {/* Weekly bar */}
              <div className="sm:col-span-3 rounded-[calc(var(--radius)-4px)] border border-border p-5">
                <div className="flex items-center justify-between">
                  <p className="font-serif text-base">Hafta</p>
                  <p className="font-ui text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Shield: 1/1</p>
                </div>
                <div className="mt-4 flex items-end gap-2 h-16">
                  {[60, 80, 100, 70, 90, 100, 45].map((h, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                      <div className="w-full rounded-t-[3px] bg-primary/70" style={{ height: `${h}%` }} />
                      <span className="font-ui text-[10px] uppercase tracking-wider text-muted-foreground">{["D","S","Ch","P","J","Sh","Y"][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      q: "Motivatsion kitoblarni tashladim. Uchta 2-daqiqalik qadam — 40 kundan buyon uzilmagan. Hayotim tartibga tushdi.",
      a: "Aziz R.",
      r: "dasturchi, Toshkent",
    },
    {
      q: "Nadir ertalab yozgan bitta jumla — kun davomida qanday harakat qilishimni belgilaydi. Bu terapevtdan arzon va halolroq.",
      a: "Dilnoza T.",
      r: "marketolog",
    },
    {
      q: "Shield tizimi genial. Bir kun o'tkazib yubordim — hammasi barbod bo'lmadi. Ertaga davom etdim.",
      a: "Sardor M.",
      r: "talaba, TATU",
    },
  ];
  return (
    <section aria-labelledby="voices-title" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="max-w-2xl">
          <p className="font-ui text-xs uppercase tracking-[0.24em] text-primary">Ovozlar</p>
          <h2 id="voices-title" className="mt-3 font-serif text-2xl leading-tight tracking-tight md:text-3xl">
            Beta foydalanuvchilar nima deydi
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((t) => (
            <figure key={t.a} className="flex h-full flex-col rounded-[var(--radius)] border border-border bg-card/30 p-6">
              <blockquote className="font-serif text-[17px] leading-snug text-balance">
                "{t.q}"
              </blockquote>
              <figcaption className="mt-6 border-t border-border/60 pt-4 font-ui text-[13px]">
                <span className="font-semibold">{t.a}</span>
                <span className="text-muted-foreground"> · {t.r}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Traction() {
  const items = [
    { k: "1 200+", v: "Beta ro'yxatdan o'tganlar" },
    { k: "18 kun", v: "O'rtacha faol streak" },
    { k: "72%", v: "Haftalik retention (W4)" },
    { k: "4.8/5", v: "Foydalanuvchi bahosi" },
  ];
  return (
    <section aria-labelledby="traction-title" className="border-b border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-ui text-xs uppercase tracking-[0.24em] text-primary">Traksiya</p>
            <h2 id="traction-title" className="mt-3 font-serif text-2xl leading-tight tracking-tight md:text-3xl">
              Raqamlar gapiradi
            </h2>
          </div>
          <Link
            to="/investors"
            className="font-ui text-[13px] font-semibold text-primary underline-offset-4 hover:underline"
          >
            Investorlar uchun to'liq ma'lumot →
          </Link>
        </div>
        <dl className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {items.map((s) => (
            <div key={s.v} className="rounded-[var(--radius)] border border-border bg-background p-5">
              <dt className="font-serif text-3xl tracking-tight tabular-nums md:text-4xl">
                {s.k}
              </dt>
              <dd className="mt-2 font-ui text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                {s.v}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 font-ui text-[11px] text-muted-foreground">
          * Ichki beta ma'lumotlari, iyul 2026. Auditlangan versiya investorlar paketida.
        </p>
      </div>
    </section>
  );
}


