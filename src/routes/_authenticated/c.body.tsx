import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import {
  HeartPulse,
  Dumbbell,
  UtensilsCrossed,
  ArrowRight,
  Moon,
  Droplets,
  Wind,
  Activity,
} from "lucide-react";
import { uz } from "@/i18n";

export const Route = createFileRoute("/_authenticated/c/body")({
  head: () => ({
    meta: [
      { title: `Tana — ${uz.brand.name}` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BodyCategory,
});

function BodyCategory() {
  return (
    <AppShell title="Tana">
      {/* Sarlavha */}
      <div className="mb-6">
        <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
          Kategoriya
        </p>
        <h1 className="mt-1.5 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          Tana
        </h1>
        <p className="mt-2 max-w-2xl font-ui text-sm text-muted-foreground leading-relaxed">
          Miyaga o'ynash uchun tana platforma bo'lishi kerak. Uyqu, harakat va
          ovqat — uchtasi birga ishlaydi.
        </p>
      </div>

      {/* Asosiy bo'limlar */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <SectionCard
          to="/workout"
          icon={Dumbbell}
          title="Mashg'ulot"
          body="Bodybuilding, Calisthenics, Conditioning, Balance, Breath — tur va davomiylik tanla."
          stat="5 rejim"
        />
        <SectionCard
          to="/diet"
          icon={UtensilsCrossed}
          title="Ovqatlanish"
          body="Kunlik kkal maqsadi, ovqat kundaligi, AI ratsion tavsiyalari."
          stat="Kkal + AI"
        />
        <SectionCard
          to="/habits"
          icon={HeartPulse}
          title="Tana odatlari"
          body="Uyqu, suv, harakat, nafas — kunlik ritmni ushlab turuvchi mikro-odatlar."
          stat="Kunlik"
        />
      </div>

      {/* 4 ta ustun — nima uchun muhim */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Pillar
          icon={Moon}
          title="Uyqu 7-9 soat"
          body="Prefrontal korteks va gormonlarning tiklanishi. Kam uyqu — irodaning eng katta dushmani."
        />
        <Pillar
          icon={Droplets}
          title="Suv 30 ml/kg"
          body="2% dehidratatsiya kognitiv qobiliyatni 10-15% pasaytiradi. Ertalab 500 ml — birinchi qadam."
        />
        <Pillar
          icon={Activity}
          title="Harakat 8k qadam"
          body="Kunlik minimal — insulin sezgirligi, kayfiyat, kortizol. Ko'p emas, muntazam."
        />
        <Pillar
          icon={Wind}
          title="Nafas 4-7-8"
          body="4 s nafas → 7 s ushlash → 8 s chiqarish. Vagal signal — 3 marta takrorda tinchlanish."
        />
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
  to: "/workout" | "/diet" | "/habits";
  icon: typeof Dumbbell;
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

function Pillar({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Moon;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[var(--radius)] border border-border bg-background/30 p-4">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-3 font-serif text-sm font-semibold">{title}</p>
      <p className="mt-1 font-ui text-[12px] leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  );
}

