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
  "Motivatsiya tugaydi — tizim qoladi. Kuniga 3 ta 2-daqiqalik qadam, 9 shkalali psixologik xarita va Nadir AI mentor. Kartasiz, o'zbek tilida.";

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
        <PeerMirror />
        <ProofStrip />
        <Mechanism />
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
        {/* Identity trigger — kimga */}
        <p className="rise-1 font-ui text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Boshlaganini oxiriga yetkazadigan odamlar uchun
        </p>

        {/* 5-sekundli xabar: muammo → yechim */}
        <h1 className="mt-5 font-serif text-[36px] leading-[1.03] tracking-tight text-balance sm:text-5xl md:text-[64px]">
          <span className="rise-2 inline-block">Motivatsiya tugaydi.</span>
          <br />
          <span className="rise-3 inline-block text-muted-foreground">Tizim qoladi.</span>
        </h1>

        {/* Aniq va'da — cheklangan, o'lchanadigan */}
        <p className="rise-4 mx-auto mt-6 max-w-lg text-[16px] leading-relaxed text-foreground/85 text-pretty">
          Kuniga 3 ta 2-daqiqalik qadam. 9 shkala bo'yicha psixologik xarita.
          Nadir AI — <span className="text-foreground">motivatsion so'zlar emas</span>,
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
            <a href="#mechanism">Nima uchun ishlaydi</a>
          </Button>
        </div>

        {/* Xavfsizlik — friksiyani nolga tushirish */}
        <p className="rise-4 mt-5 font-ui text-xs text-muted-foreground">
          Kartasiz · Reklamasiz · Bir bosishda o'chirasan · O'zbek tilida
        </p>

        <div className="rise-4 mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-x-5 gap-y-2 font-ui text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-primary/70" /> Ma'lumot sotilmaydi</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-primary/70" /> Notifikatsiya bosimi yo'q</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-primary/70" /> Toshkentda qurilgan</span>
        </div>
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

  // If DB is unreachable or completely empty, show honest early-stage framing.
  const hasReal = (members ?? 0) > 0;

  return (
    <section className="border-b border-border bg-background/60">
      <div className="mx-auto max-w-5xl px-5 py-8 md:py-10">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-2 font-ui text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Live · Hozirgi holat
          </div>
          <dl className="grid w-full grid-cols-3 gap-4 sm:w-auto sm:gap-8">
            <div>
              <dt className="font-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Sizga o'xshash
              </dt>
              <dd className="mt-1 font-serif text-xl tracking-tight tabular-nums">
                {hasReal ? members : "Beta"}
              </dd>
            </div>
            <div>
              <dt className="font-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Bugun tizimda
              </dt>
              <dd className="mt-1 font-serif text-xl tracking-tight tabular-nums">
                {hasReal ? (todayActive ?? 0) : "—"}
              </dd>
            </div>
            <div>
              <dt className="font-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Eng uzun streak
              </dt>
              <dd className="mt-1 font-serif text-xl tracking-tight tabular-nums">
                {hasReal ? `${streakLeader ?? 0} kun` : "—"}
              </dd>
            </div>
          </dl>
        </div>
        {!hasReal && (
          <p className="mt-4 text-center font-ui text-[11px] leading-relaxed text-muted-foreground sm:text-left">
            Erta bosqich · pilot foydalanuvchilar davri. Sonlar ochiq va real — soxta metrika yo'q.
          </p>
        )}
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
      <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
        <SectionHeader eyebrow="Narx" title="Bepul boshla — Pro'ga o'sib boradi" />

        {/* Risk reversal badge — Cialdini + loss aversion neutralizer */}
        <div className="mt-6 flex flex-wrap items-center gap-3 font-ui text-[12px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            14 kun — so'roqsiz pul qaytadi
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Bir bosishda bekor qilish
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Kartasiz sinov
          </span>
        </div>

        {/* 3 tarif: Free anchor low → Pro monthly target → Pro yearly value */}
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <PricingCard
            title="Free"
            price="0 so'm"
            period="doimiy"
            equivalent="Kartasiz"
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
            equivalent="~$3.9 / oy"
            badge="Eng mashhur"
            features={[
              "Free rejadagi hammasi",
              "Nadir Pro — kengroq kontekst",
              "Cheksiz odat va quest",
              "Haftalik AI hisobot",
              "Burnout signal + nudge",
            ]}
            cta="Pro'ga o'tish"
            variant="primary"
          />
          <PricingCard
            title="Pro Yillik"
            price="490 000 so'm"
            period="yiliga"
            equivalent="~40 800 so'm / oy · 2 oy tekin"
            features={[
              "Pro'dagi hammasi",
              "12 oy narxida 10 oy",
              "Yillik retrospektiv hisobot",
              "Muddatidan avval kirish — yangi modullar",
              "Bir yil davomida narx qotiriladi",
            ]}
            cta="Yillik olish"
            variant="outline"
          />
        </div>
        <p className="mt-6 font-ui text-[11px] leading-relaxed text-muted-foreground">
          Yillik narx = oylikning 10 barobari (12 oy o'rniga). Har oyni alohida to'lasang ~588 000 so'm — yillikda 98 000 so'mni saqlaysan.
        </p>
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

function Mechanism() {
  const nodes = [
    { k: "Ilgak", d: "Vaqt / joy / oldingi harakat" },
    { k: "Xohish", d: "Bosh miya dopamin bilan javob beradi" },
    { k: "Harakat", d: "2 daqiqadan kam — mikro-qadam" },
    { k: "Mukofot", d: "Streak + XP → halqa yopiladi" },
  ];
  return (
    <section id="mechanism" className="border-b border-border">
      <div className="mx-auto max-w-5xl px-5 py-14 md:py-20">
        <SectionHeader eyebrow="Mexanizm" title="Odat halqasi — 4 tugun" />
        <div className="mt-10 grid gap-3 md:grid-cols-4">
          {nodes.map((n, i) => (
            <Reveal key={n.k} delay={i * 80}>
              <div className="relative rounded-[var(--radius)] border border-border bg-background p-5">
                <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-primary">
                  0{i + 1}
                </p>
                <h3 className="mt-2 font-serif text-lg">{n.k}</h3>
                <p className="mt-2 font-ui text-[13px] leading-relaxed text-muted-foreground">
                  {n.d}
                </p>
                {i < nodes.length - 1 && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 font-ui text-lg text-border md:block"
                  >
                    →
                  </span>
                )}
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 font-ui text-xs text-muted-foreground">
          Halqa yopiq — mukofot keyingi ilgakni kuchaytiradi. Manba: Duhigg, <em>The Power of Habit</em> (2012); Wood &amp; Rünger, <em>Annual Review of Psychology</em> (2016); Graybiel, <em>Annual Review of Neuroscience</em> (2008).
        </p>
      </div>
    </section>
  );
}

function Science() {
  const refs = [
    {
      claim: "Kunlik xulqning ~43% — ongsiz odat, qaror emas",
      src: "Wood, Quinn &amp; Kashy — J. Personality &amp; Social Psychology, 2002",
      href: "https://doi.org/10.1037/0022-3514.83.6.1281",
    },
    {
      claim: "Odat avtomatlashuvi o'rtacha 66 kun (18–254)",
      src: "Lally et al. — European J. Social Psychology, 2010",
      href: "https://doi.org/10.1002/ejsp.674",
    },
    {
      claim: "\"Agar X — men Y\" niyati bajarilishni 2–3× oshiradi",
      src: "Gollwitzer — American Psychologist, 1999",
      href: "https://doi.org/10.1037/0003-066X.54.7.493",
    },
    {
      claim: "Dopamin — mukofot bashorati xatosi, ilgak-mukofot bog'lanishi",
      src: "Schultz, Dayan &amp; Montague — Science, 1997",
      href: "https://doi.org/10.1126/science.275.5306.1593",
    },
    {
      claim: "Xulq = Motivatsiya × Qobiliyat × Ilgak (B=MAP)",
      src: "Fogg — Stanford Behavior Design Lab, 2009",
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
                  dangerouslySetInnerHTML={{ __html: r.src }}
                />
              </li>
            </Reveal>
          ))}
        </ul>
        <p className="mt-4 font-ui text-[11px] text-muted-foreground">
          Har havola — asl akademik manba. Marketing emas, mexanizm.
        </p>
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
