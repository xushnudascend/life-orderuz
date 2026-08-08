import { Zap } from "lucide-react";

/**
 * BiorythmPeak — Based on Circadian Rhythm (Huberman Lab / Rise Science)
 * Displays the current energy phase of the user.
 */
export function BiorythmPeak({ userWakeTime = 7 }: { userWakeTime?: number }) {
  const now = new Date();
  const currentHour = now.getHours();
  
  // Circadian logic: 
  // 0-2 hours after waking: Grogginess / Adenosine clearance
  // 2-6 hours: Morning peak (Deep work)
  // 7-9 hours: Afternoon dip
  // 10-14 hours: Evening second wind
  const hoursSinceWaking = (currentHour - userWakeTime + 24) % 24;

  let phase = "O'rtacha";
  let status = "Stabil";
  let percent = 50;
  let color = "bg-primary/40";

  if (hoursSinceWaking < 2) {
    phase = "Uyg'onish";
    status = "Past (Adenozin)";
    percent = 20;
    color = "bg-blue-500/40";
  } else if (hoursSinceWaking < 6) {
    phase = "Pik";
    status = "Yuqori (Fokus)";
    percent = 90;
    color = "bg-emerald-500/60";
  } else if (hoursSinceWaking < 9) {
    phase = "Tushkunlik";
    status = "Past (Dip)";
    percent = 30;
    color = "bg-amber-500/40";
  } else if (hoursSinceWaking < 14) {
    phase = "Ikkinchi to'lqin";
    status = "O'rta-Yuqori";
    percent = 70;
    color = "bg-primary/60";
  } else {
    phase = "Tayyorgarlik";
    status = "Past (Melatonin)";
    percent = 15;
    color = "bg-indigo-500/40";
  }

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex items-center justify-between">
        <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Biologik ritm</p>
        <Zap className="h-3 w-3 text-primary animate-pulse" />
      </div>
      <h3 className="mt-2 font-serif text-lg leading-tight">{phase} fazasi</h3>
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between font-ui text-[10px] text-muted-foreground">
          <span>{status}</span>
          <span>{percent}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-border overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${color}`} 
            style={{ width: `${percent}%` }} 
          />
        </div>
      </div>
    </div>
  );
}
