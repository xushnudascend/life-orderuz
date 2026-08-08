import { Clock, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

export function BiorythmPeak() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const h = now.getHours();

  const getPhase = () => {
    // Andrew Huberman / Rise Science logic
    if (h >= 0 && h < 2) return { label: "Tiklanish", color: "text-blue-400", bg: "bg-blue-400/10", info: "Miya neyronlarini tozalash va xotirani mustahkamlash vaqti." };
    if (h >= 2 && h < 6) return { label: "Chuqur uyqu", color: "text-indigo-400", bg: "bg-indigo-400/10", info: "Gormonal muvozanat va jismoniy tiklanish cho'qqisi." };
    if (h >= 7 && h < 9) return { label: "Kortizol cho'qqisi", color: "text-orange-400", bg: "bg-orange-400/10", info: "Eng muhim vazifani boshlash uchun eng yaxshi vaqt." };
    if (h >= 10 && h < 14) return { label: "Chuqur fokus", color: "text-emerald-400", bg: "bg-emerald-400/10", info: "Analitik va kreativ ishlar uchun ideal biologik oyna." };
    if (h >= 14 && h < 16) return { label: "Sirkad tushish", color: "text-amber-400", bg: "bg-amber-400/10", info: "Energiya pasayishi. Yengil vazifalar yoki qisqa dam olish tavsiya etiladi." };
    return { label: "Barqarorlik", color: "text-primary", bg: "bg-primary/10", info: "O'rtacha darajadagi faollik oynasi." };
  };

  const phase = getPhase();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" />
        <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Biologik Ritm
        </p>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <p className="font-serif text-sm font-semibold text-foreground">Hozirgi holat</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3 w-3 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[180px] text-[10px]">
                {phase.info}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className={`mt-2 flex items-center justify-between rounded-md ${phase.bg} px-3 py-2 transition-colors`}>
          <span className={`font-ui text-xs font-bold ${phase.color}`}>
            {phase.label}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {now.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>
    </div>
  );
}
