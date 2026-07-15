import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Flame, Target, ShieldCheck, ArrowRight } from "lucide-react";
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
      <p className="font-ui text-xs uppercase tracking-[0.28em] text-primary">
        Kategoriya
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight">
        Odatlar.
      </h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Kichik qadamlar — barcha katta o'zgarishlar shu yerdan boshlanadi.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <CatCard
          to="/habits"
          icon={<Flame className="h-5 w-5 text-primary" />}
          title="Bugungi odatlar"
          body="Ro'yxat, +XP, streak — bir joyda."
        />
        <CatCard
          to="/quests"
          icon={<Target className="h-5 w-5 text-primary" />}
          title="Kunlik vazifalar"
          body="Bugun uchun uchta kichik topshiriq."
        />
        <CatCard
          to="/achievements"
          icon={<ShieldCheck className="h-5 w-5 text-primary" />}
          title="Yutuqlar"
          body="Yo'lda ochilgan medallar."
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
  to: "/habits" | "/quests" | "/achievements";
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
