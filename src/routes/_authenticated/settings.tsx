import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Bell, User as UserIcon, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { uz } from "@/i18n";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: `Sozlamalar — ${uz.brand.name}` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Settings,
});

type Prefs = {
  display_name: string | null;
  notify_daily: boolean;
  notify_streak: boolean;
  daily_reminder_time: string;
};

function Settings() {
  const { userId } = Route.useRouteContext();
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name, notify_daily, notify_streak, daily_reminder_time")
        .eq("id", userId)
        .maybeSingle();
      setPrefs(
        (data as Prefs | null) ?? {
          display_name: "",
          notify_daily: true,
          notify_streak: true,
          daily_reminder_time: "09:00",
        },
      );
      setLoading(false);
    })();
  }, [userId]);

  async function save() {
    if (!prefs) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: prefs.display_name,
        notify_daily: prefs.notify_daily,
        notify_streak: prefs.notify_streak,
        daily_reminder_time: prefs.daily_reminder_time,
      })
      .eq("id", userId);
    setSaving(false);
    if (error) {
      toast.error("Saqlab bo'lmadi");
    } else {
      toast.success("Sozlamalar saqlandi");
    }
  }

  async function requestBrowserNotifications() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast.error("Ushbu qurilma bildirishnomalarni qo'llab-quvvatlamaydi");
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === "granted") toast.success("Bildirishnomalar yoqildi");
    else toast.error("Ruxsat berilmadi");
  }

  async function exportData() {
    const [habits, journal, chats, stats] = await Promise.all([
      supabase.from("habits").select("*").eq("user_id", userId),
      supabase.from("journal_entries").select("*").eq("user_id", userId),
      supabase.from("chat_messages").select("*").eq("user_id", userId),
      supabase.from("user_stats").select("*").eq("user_id", userId),
    ]);
    const blob = new Blob(
      [
        JSON.stringify(
          {
            exported_at: new Date().toISOString(),
            habits: habits.data,
            journal: journal.data,
            chats: chats.data,
            stats: stats.data,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `life-order-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading || !prefs) {
    return (
      <AppShell title="Sozlamalar">
        <div className="flex justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Sozlamalar">
      <p className="font-ui text-xs uppercase tracking-[0.28em] text-primary">
        Sozlamalar
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight">
        Ilovani o'zingga moslashtir.
      </h1>

      <section className="mt-10 space-y-6">
        <Card icon={<UserIcon className="h-4 w-4 text-primary" />} title="Profil">
          <div className="space-y-2">
            <Label htmlFor="name">Ismingiz</Label>
            <Input
              id="name"
              value={prefs.display_name ?? ""}
              onChange={(e) =>
                setPrefs({ ...prefs, display_name: e.target.value })
              }
            />
          </div>
        </Card>

        <Card icon={<Bell className="h-4 w-4 text-primary" />} title="Bildirishnomalar">
          <div className="space-y-4">
            <Row
              label="Kunlik eslatma"
              hint="Har kuni belgilangan vaqtda"
            >
              <Switch
                checked={prefs.notify_daily}
                onCheckedChange={(v) =>
                  setPrefs({ ...prefs, notify_daily: v })
                }
              />
            </Row>
            <Row
              label="Streak ogohlantirishi"
              hint="Streak yo'qolayotganda"
            >
              <Switch
                checked={prefs.notify_streak}
                onCheckedChange={(v) =>
                  setPrefs({ ...prefs, notify_streak: v })
                }
              />
            </Row>
            <div className="space-y-2">
              <Label htmlFor="time">Eslatma vaqti</Label>
              <Input
                id="time"
                type="time"
                value={prefs.daily_reminder_time.slice(0, 5)}
                onChange={(e) =>
                  setPrefs({
                    ...prefs,
                    daily_reminder_time: e.target.value + ":00",
                  })
                }
                className="max-w-[160px]"
              />
            </div>
            <Button variant="outline" size="sm" onClick={requestBrowserNotifications}>
              Brauzer bildirishnomalariga ruxsat
            </Button>
          </div>
        </Card>

        <Card icon={<ShieldAlert className="h-4 w-4 text-primary" />} title="Ma'lumotlar">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Barcha ma'lumotlaringizni JSON ko'rinishida yuklab olishingiz mumkin.
            </p>
            <Button variant="outline" size="sm" onClick={exportData}>
              Ma'lumotlarni yuklab olish
            </Button>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={save} disabled={saving}>
            {saving ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
        </div>
      </section>
    </AppShell>
  );
}

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius)] border border-border p-6">
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h2 className="font-serif text-xl">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-ui text-sm">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </div>
  );
}
