import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Panel, PanelHeader } from "@/components/panel";
import {
  BookText,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Eye,
  MessageSquare,
  LineChart,
  Lightbulb,
} from "lucide-react";
import { uz } from "@/i18n";

export const Route = createFileRoute("/_authenticated/c/learn")({
  head: () => ({
    meta: [
      { title: `O'rganish — ${uz.brand.name}` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LearnCategory,
});

function LearnCategory() {
  return (
    <AppShell title="O'rganish">
      <div className="mb-6">
        <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
          Kategoriya
        </p>
        <h1 className="mt-1.5 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          O'rganish
        </h1>
        <p className="mt-2 max-w-2xl font-ui text-sm text-muted-foreground leading-relaxed">
          O'zingni tomosha qilib turmasang — o'zgarish ko'rinmaydi. Kundalik,
          suhbat va tahlil — refleksiya halqasi.
        </p>
      </div>

      {/* Asosiy bo'limlar */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <SectionCard
          to="/journal"
          icon={BookText}
          title="Kundalik"
          body="3 satrlik yozuv. Kayfiyat + fikr + minnatdorlik. Miyaga tinchlik beradi."
          stat="Kunlik"
        />
        <SectionCard
          to="/mentor"
          icon={Sparkles}
          title="Nadir bilan"
          body="Sening ma'lumotlaring bilan gaplashadi. Umumiy maslahat emas — shaxsiy javob."
          stat="AI"
        />
        <SectionCard
          to="/analytics"
          icon={GraduationCap}
          title="Statistika"
          body="14 kunlik tahlil. Qaysi odat mustahkam, qayerda susayasan — ko'rinadi."
          stat="Tahlil"
        />
      </div>

      {/* Refleksiya halqasi */}
      <Panel className="mt-6">
        <PanelHeader
          eyebrow="Halqa"
          title={
            <p className="font-serif text-lg font-semibold">
              Ko'r → Ayt → O'lcha → Tuzat
            </p>
          }
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Step
            n="01"
            icon={Eye}
            title="Ko'r"
            body="Kundalik — kayfiyat va fikrlarni yozma shaklga o'tkaz."
          />
          <Step
            n="02"
            icon={MessageSquare}
            title="Ayt"
            body="Nadir bilan gaplash — o'zingni tashqaridan eshit."
          />
          <Step
            n="03"
            icon={LineChart}
            title="O'lcha"
            body="Statistika: qaysi kun kuchli, qayerda pasayish."
          />
          <Step
            n="04"
            icon={Lightbulb}
            title="Tuzat"
            body="Keyingi hafta uchun 1 ta aniq o'zgarish — ortiq emas."
          />
        </div>
      </Panel>

      {/* Ilmiy asos */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <FactCard
          k="Yozma refleksiya"
          v="Pennebaker (Texas): 3 kun × 15 daqiqa yozuv — stress markerlari pasayadi."
        />
        <FactCard
          k="Metacognition"
          v="O'zingni tomosha qilish — muammoni hal qilish tezligini 20-30% oshiradi."
        />
        <FactCard
          k="AI mentor"
          v="Doimiy javob beruvchi mentor — o'z-o'zini nazorat halqasini yopadi."
        />
      </div>

      {/* Amaliy maslahat */}
      <Panel className="mt-6">
        <PanelHeader eyebrow="Bugun uchun" />
        <ul className="mt-3 space-y-2 font-ui text-sm">
          <TipLine text="Kundalikni uxlashdan 30 daq. oldin yoz — miya tunga tayyorlanadi." />
          <TipLine text="Nadir bilan haftada 1 marta 'haftaga baho' suhbatini o't." />
          <TipLine text="Statistikada 3 kun ketma-ket pasayish ko'rsang — dam olish kuni tanla." />
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/journal"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-ui text-[11px] font-semibold uppercase tracking-[0.2em] hover:border-primary/50 hover:text-primary transition-colors"
          >
            Yozuv qo'shish <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            to="/mentor"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-ui text-[11px] font-semibold uppercase tracking-[0.2em] hover:border-primary/50 hover:text-primary transition-colors"
          >
            Nadir bilan <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </Panel>
    </AppShell>
  );
}

function SectionCard({
  to,
  icon: Icon,
  title,
  body,
  stat,
}: {
  to: "/journal" | "/mentor" | "/analytics";
  icon: typeof BookText;
  title: string;
  body: string;
  stat: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-[var(--radius)] border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50"
    >
      <div className="flex items-center justify-between">
        <Icon className="h-5 w-5 text-primary" />
        <span className="font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {stat}
        </span>
      </div>
      <h2 className="mt-4 font-serif text-xl">{title}</h2>
      <p className="mt-1.5 font-ui text-[13px] leading-relaxed text-muted-foreground">
        {body}
      </p>
      <span className="mt-4 inline-flex items-center gap-1 font-ui text-[11px] font-semibold uppercase tracking-[0.2em] text-primary group-hover:gap-1.5 transition-all">
        Ochish <ArrowRight className="h-3 w-3" />
      </span>
    </Link>
  );
}

function Step({
  n,
  icon: Icon,
  title,
  body,
}: {
  n: string;
  icon: typeof Eye;
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
      <p className="mt-3 font-serif text-sm font-semibold">{title}</p>
      <p className="mt-1 font-ui text-[12px] leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  );
}

function FactCard({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-[var(--radius)] border border-border bg-background/30 p-4">
      <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
        {k}
      </p>
      <p className="mt-2 font-ui text-[12px] leading-relaxed text-muted-foreground">
        {v}
      </p>
    </div>
  );
}

function TipLine({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
      <span className="leading-relaxed text-foreground/90">{text}</span>
    </li>
  );
}
