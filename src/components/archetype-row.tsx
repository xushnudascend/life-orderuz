import type { Archetype } from "@/lib/nervous";

/**
 * Dashboard hero ostidagi past-kontrastli qator:
 * [● sariq nuqta] [Arxetip nomi] · [mikro-maslahat]
 */
export function ArchetypeRow({ archetype }: { archetype: Archetype | null }) {
  if (!archetype) return null;
  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-ui text-[11px] text-muted-foreground">
      <span className="inline-flex items-center gap-2">
        <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
        <span className="text-foreground/70">{archetype.name}</span>
      </span>
      <span aria-hidden className="hidden sm:inline">
        ·
      </span>
      <span className="basis-full sm:basis-auto">{archetype.hint}</span>
    </p>
  );
}
