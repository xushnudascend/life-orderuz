import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { BookText, GraduationCap, Sparkles, ArrowRight } from "lucide-react";
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
      <p className="font-ui text-xs uppercase tracking-[0.28em] text-primary">
        Kategoriya
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight">
        O'rganish.
      </h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Kundalik, mentor va bilim — o'zingni ko'ring, o'zingizni tinglang.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <CatCard
          to="/journal"
          icon={<BookText className="h-5 w-5 text-primary" />}
          title="Kundalik"
          body="Yozuv — o'zing bilan halol suhbat."
        />
        <CatCard
          to="/mentor"
          icon={<Sparkles className="h-5 w-5 text-primary" />}
          title="Nadir bilan"
          body="Halol AI mentor. Kerak bo'lganda to'xtatadi."
        />
        <CatCard
          to="/analytics"
          icon={<GraduationCap className="h-5 w-5 text-primary" />}
          title="Statistika"
          body="14 kunlik tahlil, kuchli va zaif kunlar."
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
  to: "/journal" | "/mentor" | "/analytics";
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
