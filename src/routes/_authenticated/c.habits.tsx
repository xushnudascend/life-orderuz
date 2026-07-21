import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Panel, PanelHeader } from "@/components/panel";
import { PageHero } from "@/components/page-hero";
import {
  Flame,
  Target,
  ShieldCheck,
  ArrowRight,
  Zap,
  Anchor,
  Brain,
} from "lucide-react";
import { uz } from "@/i18n";

export const Route = createFileRoute("/_authenticated/c/habits")({
  head: () => ({
    meta: [
      { title: `Odatlar — ${uz.brand.name}` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: HabitsCategory,
});

function HabitsCategory() {
  return (
    <AppShell title="Odatlar">
      <PageHero
        eyebrow="Kategoriya"
        title="Odatlar"
        subtitle="Kunlik xulqning ~43% — odat (Wendy Wood, USC). Motivatsiya emas, takror va kontekst hal qiladi."
      />


      {/* Asosiy bo'limlar */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <SectionCard
          to="/habits"
          icon={Flame}
          title="Bugungi odatlar"
          body="Ro'yxat, +XP, streak — bir joyda boshqar."
          stat="Kundalik"
        />
        <SectionCard
          to="/quests"
          icon={Target}
          title="Vazifalar"
          body="Haftalik quest'lar. Katta niyat → kichik kunlik qadam."
          stat="Haftalik"
        />
        <SectionCard
          to="/achievements"
          icon={ShieldCheck}
          title="Yutuqlar"
          body="Yo'lda ochilgan medallar. Dopamin halqasi mustahkamlanadi."
          stat="Medal"
        />
      </div>

      {/* Odat formulasi */}
      <Panel className="mt-6">
        <PanelHeader
          eyebrow="Formula"
          title={
            <p className="font-serif text-lg font-semibold">
              Trigger → Mikro-harakat → Tasdiq
            </p>
          }
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Step
            n="01"
            icon={Anchor}
            title="Trigger"
            body="Aniq vaqt yoki oldingi harakat. Masalan: kofedan keyin."
          />
          <Step
            n="02"
            icon={Zap}
            title="Mikro-harakat"
            body="2 daqiqadan kam. Boshlash uchun kuch talab qilmaydigan hajm."
          />
          <Step
            n="03"
            icon={Brain}
            title="Tasdiq"
            body="Darhol XP va Check — miya bog'lanishni tez o'rganadi."
          />
        </div>
      </Panel>

      <div className="mt-6">
        <Link
          to="/habits"
          className="inline-flex items-center gap-1.5 font-ui text-[11px] font-semibold uppercase tracking-[0.2em] text-primary hover:gap-2 transition-all"
        >
          Odatlarni boshqarish <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
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
  to: "/habits" | "/quests" | "/achievements";
  icon: typeof Flame;
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
  icon: typeof Anchor;
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
