import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Brain,
  TrendingUp,
  Shield,
  Users,
  Sparkles,
  Target,
  Zap,
  CheckCircle2,
  BarChart3,
  Rocket,
  Lock,
  Globe,
  Mail,
  Download,
  FileText,
} from "lucide-react";
import { uz } from "@/i18n";

const SITE_URL = "https://life-orderuz.lovable.app";
const CANONICAL = `${SITE_URL}/investors`;

export const Route = createFileRoute("/investors")({
  head: () => ({
    meta: [
      { title: `Investorlar uchun — ${uz.brand.name}` },
      {
        name: "description",
        content:
          "Life Order — O'zbekistondagi birinchi xulq-atvor fanida asoslangan Self-Control OS. Bozor, mahsulot, traksiya va so'rov.",
      },
      { property: "og:title", content: `Investorlar — ${uz.brand.name}` },
      {
        property: "og:description",
        content:
          "$20 000 pre-seed · 12% ulush · 18 oylik reja. Xulq-atvor fani + AI + geymifikatsiya. Beta bosqichida.",
      },
      { property: "og:url", content: CANONICAL },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:image", content: "https://life-orderuz.lovable.app/og/investors.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://life-orderuz.lovable.app/og/investors.jpg" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
  }),
  component: InvestorsGate,
});

/** Kirish kodi — deck hech kimga ochiq ko'rinmasin. */
const ACCESS_CODE = "lifeorder2026";
const STORAGE_KEY = "lo_investor_access";

function InvestorsGate() {
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const fromUrl = url.searchParams.get("k");
    if (fromUrl === ACCESS_CODE) {
      sessionStorage.setItem(STORAGE_KEY, "1");
    }
    setUnlocked(sessionStorage.getItem(STORAGE_KEY) === "1");
    setReady(true);
  }, []);

  if (!ready) return <div className="min-h-dvh bg-background" />;

  if (!unlocked) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background px-6 text-foreground">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (code.trim() === ACCESS_CODE) {
              sessionStorage.setItem(STORAGE_KEY, "1");
              setUnlocked(true);
            } else {
              setError(true);
            }
          }}
          className="w-full max-w-sm rounded-2xl border border-border bg-card/60 p-6 text-center"
        >
          <Lock className="mx-auto h-5 w-5 text-primary" />
          <h1 className="mt-3 font-serif text-lg font-semibold">Konfidensial</h1>
          <p className="mt-1 font-ui text-[12px] text-muted-foreground">
            Bu sahifa faqat taklif qilingan investorlar uchun.
          </p>
          <input
            type="password"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(false);
            }}
            placeholder="Kirish kodi"
            aria-label="Kirish kodi"
            className="mt-4 w-full rounded-lg border border-border bg-background px-3 py-2 font-ui text-sm outline-none focus:border-primary"
          />
          {error && (
            <p className="mt-2 font-ui text-[11px] text-destructive">Kod noto'g'ri.</p>
          )}
          <button
            type="submit"
            className="mt-3 w-full rounded-lg bg-primary px-3 py-2 font-ui text-[12px] font-semibold text-primary-foreground"
          >
            Ochish
          </button>
          <Link
            to="/"
            className="mt-4 inline-block font-ui text-[11px] text-muted-foreground hover:text-foreground"
          >
            ← Bosh sahifa
          </Link>
        </form>
      </div>
    );
  }

  return <InvestorsPage />;
}

function InvestorsPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Sticky top badge */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link
            to="/"
            className="font-serif text-lg font-semibold tracking-tight hover:text-primary transition-colors"
          >
            {uz.brand.name}
          </Link>
          <span className="hidden sm:inline font-ui text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
            Investor deck · Konfidensial
          </span>
          <div className="flex items-center gap-2">
            <a
              href="/investor/life-order-deck.pptx"
              download
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 font-ui text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Download className="h-3 w-3" /> Deck
            </a>
            <a
              href="mailto:investors@life-order.uz"
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/50 bg-primary/10 px-3 py-1.5 font-ui text-[11px] font-semibold uppercase tracking-[0.2em] text-primary hover:bg-primary/20 transition-colors"
            >
              <Mail className="h-3 w-3" /> Bog'lanish
            </a>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        {/* Hero */}
        <section className="mb-20">
          <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
            Pre-seed · 18 oylik reja
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight sm:text-6xl">
            Motivatsiya tugaydi.
            <br />
            <span className="text-primary">Tizim qoladi.</span>
          </h1>
          <p className="mt-6 max-w-2xl font-ui text-lg leading-relaxed text-muted-foreground">
            Life Order — O'zbekistonda xulq-atvor fani (behavioral science) asosidagi shaxsiy
            operatsion tizim. Beta bosqichida, solo asoschi.
            <span className="text-foreground font-semibold">
              {" "}
              $20 000 pre-seed — 12% ulush evaziga, 18 oylik runway.
            </span>
          </p>

          {/* Micro-metrics — faqat isbotlangan raqamlar */}
          <div className="mt-10 grid gap-4 sm:grid-cols-4">
            <MicroStat k="66 kun" v="O'rtacha odat shakllanish (Lally, UCL)" />
            <MicroStat k="43%" v="Kunlik xulq — odat (Wood, USC)" />
            <MicroStat k="90M+" v="MDH smartfon foydalanuvchilari" />
            <MicroStat k="Beta" v="Mahsulot holati · Q1 2026 launch" />
          </div>

          {/* Primary CTAs — deck download */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="/investor/life-order-deck.pptx"
              download
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-ui text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Download className="h-4 w-4" /> Investor deck (.pptx)
            </a>
            <a
              href="/investor/life-order-infographic.pdf"
              download
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-ui text-sm font-semibold hover:border-primary/50 hover:text-primary transition-colors"
            >
              <FileText className="h-4 w-4" /> 1-betli infografika (PDF)
            </a>
            <a
              href="mailto:investors@life-order.uz"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-ui text-sm font-semibold hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" /> 30 daqiqalik suhbat
            </a>
          </div>
          <p className="mt-3 font-ui text-[11px] text-muted-foreground">
            Konfidensial · Faqat investor va sherik uchun · Halol raqamlar, mock yo'q
          </p>
        </section>

        {/* Muammo */}
        <Section eyebrow="01 · Muammo" title="Nima uchun odamlar o'zgara olmayapti">
          <div className="grid gap-6 sm:grid-cols-3">
            <ProblemCard
              icon={Zap}
              title="Motivatsiyaga tayanish"
              body="Motivatsiya — o'zgaruvchan holat. 90% foydalanuvchi 3 haftada tashlab qo'yadi. Rejalar bor — tizim yo'q."
            />
            <ProblemCard
              icon={Brain}
              title="Umumiy maslahatlar"
              body="YouTube, Instagram, kitoblar shaxsiy kontekstni bilmaydi. 'Erta tur' — kimga? qanday? nima uchun? — javob yo'q."
            />
            <ProblemCard
              icon={Globe}
              title="Til va madaniyat bo'shlig'i"
              body="MDH bozorida o'zbek/rus tilida, mahalliy kontekstga moslashtirilgan xulq-atvor mahsuloti yo'q. Headspace, Fabulous — inglizcha, G'arb kontekstida."
            />
          </div>
        </Section>

        {/* Yechim */}
        <Section eyebrow="02 · Yechim" title="Self-Control OS — 4 bosqichli halqa">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SolutionStep
              n="01"
              icon={Target}
              title="Tashxis"
              body="60 soniyalik onboarding — trigger, muammo, ritm. Har foydalanuvchi uchun boshlang'ich profil."
            />
            <SolutionStep
              n="02"
              icon={Zap}
              title="Protokol"
              body="Kundalik 3 aniq mikro-qadam (BJ Fogg formulasi). Motivatsiya kerak emas."
            />
            <SolutionStep
              n="03"
              icon={TrendingUp}
              title="Takror"
              body="Streak, XP, Shield tizimi. Dopamin halqasi — miya bog'lanishni tez o'rganadi."
            />
            <SolutionStep
              n="04"
              icon={Sparkles}
              title="AI mentor"
              body="Nadir — foydalanuvchi ma'lumotlariga kirishga ega AI. Umumiy emas — shaxsiy javob."
            />
          </div>
        </Section>

        {/* Isbot / Ilmiy asos */}
        <Section eyebrow="03 · Isbot" title="Nima uchun bu ishlaydi — ilmiy asos">
          <div className="grid gap-4 sm:grid-cols-2">
            <ProofCard
              source="BJ Fogg (Stanford)"
              claim="Tiny Habits — motivatsiyani almashtirmoq mumkin"
              detail="Kichik hajm + aniq trigger + darhol tasdiq = odatning eng kuchli formulasi. Life Order har bir odatni shu shaklda tuzadi."
            />
            <ProofCard
              source="James Clear (Atomic Habits)"
              claim="1% kunlik o'sish — 37x yillik natija"
              detail="Mikro-qadamlar tizimini geymifikatsiya bilan birlashtiramiz. XP + streak + shield — dopamin halqasi mustahkam."
            />
            <ProofCard
              source="Phillippa Lally (UCL)"
              claim="Odat shakllanishi — o'rtacha 66 kun"
              detail="Diapazon: 18-254 kun. Life Order aynan shu davrga mo'ljallangan — 90 kunlik yo'l xarita."
            />
            <ProofCard
              source="Wendy Wood (USC)"
              claim="Kunlik xulqning 43% — odat"
              detail="Ong emas — kontekst hal qiladi. Life Order kontekst dizaynini onboardingda o'lchaydi."
            />
          </div>
        </Section>

        {/* Bozor */}
        <Section eyebrow="04 · Bozor" title="TAM · SAM · SOM">
          <div className="grid gap-4 sm:grid-cols-3">
            <MarketCard
              tag="TAM"
              value="$4.2B"
              label="Global habit tracking + wellness apps (2025, Grand View Research)"
            />
            <MarketCard
              tag="SAM"
              value="$180M"
              label="MDH + Turkiya — behavioral wellness segmenti"
            />
            <MarketCard
              tag="SOM"
              value="$12M"
              label="O'zbekiston, Qozog'iston, Rossiya — 3 yillik erishish maqsadi"
            />
          </div>
          <p className="mt-6 font-ui text-sm text-muted-foreground leading-relaxed max-w-3xl">
            MDH mintaqasida 90M+ smartfon foydalanuvchisi. Rus va o'zbek tilida xulq-atvor
            mahsulotlari deyarli yo'q. G'arb ilovalari (Fabulous, Headspace, Notion) — inglizcha va
            boshqa madaniy kontekstda.
          </p>
        </Section>

        {/* Biznes modeli */}
        <Section eyebrow="05 · Biznes modeli" title="Freemium · Pro · Team">
          <div className="grid gap-4 sm:grid-cols-3">
            <PriceTier
              name="Free"
              price="0"
              body="Onboarding, 3 odat, Nadir kunlik 10 xabar. Viral halqa."
            />
            <PriceTier
              name="Pro"
              price="49 000"
              period="oy"
              body="Cheksiz odat, tahlil, Nadir cheksiz, Shield, milestone kartalar."
              highlight
            />
            <PriceTier
              name="Team / B2B"
              price="Q3 2026"
              body="Kompaniyalar uchun kollektiv paneli, HR integratsiyasi."
            />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <MicroStat k="Maqsad 5–8%" v="Free → Pro konversiya (industry: 3–5%)" />
            <MicroStat k="588 000 so'm" v="Rejalashtirilgan yillik ARPU (Pro)" />
            <MicroStat k="~$50/oy" v="Hozirgi umumiy infratuzilma xarajati" />
          </div>
          <p className="mt-4 font-ui text-[11px] text-muted-foreground">
            Konversiya va ARPU — prognoz. Hozircha to'lovlar hali qabul qilinmayapti.
          </p>
        </Section>

        {/* Traksiya — halol holat */}
        <Section eyebrow="06 · Hozirgi holat" title="Traksiya — halol">
          <div className="rounded-[var(--radius)] border border-border bg-card p-6">
            <ul className="space-y-3 font-ui text-sm leading-relaxed">
              <li className="flex gap-3">
                <span className="text-primary font-semibold">•</span>
                <span>
                  <span className="text-foreground font-semibold">Mahsulot:</span> Beta — 14+ modul
                  ishlab bo'lgan (dashboard, odat, jurnal, AI mentor, MCP integratsiya, PWA).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-semibold">•</span>
                <span>
                  <span className="text-foreground font-semibold">Foydalanuvchilar:</span> Yopiq
                  pilot bosqichida. Ommaviy raqamlar hali e'lon qilinmayapti — shaffoflik uchun.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-semibold">•</span>
                <span>
                  <span className="text-foreground font-semibold">Daromad:</span> $0 — hali
                  monetizatsiya yo'q. Free tarif ochiq, Pro Q1 2026'da.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-semibold">•</span>
                <span>
                  <span className="text-foreground font-semibold">Jamoa:</span> 1 asoschi (mahsulot
                  + injener + dizayn). Investment bilan 1 injener + marketing byudjeti.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-semibold">•</span>
                <span>
                  <span className="text-foreground font-semibold">Xarajat:</span> ~$50/oy
                  (Cloudflare + Supabase + AI gateway). Deyarli 0 burn.
                </span>
              </li>
            </ul>
          </div>
        </Section>

        {/* Product proof — mahsulot ishonchliligi */}
        <Section eyebrow="07 · Product proof" title="Nima ishlab bo'lingan — hozir jonli">
          <div className="grid gap-3 sm:grid-cols-2">
            <ProofRow text="60 soniyalik onboarding — 10 savol, aniq profil" />
            <ProofRow text="Nadir AI mentor — kontekstga ega chat, foydalanuvchi profilidan o'qiydi" />
            <ProofRow text="Odatlar, XP, Streak, Shield tizimi — jonli va tugallangan" />
            <ProofRow text="Cirkadiy jadval — kun ritmiga bog'langan vazifalar" />
            <ProofRow text="Burnout detection — proaktiv AI ogohlantirishlar" />
            <ProofRow text="Kundalik + haftalik AI tahlil hisobotlari" />
            <ProofRow text="Multi-tilli (Uz, Ru, En) — MDH bozori uchun tayyor" />
            <ProofRow text="PWA — offline ishlaydi, App Store'ga bog'liq emas" />
          </div>
        </Section>

        {/* Xavfsizlik */}
        <Section eyebrow="08 · Xavfsizlik" title="Ma'lumot va infratuzilma">
          <div className="grid gap-4 sm:grid-cols-3">
            <SecurityCard
              icon={Lock}
              title="RLS + audit"
              body="Har jadvalda Row-Level Security. Har hafta avtomatik xavfsizlik skani."
            />
            <SecurityCard
              icon={Shield}
              title="OAuth 2.1 + MCP"
              body="Google, Email. Agent integratsiyasi (MCP) OAuth bilan himoyalangan."
            />
            <SecurityCard
              icon={Globe}
              title="Edge infra"
              body="Cloudflare Workers + Supabase. Global CDN, PostgreSQL, real vaqt."
            />
          </div>
        </Section>

        {/* Ask */}
        <Section eyebrow="09 · So'rov" title="Pre-seed — $20 000">
          <div className="rounded-[var(--radius)] border border-primary/40 bg-primary/5 p-8">
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                  Miqdor
                </p>
                <p className="mt-2 font-serif text-4xl font-semibold">$20 000</p>
                <p className="mt-1 font-ui text-sm text-muted-foreground">Bir martalik pre-seed</p>
              </div>
              <div>
                <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                  Ulush
                </p>
                <p className="mt-2 font-serif text-4xl font-semibold">12%</p>
                <p className="mt-1 font-ui text-sm text-muted-foreground">
                  Kompaniya baholovi ~$167K
                </p>
              </div>
              <div>
                <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                  Runway
                </p>
                <p className="mt-2 font-serif text-4xl font-semibold">18 oy</p>
                <p className="mt-1 font-ui text-sm text-muted-foreground">~$1 100 / oy o'rtacha</p>
              </div>
            </div>
            <div className="mt-8 border-t border-primary/20 pt-6">
              <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                Taqsimot (18 oy)
              </p>
              <ul className="mt-3 grid gap-1.5 sm:grid-cols-2 font-ui text-sm">
                <li>• 40% ($8 000) — Marketing va foydalanuvchi jalb qilish</li>
                <li>• 25% ($5 000) — AI, infratuzilma, servis xarajatlari</li>
                <li>• 20% ($4 000) — Kontraktor (dizayn/injener yordami)</li>
                <li>• 10% ($2 000) — Yuridik, ro'yxatdan o'tish, litsenziyalar</li>
                <li>• 5% ($1 000) — Zaxira / kutilmagan xarajat</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Roadmap */}
        <Section eyebrow="10 · Roadmap" title="18 oylik yo'l xarita">
          <div className="space-y-3">
            <RoadmapRow
              period="0–3 oy"
              milestone="Public launch · Uzbekistonda beta yopiq guruhdan chiqish · Landing SEO"
            />
            <RoadmapRow
              period="3–6 oy"
              milestone="Birinchi 1 000 faol foydalanuvchi · Pro tarif ishga tushirish (Click/Payme)"
            />
            <RoadmapRow
              period="6–12 oy"
              milestone="5 000 foydalanuvchi · Birinchi $1K MRR · Rus tilida to'liq versiya"
            />
            <RoadmapRow
              period="12–18 oy"
              milestone="B2B pilot (2–3 kompaniya) · Series A/seed uchun metrikalar tayyor"
            />
          </div>
          <p className="mt-6 font-ui text-xs text-muted-foreground leading-relaxed max-w-3xl">
            Bu — prognoz, kafolat emas. Har bir bosqich hisobot bilan. Investor har chorak natija
            ko'radi.
          </p>
        </Section>

        {/* CTA */}
        <section className="mt-24 rounded-[var(--radius)] border border-border bg-card p-10 text-center">
          <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
            Keyingi qadam
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            30 daqiqalik suhbat
          </h2>
          <p className="mx-auto mt-3 max-w-lg font-ui text-sm text-muted-foreground leading-relaxed">
            Mahsulotni jonli ko'rsatamiz, savollaringizga javob beramiz, moliyaviy model va batafsil
            metrikalarni yuboramiz.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="mailto:investors@life-order.uz"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-ui text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Mail className="h-4 w-4" /> investors@life-order.uz
            </a>
            <a
              href="/investor/life-order-deck.pptx"
              download
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-ui text-sm font-semibold hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Download className="h-4 w-4" /> Deck yuklash
            </a>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-ui text-sm font-semibold hover:border-primary/50 hover:text-primary transition-colors"
            >
              Mahsulotni ko'rish <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <footer className="mt-16 border-t border-border pt-8 text-center">
          <p className="font-ui text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} {uz.brand.name}. Konfidensial. Investor uchun.
          </p>
        </footer>
      </main>
    </div>
  );
}

