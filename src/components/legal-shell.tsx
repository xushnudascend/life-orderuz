import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { uz } from "@/i18n";

export function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5">
          <Link to="/" className="font-serif text-lg">
            {uz.brand.name}
          </Link>
          <Link
            to="/"
            className="font-ui text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground"
          >
            Bosh sahifa
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-16">
        <p className="font-ui text-xs uppercase tracking-[0.28em] text-primary">
          Huquqiy
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Yangilangan: {updated}
        </p>
        <div className="prose prose-invert mt-10 max-w-none space-y-5 text-[15px] leading-relaxed text-foreground/90 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-2">
          {children}
        </div>
      </main>
    </div>
  );
}

// Empty route so this file compiles standalone (not used as page)
export const Route = createFileRoute("/_legal-shell" as never)({
  component: () => null,
});
