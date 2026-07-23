import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Bell } from "lucide-react";
import { Panel, PanelHeader } from "@/components/panel";

const DAILY_BUDGET = 3;

/**
 * Notification budget — kuniga 3 ta signal cheklovi.
 * Sog'lom foydalanuvchi tajribasi (Hari attention-economics).
 * Server tomonda `try_consume_notification` funksiyasi cheklaydi;
 * bu kartochka foydalanuvchiga qolgan miqdorni ko'rsatadi.
 */
export function NotificationBudgetCard({ userId }: { userId: string }) {
  const [used, setUsed] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data } = await supabase
        .from("notification_budget" as never)
        .select("count")
        .eq("user_id", userId)
        .eq("day", today)
        .maybeSingle();
      if (cancelled) return;
      const row = data as { count: number } | null;
      setUsed(row?.count ?? 0);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const remaining = used === null ? null : Math.max(0, DAILY_BUDGET - used);

  return (
    <Panel className="p-5">
      <PanelHeader
        eyebrow="Signal budjeti"
        title={
          <h2 className="flex items-center gap-2 font-serif text-xl">
            <Bell className="h-4 w-4 text-primary" /> Kunlik budjet
          </h2>
        }
      />
      <div className="mt-3 flex items-baseline gap-2">
        <p className="font-serif text-3xl tabular-nums text-foreground">
          {remaining ?? "—"}
        </p>
        <p className="font-ui text-xs text-muted-foreground">
          / {DAILY_BUDGET} bugungi signal qoldi
        </p>
      </div>
      <p className="mt-2 font-ui text-xs text-muted-foreground">
        Diqqatingizni himoya qilamiz — kuniga eng ko'pi bilan 3 ta signal yuboramiz.
        Ko'proq push kelmaydi.
      </p>
    </Panel>
  );
}
