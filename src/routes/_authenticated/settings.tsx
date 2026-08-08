import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { getTelegramLinkToken } from "@/lib/telegram.functions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  Bell,
  User as UserIcon,
  ShieldAlert,
  Sparkles,
  Languages,
  Clock,
  Wand2,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { useT } from "@/i18n/use-t";
import { TIMEZONES } from "@/lib/nervous";
import { type Locale } from "@/i18n";
import { PageHero } from "@/components/page-hero";
import { Panel, PanelHeader } from "@/components/panel";
import { getMotionPref, setMotionPref, type MotionPref } from "@/lib/motion-pref";
import { NotificationBudgetCard } from "@/components/notification-budget-card";
import { saveReminderPrefs } from "@/lib/reminders";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [{ title: `Settings — Life Order` }, { name: "robots", content: "noindex" }],
  }),
  component: Settings,
});

type Prefs = {
  display_name: string | null;
  notify_daily: boolean;
  notify_streak: boolean;
  daily_reminder_time: string;
  timezone: string;
  animations_enabled: boolean;
  ai_mentor_enabled: boolean;
  auto_shrink_on_excuse: boolean;
  is_public: boolean;
};

function Settings() {
  const { userId } = Route.useRouteContext();
  const { t, locale, setLocale } = useT();
  const getTelegramToken = useServerFn(getTelegramLinkToken);
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [telegramLoading, setTelegramLoading] = useState(false);
  const [motionPref, setMotionPrefState] = useState<MotionPref>(getMotionPref());

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select(
          "display_name, notify_daily, notify_streak, daily_reminder_time, timezone, animations_enabled, ai_mentor_enabled, auto_shrink_on_excuse, is_public",
        )
        .eq("id", userId)
        .maybeSingle();
      setPrefs(
        (data as Prefs | null) ?? {
          display_name: "",
          notify_daily: true,
          notify_streak: true,
          daily_reminder_time: "09:00:00",
          timezone: "Asia/Tashkent",
          animations_enabled: true,
          ai_mentor_enabled: true,
          auto_shrink_on_excuse: true,
          is_public: false,
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
        timezone: prefs.timezone,
        animations_enabled: prefs.animations_enabled,
        ai_mentor_enabled: prefs.ai_mentor_enabled,
        auto_shrink_on_excuse: prefs.auto_shrink_on_excuse,
        is_public: prefs.is_public,
      })
      .eq("id", userId);
    setSaving(false);
    if (error) toast.error("Saqlab bo'lmadi");
    else {
      // Qurilma ichidagi eslatmani ham yangilaymiz.
      saveReminderPrefs({
        notifyDaily: prefs.notify_daily,
        notifyStreak: prefs.notify_streak,
        time: prefs.daily_reminder_time.slice(0, 5),
      });
      toast.success("Sozlamalar saqlandi");
    }
  }

  async function requestBrowserNotifications() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast.error("Ushbu qurilma bildirishnomalarni qo'llab-quvvatlamaydi");
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      if (prefs) {
        saveReminderPrefs({
          notifyDaily: prefs.notify_daily,
          notifyStreak: prefs.notify_streak,
          time: prefs.daily_reminder_time.slice(0, 5),
        });
      }
      toast.success("Bildirishnomalar yoqildi — eslatma belgilangan vaqtda keladi");
    } else toast.error("Ruxsat berilmadi");
  }

  async function linkTelegram() {
    setTelegramLoading(true);
    try {
      const { token } = await getTelegramToken();
      // Replace with your actual bot username
      window.open(`https://t.me/lifeorderuz_bot?start=${token}`, "_blank");
    } catch (e) {
      toast.error("Telegram tokenini olib bo'lmadi");
    } finally {
      setTelegramLoading(false);
    }
  }

  async function exportData() {
    const [habits, journal, chats, stats, meals, workouts] = await Promise.all([
      supabase.from("habits").select("*").eq("user_id", userId),
      supabase.from("journal_entries").select("*").eq("user_id", userId),
      supabase.from("chat_messages").select("*").eq("user_id", userId),
      supabase.from("user_stats").select("*").eq("user_id", userId),
      supabase.from("meals").select("*").eq("user_id", userId),
      supabase.from("workouts").select("*").eq("user_id", userId),
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
            meals: meals.data,
            workouts: workouts.data,
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
      <PageHero
        eyebrow="Sozlamalar"
        title="Ilovani o'zingga moslashtir."
        subtitle="Bildirishnomalar, til, mavzu va profilingni bir joyda boshqar."
      />

      <section className="mt-2 space-y-6">
        <NotificationBudgetCard userId={userId} />
        <Card icon={<UserIcon className="h-4 w-4 text-primary" />} title="Profil">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ismingiz</Label>
              <Input
                id="name"
                value={prefs.display_name ?? ""}
                onChange={(e) => setPrefs({ ...prefs, display_name: e.target.value })}
              />
            </div>
            <Row
              label="Ochiq profil"
              hint={
                prefs.is_public
                  ? "Profil ochiq. Hamma ko'ra oladi."
                  : "Profil yopiq. Faqat siz ko'rasiz."
              }
            >
              <Switch
                checked={prefs.is_public}
                onCheckedChange={(v) => setPrefs({ ...prefs, is_public: v })}
              />
            </Row>
          </div>
        </Card>

        <Card icon={<Bell className="h-4 w-4 text-primary" />} title="Bildirishnomalar">
          <div className="space-y-4">
            <Row label="Kunlik eslatma" hint="Har kuni belgilangan vaqtda">
              <Switch
                checked={prefs.notify_daily}
                onCheckedChange={(v) => setPrefs({ ...prefs, notify_daily: v })}
              />
            </Row>
            <Row label="Streak ogohlantirishi" hint="Streak yo'qolayotganda">
              <Switch
                checked={prefs.notify_streak}
                onCheckedChange={(v) => setPrefs({ ...prefs, notify_streak: v })}
              />
            </Row>
            <div className="space-y-2">
              <Label htmlFor="time">Eslatma vaqti</Label>
              <Input
                id="time"
                type="time"
                value={prefs.daily_reminder_time.slice(0, 5)}
                onChange={(e) =>
                  setPrefs({ ...prefs, daily_reminder_time: e.target.value + ":00" })
                }
                className="max-w-[160px]"
              />
            </div>
            <Button variant="outline" size="sm" onClick={requestBrowserNotifications}>
              Brauzer bildirishnomalariga ruxsat
            </Button>
          </div>
        </Card>

        <Card icon={<MessageSquare className="h-4 w-4 text-primary" />} title="Telegram Hamroh">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Telegram orqali kunlik eslatmalarni oling va odatlarni to'g'ridan-to'g'ri messenjerda bajaring.
            </p>
            <Button variant="outline" size="sm" onClick={linkTelegram} disabled={telegramLoading}>
              {telegramLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <MessageSquare className="mr-2 h-4 w-4" />
              )}
              Telegram orqali eslatma olish
            </Button>
          </div>
        </Card>

        <Card icon={<Sparkles className="h-4 w-4 text-primary" />} title="AI mentor">
          <Row
            label="Nadir bilan chuqurroq gaplashish"
            hint="Yoqilsa — dashboard'da AI paneli faol bo'ladi"
          >
            <Switch
              checked={prefs.ai_mentor_enabled}
              onCheckedChange={(v) => setPrefs({ ...prefs, ai_mentor_enabled: v })}
            />
          </Row>
        </Card>

        <Card icon={<Wand2 className="h-4 w-4 text-primary" />} title="Animatsiyalar">
          <div className="space-y-4">
            <Row
              label="Barcha effektlar"
              hint={
                prefs.animations_enabled ? "Animatsiyalar yoqilgan" : "Animatsiyalar o'chirilgan"
              }
            >
              <Switch
                checked={prefs.animations_enabled}
                onCheckedChange={(v) => setPrefs({ ...prefs, animations_enabled: v })}
              />
            </Row>
            <div className="space-y-2">
              <p className="font-ui text-sm">Harakatlanish darajasi</p>
              <p className="text-xs text-muted-foreground">
                <code>auto</code> — qurilma sozlamasiga ergashadi. Tinch ish uchun{" "}
                <code>kamaytirilgan</code> tanlang.
              </p>
              <div className="flex flex-wrap gap-2">
                {(["auto", "reduce", "full"] as const).map((p) => {
                  const active = motionPref === p;
                  return (
                    <button
                      key={p}
                      onClick={() => {
                        setMotionPrefState(p);
                        setMotionPref(p);
                      }}
                      className={
                        "rounded-full border px-3 py-1 font-ui text-xs uppercase tracking-[0.18em] transition-colors " +
                        (active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:text-foreground")
                      }
                    >
                      {p === "auto" ? "Auto" : p === "reduce" ? "Kamaytirilgan" : "To'liq"}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        <Card icon={<HelpCircle className="h-4 w-4 text-primary" />} title="Moslashish">
          <Row
            label="Bahona chiqqanda vazifani avtomatik kichraytiradi"
            hint="Sizni jazolamaydi — moslashadi"
          >
            <Switch
              checked={prefs.auto_shrink_on_excuse}
              onCheckedChange={(v) => setPrefs({ ...prefs, auto_shrink_on_excuse: v })}
            />
          </Row>
        </Card>

        <Card icon={<Clock className="h-4 w-4 text-primary" />} title="Vaqt zonasi">
          <select
            value={prefs.timezone}
            onChange={(e) => setPrefs({ ...prefs, timezone: e.target.value })}
            className="h-9 w-full max-w-md rounded-md border border-input bg-background px-3 text-sm"
          >
            {TIMEZONES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </Card>

        <Card icon={<Languages className="h-4 w-4 text-primary" />} title={t("settings.language.title")}>
          <div className="flex flex-wrap gap-2">
            {(["uz", "ru", "en"] as Locale[]).map((l) => (
              <button
                key={l}
                onClick={() => {
                  setLocale(l);
                  toast.success(t("settings.success"));
                }}
                className={
                  "rounded-full border px-3 py-1 font-ui text-xs uppercase tracking-[0.18em] transition-colors " +
                  (locale === l
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground")
                }
              >
                {l === "uz" ? "O'zbek" : l === "ru" ? "Русский" : "English"}
              </button>
            ))}
          </div>
        </Card>

        <Card icon={<Shield className="h-4 w-4 text-primary" />} title="Obuna">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Joriy reja, billing tarixi va obunani boshqarish.
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/settings/subscription">Obunani boshqarish</Link>
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

        <Card icon={<HelpCircle className="h-4 w-4 text-primary" />} title="Biz bilan bog'lanish">
          <p className="text-sm text-muted-foreground">
            Savol yoki taklif bo'lsa:{" "}
            <a href="mailto:hello@lifeorder.uz" className="text-primary hover:underline">
              hello@lifeorder.uz
            </a>
          </p>
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
    <Panel className="p-6">
      <PanelHeader
        title={
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="font-serif text-xl leading-tight">{title}</h2>
          </div>
        }
      />
      <div className="mt-4">{children}</div>
    </Panel>
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
