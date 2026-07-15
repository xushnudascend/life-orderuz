import type { Archetype } from "@/lib/nervous";

/**
 * Dashboard hero ostidagi past-kontrastli qator:
 * [● sariq nuqta] [Arxetip nomi] · [mikro-maslahat]
 */
export function ArchetypeRow({ archetype }: { archetype: Archetype | null }) {
  if (!archetype) return null;
  return (
    <p className="mt-3 flex items-center gap-2 font-ui text-[11px] text-muted-foreground">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
      <span className="text-foreground/70">{archetype.name}</span>
      <span aria-hidden>·</span>
      <span>{archetype.hint}</span>
    </p>
  );
}
