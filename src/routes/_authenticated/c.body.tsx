import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { HeartPulse, Dumbbell, UtensilsCrossed, ArrowRight } from "lucide-react";
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
      <p className="font-ui text-xs uppercase tracking-[0.28em] text-primary">
        Kategoriya
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight">
        Tana.
      </h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Mashg'ulot, ovqatlanish va nafas — tanang senga ishonchli platforma
        bo'lishi uchun uchtasi kerak.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <CatCard
          to="/workout"
          icon={<Dumbbell className="h-5 w-5 text-primary" />}
          title="Mashg'ulot"
          body="Bodybuilding, Calisthenics, Conditioning, Balance, Breath — turi tanla."
        />
        <CatCard
          to="/diet"
          icon={<UtensilsCrossed className="h-5 w-5 text-primary" />}
          title="Ovqatlanish"
          body="Kunlik kkal maqsadi, ovqat kundaligi, AI ratsion (Premium)."
        />
        <CatCard
          to="/habits"
          icon={<HeartPulse className="h-5 w-5 text-primary" />}
          title="Tana odatlari"
          body="Uyqu, suv, harakat — kunlik ritmni ushlaydigan mikro-odatlar."
        />
      </div>
    </AppShell>
  );
}

function CatCard({
  to,
  icon,
  title,
  body,
}: {
  to: "/workout" | "/diet" | "/habits";
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[var(--radius)] border border-border bg-card p-6">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="font-serif text-2xl">{title}</h2>
      </div>
      <p className="mt-2 font-ui text-sm text-muted-foreground">{body}</p>
      <Button asChild className="mt-4" variant="outline" size="sm">
        <Link to={to}>
          Ochish <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
