import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { uz } from "@/i18n";
import { freeTierLimits, proTierLimits, pricing } from "@/lib/limits";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: `Narxlar — ${uz.brand.name}` },
      {
        name: "description",
        content:
          "Life Order Free va Pro rejalari. Bepul boshlang, tayyor bo'lganda kengaytiring.",
      },
      { property: "og:title", content: `Narxlar — ${uz.brand.name}` },
      {
        property: "og:description",
        content: "Life Order Free va Pro rejalari.",
      },
      { property: "og:url", content: "https://life-orderuz.lovable.app/pricing" },
    ],
    links: [{ rel: "canonical", href: "https://life-orderuz.lovable.app/pricing" }],
  }),
  component: Pricing,
});

function Pricing() {
  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Link to="/" className="font-serif text-lg">
            {uz.brand.name}
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link to="/auth">Kirish</Link>
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-16">
        <p className="font-ui text-xs uppercase tracking-[0.28em] text-primary">
          Narxlar
        </p>
        <h1 className="mt-3 font-serif text-5xl leading-tight tracking-tight">
          Halol narx.
        </h1>
        <p className="mt-3 font-serif text-2xl text-muted-foreground">
          Free — doimiy. Pro — kerak bo'lsa.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Plan
            name="Free"
            price="0 so'm"
            tagline="Boshlash uchun yetarli"
            features={[
              `${freeTierLimits.habits} tagacha odat`,
              `Kunlik ${freeTierLimits.journalEntriesPerDay} ta kundalik`,
              `Nadir bilan kunda ${freeTierLimits.mentorMessagesPerDay} ta xabar`,
              `Haftasiga ${freeTierLimits.shieldPerWeek} ta Qalqon`,
              "Kunlik 3 ta vazifa",
            ]}
            cta={
              <Button asChild className="w-full">
                <Link to="/auth">Bepul boshlash</Link>
              </Button>
            }
          />
          <Plan
            name="Pro"
            highlight
            price={pricing.monthly.label}
            tagline={`Yoki ${pricing.yearly.label}`}
            features={[
              "Cheksiz odat",
              "Cheksiz kundalik",
              "Nadir bilan cheksiz suhbat",
              `Haftasiga ${proTierLimits.shieldPerWeek} ta Qalqon`,
              "Kengaytirilgan yutuqlar va statistika",
              "Ustuvor yordam",
            ]}
            cta={
              <Button asChild className="w-full">
                <Link to="/auth">
                  Pro ni tanlash <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            }
          />
        </div>

      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-6 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Life Order</p>
          <div className="flex gap-4">
            <Link to="/terms" className="hover:text-foreground">
              Shartlar
            </Link>
            <Link to="/privacy" className="hover:text-foreground">
              Maxfiylik
            </Link>
            <Link to="/refund" className="hover:text-foreground">
              Qaytarish
            </Link>
            <Link to="/security" className="hover:text-foreground">
              Xavfsizlik
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Plan({
  name,
  price,
  tagline,
  features,
  cta,
  highlight,
}: {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  cta: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        "rounded-[var(--radius)] border p-8 " +
        (highlight
          ? "border-primary/50 bg-primary/5"
          : "border-border bg-card")
      }
    >
      <p className="font-ui text-xs uppercase tracking-[0.24em] text-muted-foreground">
        {name}
      </p>
      <p className="mt-3 font-serif text-4xl">{price}</p>
      <p className="mt-1 text-sm text-muted-foreground">{tagline}</p>
      <ul className="mt-6 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8">{cta}</div>
    </div>
  );
}
