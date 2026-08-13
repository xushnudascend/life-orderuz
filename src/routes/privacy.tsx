import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Maxfiylik siyosati — Life Order" },
      { name: "description", content: "Life Order shaxsiy ma'lumotlar xavfsizligi va maxfiylik tamoyillari. Sizning ma'lumotlaringiz — sizning nazoratingizda." },
      { property: "og:title", content: "Maxfiylik siyosati — Life Order" },
      { property: "og:description", content: "Life Order shaxsiy ma'lumotlar xavfsizligi va maxfiylik tamoyillari." },
      { property: "og:url", content: "https://life-orderuz.lovable.app/privacy" },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "https://life-orderuz.lovable.app/privacy" }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="min-h-dvh bg-background p-8 font-ui text-foreground">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-serif text-3xl font-bold tracking-tight">Maxfiylik siyosati</h1>
        <p className="mt-6 leading-relaxed text-muted-foreground">
          Life Order platformasi sizning maxfiyligingizni qadrlaydi...
        </p>
      </div>
    </div>
  );
}
