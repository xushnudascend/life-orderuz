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
import { Check, ArrowRight, X } from "lucide-react";
import { uz } from "@/i18n";
import { CheckoutPanel } from "@/components/checkout-panel";
import { freeTierLimits, proTierLimits, pricing } from "@/lib/limits";

const SITE_URL = "https://life-orderuz.lovable.app";
const DESC =
  "Life Order narxlari. Free doimiy va kartasiz. Pro — kengroq AI konteksti, cheksiz odat, haftalik hisobot. 14 kunlik to'lovni qaytarish kafolati.";

const FAQ: { q: string; a: string }[] = [
  {
    q: "Free doimiy bo'lib qoladimi?",
    a: "Ha. Free reja doimiy — muddat cheklovi yo'q, karta so'ralmaydi, avtomatik to'lov yo'q.",
  },
  {
    q: "Pro va Free orasidagi asosiy farq nima?",
    a: "Free — kunlik chegaralar (10 odat, 20 mentor xabari, 3 kundalik). Pro — cheksiz, kengroq AI konteksti va haftalik AI hisobot.",
  },
  {
    q: "Istalgan paytda bekor qila olamanmi?",
    a: "Ha. Bir bosishda bekor qilinadi, joriy oy oxirigacha Pro imkoniyatlari saqlanadi.",
  },
  {
    q: "Agar yoqmasa pulim qaytariladimi?",
    a: "Birinchi to'lovdan keyin 14 kun ichida to'liq qaytarib beramiz. Batafsil — /refund.",
  },
];

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: `Narxlar — ${uz.brand.name}` },
      { name: "description", content: DESC },
      { property: "og:title", content: `Narxlar — ${uz.brand.name}` },
      { property: "og:description", content: DESC },
      { property: "og:url", content: `${SITE_URL}/pricing` },
      { property: "og:image", content: `${SITE_URL}/og/pricing.jpg` },
      { property: "og:type", content: "website" },
      { property: "twitter:card", content: "summary_large_image" },
      { property: "twitter:image", content: `${SITE_URL}/og/pricing.jpg` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/pricing` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: `${uz.brand.name} Pro`,
          description: DESC,
          brand: { "@type": "Brand", name: uz.brand.name },
          url: `${SITE_URL}/pricing`,
          offers: [
            {
              "@type": "Offer",
              name: "Pro — oylik",
              price: String(pricing.monthly.amount),
              priceCurrency: pricing.monthly.currency,
              url: `${SITE_URL}/pricing`,
              availability: "https://schema.org/InStock",
            },
            {
              "@type": "Offer",
              name: "Pro — yillik",
              price: String(pricing.yearly.amount),
              priceCurrency: pricing.yearly.currency,
              url: `${SITE_URL}/pricing`,
              availability: "https://schema.org/InStock",
            },
          ],
        }),
      },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  return (
    <div className="min-h-dvh bg-background text-foreground animate-fade-in">
      <SiteHeader
        nav={[
          { href: "/", label: "Bosh sahifa" },
          { href: "/#science", label: "Ilm" },
          { href: "/#faq", label: "Savollar" },
        ]}
        cta={{ label: "Kirish", to: "/auth" }}
      />
      <main>
        <Hero />
        <Anchor />
        <Plans />
        <Guarantee />
        <Compare />
        <CheckoutPanel />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}

function Anchor() {
  const items = [
    { label: "Shaxsiy koʻch (coach)", price: "500 000+", note: "so'm / oy" },
    { label: "Terapevt seansi", price: "300 000", note: "1 uchrashuv" },
    { label: "Kitob + kurs to'plami", price: "150 000", note: "bir martalik" },
    {
      label: "Life Order Pro",
      price: pricing.monthly.label,
      note: "oyiga · bekor qilinadi",
      accent: true,
    },
  ];
  return (
    <section className="border-b border-border bg-background-secondary">
      <div className="mx-auto max-w-5xl px-5 py-14">
        <div className="max-w-xl">
          <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-primary">Solishtir</p>
          <h2 className="mt-3 font-serif text-2xl leading-tight tracking-tight md:text-3xl">
            Xulq-atvor tizimi — bozordagi eng arzon yoʻl
          </h2>
          <p className="mt-3 font-ui text-sm text-muted-foreground leading-relaxed">
            AI mentor, kundalik tahlil va 66 kunlik protokol — bir kishilik koʻch narxining oʻndan
            bir qismida.
          </p>
        </div>
        <div className="mt-8 grid gap-px overflow-hidden rounded-[var(--radius)] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.label}
              className={
                "bg-background-primary p-5 " + (it.accent ? "ring-1 ring-inset ring-primary/40" : "")
              }
            >
              <p className="font-ui text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {it.label}
              </p>
              <p
                className={
                  "mt-2 font-serif text-2xl tracking-tight tabular-nums " +
                  (it.accent ? "text-primary" : "")
                }
              >
                {it.price}
              </p>
              <p className="mt-1 font-ui text-xs text-muted-foreground">{it.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Guarantee() {
  const items = [
    { t: "14 kun — pulni qaytarish", d: "Yoqmasa savolsiz qaytarib beramiz." },
    { t: "Kartasiz start", d: "Free rejim uchun karta so'ralmaydi." },
    { t: "Bir bosishda bekor", d: "Yashirin obuna yo'q, avto-uzaytirish shaffof." },
  ];
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-4xl px-5 py-12">
        <div className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-border bg-border sm:grid-cols-3">
          {items.map((g) => (
            <div key={g.t} className="bg-background p-5">
              <p className="font-serif text-base font-semibold">{g.t}</p>
              <p className="mt-1 font-ui text-xs text-muted-foreground leading-relaxed">{g.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-3xl px-5 pb-14 pt-20 text-center md:pt-24">
        <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Narxlar
        </p>
        <h1 className="mt-6 font-serif text-4xl leading-[1.05] tracking-tight md:text-5xl">
          Halol narx.
          <br />
          <span className="text-muted-foreground">Free — doimiy.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl font-ui text-muted-foreground leading-relaxed">
          Karta so'ralmaydi. Trial fokusi yo'q. Free bilan ish boshla — Pro kerak bo'lsa keyin.
        </p>
      </div>
    </section>
  );
}

function Plans() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-4xl px-5 py-16">
        <div className="grid gap-5 md:grid-cols-2">
          <Plan
            name="Free"
            price="0 so'm"
            tagline="Doimiy · Kartasiz"
            features={[
              `${freeTierLimits.habits} tagacha odat`,
              `Kunlik ${freeTierLimits.journalEntriesPerDay} ta kundalik yozuv`,
              `Nadir bilan kunda ${freeTierLimits.mentorMessagesPerDay} ta xabar`,
              "Kunlik 3 ta mikro-vazifa",
              "Streak, XP va intizom balli",
              "PWA — telefonga o'rnatiladi, offline ishlaydi",
            ]}
            ctaLabel="Bepul boshlash"
          />
          <Plan
            name="Pro"
            highlight
            price={pricing.monthly.label}
            tagline={`Yoki ${pricing.yearly.label} · 14 kun qaytarish`}
            features={[
              "Kutubxona: Barcha ilmiy manbalar",
              "Kurslar: 66 kunlik intizom kursi",
              "Cheksiz kundalik va odatlar",
              "Nadir Pro — chuqur xotira va tahlil",
              `Haftasiga ${proTierLimits.shieldPerWeek} ta Shield`,
              "Haftalik AI hisobot va tuzatish",
              "Burnout signal va oldindan nudge",
              "Reyting va davra kanallariga kirish",
              "Kengaytirilgan yutuqlar",
              "Ustuvor yordam",
            ]}
            ctaLabel="Pro ni tanlash"
          />
        </div>
        <p className="mt-6 text-center font-ui text-xs text-muted-foreground">
          Barcha narxlar QQS bilan · Istalgan paytda bekor qilinadi · Ma'lumot sotilmaydi
        </p>
      </div>
    </section>
  );
}

function Plan({
  name,
  price,
  tagline,
  features,
  ctaLabel,
  highlight,
}: {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  ctaLabel: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        "rounded-2xl p-6 " +
        (highlight ? "border-2 border-primary bg-background" : "border border-border bg-background")
      }
    >
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl">{name}</h2>
        {highlight && (
          <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 font-ui text-[10px] uppercase tracking-[0.18em] text-primary">
            Tavsiya
          </span>
        )}
      </div>
      <p className="mt-3 font-serif text-2xl tracking-tight tabular-nums">
        {name === "Pro" ? (
          <span className="flex flex-col">
            <span className="text-muted-foreground/50 line-through text-lg">
              {pricing.monthly.originalAmount.toLocaleString("uz-UZ")} so'm
            </span>
            <span>{price}</span>
          </span>
        ) : (
          price
        )}
      </p>
      <p className="mt-1 font-ui text-sm text-muted-foreground text-balance">
        {name === "Pro" ? "Yillik obunada yanada ko'proq tejamkorlik bilan" : tagline}
      </p>
      <ul className="mt-6 space-y-2.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3 font-ui text-sm">
            <Check
              className={
                "mt-0.5 h-4 w-4 shrink-0 " + (highlight ? "text-primary" : "text-muted-foreground")
              }
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Button
        asChild
        size="lg"
        variant={highlight ? "default" : "outline"}
        className="mt-8 w-full rounded-full font-ui font-semibold"
      >
        <Link to="/auth">
          {ctaLabel} <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

function Compare() {
  const rows: { label: string; free: string | boolean; pro: string | boolean }[] = [
    { label: "Odatlar soni", free: `${freeTierLimits.habits} ta`, pro: "Cheksiz" },
    { label: "Kunlik kundalik", free: `${freeTierLimits.journalEntriesPerDay} ta`, pro: "Cheksiz" },
    {
      label: "Nadir xabarlari / kun",
      free: `${freeTierLimits.mentorMessagesPerDay} ta`,
      pro: "Cheksiz",
    },
    { label: "Chuqur analitika va heatmap", free: false, pro: true },
    { label: "Shield / hafta", free: false, pro: `${proTierLimits.shieldPerWeek} ta` },
    { label: "Kengroq AI kontekst", free: false, pro: true },
    { label: "Haftalik AI hisobot", free: false, pro: true },
    { label: "Burnout oldindan nudge", free: false, pro: true },
    { label: "Davra kanallari — to'liq", free: false, pro: true },
    { label: "Ustuvor yordam", free: false, pro: true },
  ];
  return (
    <section className="border-b border-border bg-card/30">
      <div className="mx-auto max-w-4xl px-5 py-16">
        <div className="max-w-xl">
          <p className="font-ui text-xs uppercase tracking-[0.24em] text-primary">Batafsil</p>
          <h2 className="mt-3 font-serif text-2xl leading-tight tracking-tight md:text-3xl">
            Free vs Pro — solishtir
          </h2>
        </div>
        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-background-primary">
          <table className="w-full font-ui text-sm">
            <thead>
              <tr className="border-b border-border bg-background-tertiary">
                <th className="px-4 py-3 text-left font-semibold">Imkoniyat</th>
                <th className="px-4 py-3 text-center font-semibold">Free</th>
                <th className="px-4 py-3 text-center font-semibold text-primary">Pro</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.label} className={i % 2 === 0 ? "bg-background" : "bg-card/20"}>
                  <td className="px-4 py-3">{r.label}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">
                    <Cell v={r.free} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Cell v={r.pro} accent />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Cell({ v, accent }: { v: string | boolean; accent?: boolean }) {
  if (typeof v === "boolean") {
    return v ? (
      <Check className={"mx-auto h-4 w-4 " + (accent ? "text-primary" : "text-muted-foreground")} />
    ) : (
      <X className="mx-auto h-4 w-4 text-muted-foreground/40" />
    );
  }
  return <span className={accent ? "text-primary font-medium" : ""}>{v}</span>;
}

function Faq() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-2xl px-5 py-16">
        <p className="font-ui text-xs uppercase tracking-[0.24em] text-primary">Savollar</p>
        <h2 className="mt-3 font-serif text-2xl leading-tight tracking-tight md:text-3xl">
          Narx bo'yicha ko'p so'raladi
        </h2>
        <Accordion type="single" collapsible defaultValue="q-0" className="mt-8">
          {FAQ.map((it, i) => (
            <AccordionItem key={i} value={`q-${i}`} className="border-border/60">
              <AccordionTrigger className="text-left font-serif text-base">{it.q}</AccordionTrigger>
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
      <div className="mx-auto max-w-2xl px-5 py-16 text-center">
        <h2 className="font-serif text-2xl leading-tight tracking-tight md:text-3xl">
          Bepul boshla. Kerak bo'lsa keyin ko'tarasan.
        </h2>
        <Button asChild size="lg" className="mt-6 h-12 rounded-full px-6 font-ui font-semibold">
          <Link to="/auth">
            Bepul boshlash <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