/* ============ Sub-components ============ */

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-20">
      <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function MicroStat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-[var(--radius)] border border-border bg-background/30 p-4">
      <p className="font-serif text-2xl font-semibold tabular-nums text-primary">{k}</p>
      <p className="mt-1 font-ui text-[11px] leading-relaxed text-muted-foreground">{v}</p>
    </div>
  );
}

function ProblemCard({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Zap;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[var(--radius)] border border-border bg-card p-5">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-4 font-serif text-lg font-semibold">{title}</p>
      <p className="mt-2 font-ui text-[13px] leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function SolutionStep({
  n,
  icon: Icon,
  title,
  body,
}: {
  n: string;
  icon: typeof Target;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[var(--radius)] border border-border bg-background/40 p-4">
      <div className="flex items-center justify-between">
        <Icon className="h-4 w-4 text-primary" />
        <span className="font-ui text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
          {n}
        </span>
      </div>
      <p className="mt-4 font-serif text-sm font-semibold">{title}</p>
      <p className="mt-1.5 font-ui text-[12px] leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function ProofCard({ source, claim, detail }: { source: string; claim: string; detail: string }) {
  return (
    <div className="rounded-[var(--radius)] border border-border bg-card p-5">
      <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
        {source}
      </p>
      <p className="mt-2 font-serif text-base font-semibold leading-snug">{claim}</p>
      <p className="mt-2 font-ui text-[13px] leading-relaxed text-muted-foreground">{detail}</p>
    </div>
  );
}

function MarketCard({ tag, value, label }: { tag: string; value: string; label: string }) {
  return (
    <div className="rounded-[var(--radius)] border border-border bg-background/30 p-5">
      <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
        {tag}
      </p>
      <p className="mt-2 font-serif text-3xl font-semibold tabular-nums">{value}</p>
      <p className="mt-2 font-ui text-[12px] leading-relaxed text-muted-foreground">{label}</p>
    </div>
  );
}

function PriceTier({
  name,
  price,
  period,
  body,
  highlight,
}: {
  name: string;
  price: string;
  period?: string;
  body: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-[var(--radius)] border p-5 ${
        highlight ? "border-primary/60 bg-primary/5" : "border-border bg-card"
      }`}
    >
      <p className="font-serif text-lg font-semibold">{name}</p>
      <p className="mt-3 font-serif text-3xl font-semibold tabular-nums">
        {price}
        {period && (
          <span className="ml-1 font-ui text-sm font-normal text-muted-foreground">
            so'm / {period}
          </span>
        )}
      </p>
      <p className="mt-3 font-ui text-[13px] leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function TargetCard({
  icon: Icon,
  k,
  v,
  period,
}: {
  icon: typeof Users;
  k: string;
  v: string;
  period: string;
}) {
  return (
    <div className="rounded-[var(--radius)] border border-border bg-background/30 p-4">
      <div className="flex items-center justify-between">
        <Icon className="h-4 w-4 text-primary" />
        <span className="font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {period}
        </span>
      </div>
      <p className="mt-3 font-serif text-2xl font-semibold tabular-nums">{k}</p>
      <p className="mt-1 font-ui text-[11px] leading-relaxed text-muted-foreground">{v}</p>
    </div>
  );
}

function ProofRow({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-[var(--radius)] border border-border bg-card p-3">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <p className="font-ui text-[13px] leading-relaxed">{text}</p>
    </div>
  );
}

function SecurityCard({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Lock;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[var(--radius)] border border-border bg-card p-5">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-3 font-serif text-base font-semibold">{title}</p>
      <p className="mt-1.5 font-ui text-[12px] leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function RoadmapRow({ period, milestone }: { period: string; milestone: string }) {
  return (
    <div className="flex items-start gap-4 rounded-[var(--radius)] border border-border bg-card p-4">
      <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.22em] text-primary min-w-[90px]">
        {period}
      </span>
      <p className="font-ui text-sm leading-relaxed">{milestone}</p>
    </div>
  );
}
