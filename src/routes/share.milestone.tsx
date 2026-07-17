import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  kind: z.enum(["streak", "level", "achievement"]).catch("streak"),
  value: z.string().catch("7"),
  name: z.string().optional(),
});

export const Route = createFileRoute("/share/milestone")({
  validateSearch: (s) => searchSchema.parse(s),
  head: ({ match }) => {
    const { kind, value, name } = match.search as z.infer<typeof searchSchema>;
    const title =
      kind === "streak"
        ? `${value} kunlik streak — Life Order`
        : kind === "level"
          ? `${value}-daraja — Life Order`
          : `${name ?? "Achievement"} — Life Order`;
    const description = "Motivatsiya tugaydi. Tizim qoladi. Life Order — intizom OS.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: MilestonePage,
});

function MilestonePage() {
  const { kind, value, name } = Route.useSearch();
  const label =
    kind === "streak"
      ? `${value} kun streak`
      : kind === "level"
        ? `Daraja ${value}`
        : (name ?? "Yutuq");

  return (
    <main className="min-h-dvh bg-background text-foreground flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-xl">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Life Order
          </div>
          <h1 className="mt-6 text-5xl font-bold text-primary">{label}</h1>
          <p className="mt-6 text-sm text-muted-foreground">
            Motivatsiya tugaydi. Tizim qoladi.
          </p>
        </div>
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm font-medium text-primary hover:underline"
          >
            life-order.uz — sen ham boshla →
          </a>
        </div>
      </div>
    </main>
  );
}
