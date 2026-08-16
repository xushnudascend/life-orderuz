import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
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
    <div className="min-h-dvh bg-background text-foreground animate-fade-in">
      <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="grid h-7 w-7 place-items-center rounded-[10px] bg-primary text-primary-foreground"
            >
              <span className="font-serif text-[15px] font-semibold leading-none">L</span>
            </span>
            <span className="font-serif text-[17px] font-bold tracking-tight">{uz.brand.name}</span>
          </Link>
          <Link
            to="/"
            className="font-ui text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground"
          >
            {uz.brand.home}
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-16 md:py-20">
        <p className="font-ui text-[11px] uppercase tracking-[0.28em] text-primary">Huquqiy</p>
        <h1 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight md:text-5xl">
          {title}
        </h1>
        <p className="mt-3 font-ui text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Yangilangan: {updated}
        </p>
        <div className="mt-12 space-y-5 text-[15px] leading-relaxed text-foreground/90">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
