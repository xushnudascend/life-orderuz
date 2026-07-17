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
  "Life Order — xulq-atvor dizayni asosidagi o'z-o'zini boshqarish tizimi. Trigger tashxisi, kunlik uchta mikro-qadam va halol AI mentor Nadir. Miyyaning odat halqasini qayta quradi. 60 soniyada boshla, kartasiz.";

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Life Order aslida nima?",
    a: "Bu — motivatsion ilova emas, xulq-atvor tizimi. Stanford'ning Behavior Design (BJ Fogg) va identity-based habits (James Clear) tamoyillari asosida qurilgan: trigger → mikro-harakat → tasdiq. Motivatsiya to'lqinlariga tayanmaydi.",
  },
  {
    q: "Nega motivatsion video va kurslardan farq qiladi?",
    a: "Motivatsiya — hissiyot. Hissiyot 72 soatda so'nadi (affective forecasting tadqiqotlari). Life Order o'rniga takrorlanadigan mikro-harakatlarni o'rnatadi — miyyada bazal ganglii orqali avtomatlashadi. Phillippa Lally (UCL, 2010) tadqiqotiga ko'ra, odat o'rtacha 66 kunda ildiz otadi.",
  },
  {
    q: "Bepulmi? Kartaga bog'lash kerakmi?",
    a: "Ha, bepul. Free reja doimiy — karta so'ralmaydi, avtomatik to'lov yo'q. Bu ongli qaror: qaramlik emas, tanlov iqtisodini himoya qilamiz.",
  },
  {
    q: "Kim uchun mos?",
    a: "16–30 yosh oralig'idagi, o'zida telefon qaramligi, prokrastinatsiya yoki tarqoq diqqatni tan olgan har bir kishi uchun. Kim o'zini o'zgartirishga tayyor, lekin qaydan boshlashni bilmaydi.",
  },
  {
    q: "Ma'lumotlarim xavfsizmi?",
    a: "Ha. Ma'lumot shifrlangan, reklamachilarga sotilmaydi, uchinchi tomon trekerlari yo'q. Istalgan paytda hisobingni va tarixingni bir bosishda o'chirishing mumkin.",
  },
  {
    q: "Qancha vaqt talab qilinadi?",
    a: "Kuniga 10–15 daqiqa. Ataylab qisqa: BJ Fogg Tiny Habits usuli — mikro-harakat yengil bo'lsa, miyya qarshilik ko'rsatmaydi va takror avtomatlashadi.",
  },
];


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${BRAND} — Motivatsiya emas, tizim. Miyyani qayta dasturla.` },
      { name: "description", content: ONE_LINER },
      { property: "og:title", content: `${BRAND} — Motivatsiya emas, tizim. Miyyani qayta dasturla.` },
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
        <ProblemsGrid />
        <DashboardPreview />
        <SocialProof />
        <ProblemDeep />
        <TurningPoint />
        <ThreePillars />
        <HowItWorks />
        <ScienceBase />
        <FeaturesGrid />
        <EarlyMembers />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

/* ================= C.1 — Header ================= */
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

/* ================= C.2 — Hero ================= */
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
            Behavior Design · Habit Science · Beta
          </p>
          <h1 className="mt-5 font-serif text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl">
            Motivatsiya emas — miyya arxitekturasi.
          </h1>
          <p className="mt-4 font-serif text-2xl leading-tight text-muted-foreground sm:text-3xl">
            Iroda tugaydi. Tizim qoladi.
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty md:text-lg">
            Life Order xulq-atvor dizayni (Stanford Behavior Design Lab) va odatlar ilmiga tayanadi: trigger → mikro-harakat → tasdiq. Har kuni uchta aniq qadam, halol AI mentor Nadir. Ikki oy — va o'zingni tanimaysan. 60 soniyada boshla, kartasiz.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-full font-ui font-semibold">
              <Link to="/auth">
                Bepul tashxis olish
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="h-12 rounded-full font-ui">
              <a href="#how-it-works">Ilmiy asosini ko'r</a>
            </Button>
          </div>
          <p className="mt-5 font-ui text-xs text-muted-foreground">
            Kartasiz · Reklama trekerlari yo'q · O'zbek tilida
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

/* ================= C.3 — Problems grid ================= */
function ProblemsGrid() {
  const items = [
    {
      n: "01",
      title: "Dofamin halqasi",
      body:
        "Har swipe — kutilmagan mukofot. Miyya bu naqshni saqlaydi (Schultz, 1997). Life Order shu halqani tanib, uni foydali harakatga ulaydi.",
    },
    {
      n: "02",
      title: "Kechiktirish (akrasia)",
      body: "Uzoq foyda vs bugungi qulaylik — miyya bugunni tanlaydi (temporal discounting). Mikro-qadam — 2 daqiqalik — qarshilikni sindiradi.",
    },
    {
      n: "03",
      title: "Qaror charchog'i",
      body:
        "Kuniga 35 000 ta qaror miyya resursini tugatadi. Life Order 3 ta muhim qaror qoldiradi, qolganini avtomatlashtiradi.",
    },
  ];
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((i) => (
            <article
              key={i.n}
              className="rounded-[var(--radius)] border border-border/60 bg-card/40 p-7 transition-colors hover:border-border"
            >
              <p className="font-ui text-xs uppercase tracking-[0.24em] text-primary">{i.n}</p>
              <h2 className="mt-4 font-serif text-2xl leading-tight">{i.title}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{i.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= C.4 — Dashboard preview ================= */
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

/* ================= C.5 — Halol ijtimoiy dalil ================= */
function SocialProof() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <p className="font-serif text-2xl leading-relaxed text-pretty">
          Birinchi to'lqin ichkarida. Sen ham shu safda.
        </p>
        <p className="mt-4 font-ui text-sm text-muted-foreground">
          Soxta iqtiboslar, soxta raqamlar yo'q. Birinchi ijtimoiy dalil — sening 30-kunlik natijang bo'ladi.
        </p>
      </div>
    </section>
  );
}

/* ================= C.6 — Muammo (chuqurroq) ================= */
function ProblemDeep() {
  const list = [
    "Bugungi vazifani ertaga surdim (yana)",
    "Sport zaliga 4 kun bordim, 5-kuni tashladim",
    "Kitob 40-sahifada — 3 oydan beri",
    "Ekran vaqti kuniga 6+ soat",
    "Tengdoshlarim oldga ketmoqda, men joyimda",
    "Rejalar aniq — bajarish esa yo'q",
  ];
  return (
    <section className="border-t border-border bg-card/30">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="font-serif text-3xl leading-tight tracking-tight text-balance md:text-4xl">
            Har dushanba yangi hayot.
            <br />
            <span className="text-muted-foreground">Har juma o'sha eski sen.</span>
          </h2>
          <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
            Muammo — irodangda emas. Muammo — miyya ehtiyot rejim (default mode) tanlaganida. Motivatsion kontent bir necha kunda so'nadi (hedonic adaptation). Doimiy o'zgarish uchun kontent emas — arxitektura kerak.
          </p>
        </div>
        <ul className="space-y-3">
          {list.map((l) => (
            <li key={l} className="flex items-start gap-3 font-ui text-sm">
              <span className="mt-2 inline-block h-px w-4 bg-destructive/60" />
              <span className="leading-relaxed">{l}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ================= C.7 — Burilish nuqtasi ================= */
function TurningPoint() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h2 className="font-serif text-3xl leading-tight tracking-tight text-balance md:text-5xl">
          Muvaffaqiyatli odamlar irodaga tayanmaydi.
          <br />
          <span className="text-primary">Ular muhitni loyihalaydi.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl leading-relaxed text-muted-foreground text-pretty">
          Duke University tadqiqoti (Wendy Wood, 2019): kundalik xatti-harakatning <span className="text-foreground">43%</span> — ongli qaror emas, avtomatik odat. Ular ertalab "nima qilay?" demaydi — trigger allaqachon o'rnatilgan. Life Order shu arxitekturani telefoningga o'rnatadi.
        </p>
      </div>
    </section>
  );
}

/* ================= C.8 — Uch ustun ================= */
function ThreePillars() {
  const items = [
    {
      n: "01",
      icon: Sparkles,
      title: "AI Mentor — Nadir",
      body: "Halol koch: bahona qabul qilmaydi, bo'sh maqtov aytmaydi. Sokratik savol usuli bilan seni javob topishga majbur qiladi (metakognitiv treuning).",
    },
    {
      n: "02",
      icon: BarChart3,
      title: "Intizom o'lchovi",
      body: "Streak, bajarilish foizi, zaif kunlar, 0–100 bal. O'lchash — o'zgarishning shartidir (Hawthorne effekti + o'z-o'zini monitoring, Kanfer 1970).",
    },
    {
      n: "03",
      icon: Target,
      title: "Mikro-missiyalar",
      body: "Kuniga 3 ta 2–15 daqiqalik harakat. BJ Fogg Tiny Habits: kichik + oson = takrorlanadi = avtomatlashadi.",
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

/* ================= C.9 — How it works ================= */
function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Trigger tashxisi (60 soniya)",
      body: "9 ta ilmiy savol — uyqu, dofamin manbalari, prokrastinatsiya naqshi, energiya vaqti. Miyyangning zaif nuqtasini topamiz.",
    },
    {
      n: "02",
      title: "Shaxsiy protokol",
      body: "Nadir javoblaringga qarab implementation intention (Gollwitzer, 1999) tuzadi: \"Agar X bo'lsa — men Y qilaman\". Bu shakl bajarilishni 2–3 barobar oshiradi.",
    },
    {
      n: "03",
      title: "Takror, tasdiq, avtomatlashuv",
      body: "Har mikro-harakat XP va streak beradi — bazal ganglii bu naqshni tan oladi. UCL tadqiqoti: o'rtacha 66 kunda odat avtomatlashadi.",
    },
  ];
  return (
    <section id="how-it-works" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="max-w-3xl font-serif text-3xl leading-tight tracking-tight text-balance md:text-5xl">
          Uch qadam. Oltmish olti kun. Yangi arxitektura.
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

/* ================= C.9b — Ilmiy asos ================= */
function ScienceBase() {
  const refs = [
    {
      tag: "Behavior Design",
      title: "B = MAP",
      body: "BJ Fogg (Stanford, 2019): xatti-harakat = Motivatsiya × Qobiliyat × Prompt. Motivatsiya beqaror — biz Prompt va Ability'ni loyihalaymiz.",
    },
    {
      tag: "Identity habits",
      title: "1% qoidasi",
      body: "James Clear \"Atomic Habits\" (2018): odat — ovoz berish. Har bajarilgan mikro-harakat \"men shundayman\" identifikatsiyasini mustahkamlaydi.",
    },
    {
      tag: "UCL, 2010",
      title: "66 kun",
      body: "Phillippa Lally et al. — European Journal of Social Psychology: yangi odat avtomatlashuvi o'rtacha 66 kun (oraliq 18–254). Bir-ikki o'tkazib yuborish naqshni buzmaydi.",
    },
    {
      tag: "Implementation intention",
      title: "Agar X — men Y",
      body: "Peter Gollwitzer (1999): oldindan tuzilgan \"if-then\" reja bajarilish darajasini 2–3 barobar oshiradi (200+ tadqiqot meta-tahlili).",
    },
    {
      tag: "Neyrobiologiya",
      title: "Dofamin naqshi",
      body: "Wolfram Schultz (1997): dofamin mukofotning o'zi emas — mukofot bashoratidan chiqadi. Streak vizualizatsiyasi shu mexanizmni foydali yo'nalishga buradi.",
    },
    {
      tag: "Duke, 2019",
      title: "43%",
      body: "Wendy Wood: kundalik xatti-harakatning 43 foizi ongli qaror emas — odat. Uzoq muddatli o'zgarish ong emas, kontekst dizayni orqali quriladi.",
    },
  ];
  return (
    <section className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="max-w-2xl">
          <p className="font-ui text-xs uppercase tracking-[0.24em] text-primary">
            Ilmiy asos
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-tight tracking-tight text-balance md:text-4xl">
            Motivatsion sitatalar emas. Peer-reviewed tadqiqotlar.
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Life Order'ning har bir mexanizmi ortida — inson ongi, qaror qabul qilishi va miyya plastikligi bo'yicha o'nlab yillik tadqiqot bor. Buni bilishing shart emas — sistema ishlashi uchun. Lekin nima ustida qurilganini ko'rsatamiz.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {refs.map((r) => (
            <article
              key={r.title}
              className="rounded-[var(--radius)] border border-border/60 bg-background/60 p-6"
            >
              <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-primary">
                {r.tag}
              </p>
              <h3 className="mt-3 font-serif text-xl leading-tight">{r.title}</h3>
              <p className="mt-2 font-ui text-sm leading-relaxed text-muted-foreground">
                {r.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= C.10 — 6 karta funksiyalar grid ================= */
function FeaturesGrid() {
  const items = [
    { icon: Flame,     title: "Streak — variabel mukofot",  body: "BF Skinner tamoyili: kutilgan mukofot dofamin chiqaradi. Streak — bu senga tegishli, buzilishi og'ir bo'lgan aktiv." },
    { icon: Sparkles,  title: "AI Mentor — Nadir",           body: "Sokratik metod bilan ishlaydi: javob bermaydi — savol beradi. Metakognitiv treuning. Halol koch, bo'sh maqtov yo'q." },
    { icon: Target,    title: "Mikro-missiyalar",             body: "2–15 daqiqalik harakat. Fogg qoidasi: kichik + oson = takrorlanadi. Miyya qarshilik ko'rsatmaydi." },
    { icon: LineChart, title: "Haftalik tahlil",              body: "O'z-o'zini monitoring — o'zgarishning eng kuchli faktori (Michie et al., 2009 meta-tahlili). Kuchli kun, zaif kun, trend." },
    { icon: BookOpen,  title: "Bilim protokollari",           body: "Odat, fokus, uyqu bo'yicha qisqa, ilmiy asosli kurslar. Nazariya emas — bugun qo'llash uchun." },
    { icon: Users,     title: "Davra — social accountability", body: "Cialdini: majburiyat + omma > yolg'iz iroda. Kanallar, Party, Leaderboard — halol o'sish maydoni." },
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

/* ================= C.11 — Erta a'zolar (halollik) ================= */
function EarlyMembers() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <p className="font-serif text-xl leading-relaxed text-pretty">
          Iqtiboslar sotib olinmagan. Raqamlar bo'yalgan emas.
        </p>
        <p className="mt-4 font-ui text-sm text-muted-foreground leading-relaxed">
          Life Order beta bosqichida. Ijtimoiy dalil qurish — vaqt talab qiladi. Birinchi haqiqiy tavsiflar — sen va erta a'zolarning 30-kunlik natijalaridan chiqadi. Bo'sh gap emas, o'lchangan o'zgarish.
        </p>
      </div>
    </section>
  );
}

/* ================= C.12 — Narxlar ================= */
function Pricing() {
  return (
    <section id="pricing" className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-4xl px-5 py-20">
        <div className="grid gap-5 md:grid-cols-2">
          <PricingCard
            title="Free"
            price="0 so'm"
            period="har doim"
            features={[
              "Kunlik uchta missiya",
              "Streak va XP",
              "Asosiy AI mentor",
              "Davra chatiga kirish",
            ]}
            cta="Bepul boshlash"
            variant="outline"
          />
          <PricingCard
            title="Pro"
            price="49 000 so'm"
            period="oyiga · yillik obunada −40%"
            badge="Tavsiya"
            features={[
              "Free rejadagi hammasi",
              "Nadir Pro — chuqur tahlil",
              "Cheksiz missiya va odat",
              "Haftalik AI hisobot",
              "Kurs va kitoblarga to'liq kirish",
              "Ustuvor yordam",
            ]}
            cta="Pro rejani ko'rish"
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

/* ================= C.13 — FAQ ================= */
function Faq() {
  const items = [
    {
      q: "Life Order nima?",
      a: "Self-Control OS — o'z-o'zini boshqarishning operatsion tizimi. Trigger tahlili, kunlik uchta aniq qadam va halol AI mentor Nadir bir joyda birlashgan.",
    },
    {
      q: "Bepulmi?",
      a: "Ha. Free reja cheksiz ishlaydi. Karta so'ralmaydi, avtomatik to'lov yo'q.",
    },
    {
      q: "Kim uchun mos?",
      a: "O'zini o'zgartirmoqchi bo'lgan 16–30 yoshdagi har bir kishi uchun.",
    },
    {
      q: "Ma'lumotlarim xavfsizmi?",
      a: "Ha. Barcha ma'lumot shifrlangan, uchinchi tomonga sotilmaydi. Istalgan paytda o'chirish so'rovini yubor.",
    },
    {
      q: "Qancha vaqt kerak?",
      a: "Kuniga 10–15 daqiqa yetarli. Missiyalar qisqa va aniq.",
    },
  ];
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

/* ================= C.14 — Final CTA ================= */
function FinalCta() {
  return (
    <section className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h2 className="font-serif text-3xl leading-tight tracking-tight text-balance md:text-5xl">
          Oltmish kundan keyingi o'zingni bugun tanla.
        </h2>
        <p className="mx-auto mt-6 max-w-xl leading-relaxed text-muted-foreground text-pretty">
          Bepul. Kartasiz. Birinchi missiyang 60 soniyadan keyin qo'lingda.
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

/* ================= C.15 — Footer ================= */
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
        <p>© 2026 {BRAND} — Hayotingni tartibga sol</p>
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
