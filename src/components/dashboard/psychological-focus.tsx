import * as React from "react";
import { Brain, Info } from "lucide-react";
import { Panel, PanelHeader } from "@/components/panel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * PsychologicalFocus — Injects scientific context into the daily workflow.
 * Based on Fogg, Clear, and Huberman research analyzed.
 */
import { PSYCHOLOGICAL_INSIGHTS } from "@/lib/research/behavioral-engine";

export function PsychologicalFocus({ archetype }: { archetype: string | null }) {
  const current = React.useMemo(() => {
    return PSYCHOLOGICAL_INSIGHTS[Math.floor(Math.random() * PSYCHOLOGICAL_INSIGHTS.length)];
  }, []);

  return (
    <Panel className="border-l-4 border-l-primary/50 bg-primary/[0.02]">
      <PanelHeader 
        eyebrow="Psixologik Fokus" 
        action={
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-primary transition-colors" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[200px] text-[11px]">
                Bu tavsiyalar 500+ ilmiy maqolalar va muvaffaqiyatli raqobatchilar tahlili asosida shakllantirilgan.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        }
      />
      <div className="mt-3 flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Brain className="h-4 w-4" />
        </div>
        <div>
          <h4 className="font-serif text-[15px] font-semibold leading-none">{current.concept}</h4>
          <p className="mt-1.5 font-ui text-[13px] leading-relaxed text-muted-foreground">
            {current.application}
          </p>
          <div className="mt-2 inline-flex items-center rounded-full bg-border/50 px-2 py-0.5 font-ui text-[9px] uppercase tracking-wider text-muted-foreground">
            Manba: {current.source}
          </div>
        </div>
      </div>
    </Panel>
  );
}
