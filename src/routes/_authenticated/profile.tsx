import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import { uz } from "@/i18n";
import { RankBadge } from "@/components/rank-badge";
import { ShieldIndicator } from "@/components/shield-indicator";
import { useSubscription } from "@/lib/use-subscription";
import { ShareCard } from "@/components/share-card";
import { estimateDisciplineScore } from "@/lib/nervous";
import { Panel, PanelHeader } from "@/components/panel";
import { PageHero } from "@/components/page-hero";
import { CountUpNumber } from "@/components/count-up-number";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [{ title: `Profil — ${uz.brand.name}` }, { name: "robots", content: "noindex" }],
  }),
  component: ProfilePage,
});

type Profile = {
  display_name: string | null;
  username: string | null;
  plan_length_days: number | null;
  onboarding_completed_at: string | null;
  is_public: boolean | null;
};
type Stats = { total_xp: number; level: number; discipline_score: number } | null;
type Streak = {
  current_days: number;
  longest_days: number;
  freeze_active_until: string | null;
} | null;

function ProfilePage() {
  const { userId } = Route.useRouteContext();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats>(null);
  const [streak, setStreak] = useState<Streak>(null);
  const [shieldsUsed, setShieldsUsed] = useState(0);
  const [xpDeltaPct, setXpDeltaPct] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingShield, setUsingShield] = useState(false);
  const { isPro } = useSubscription();
  const [usernameDraft, setUsernameDraft] = useState("");

  async function refresh() {
    const now = new Date();
    const sevenAgo = new Date(now);
    sevenAgo.setUTCDate(now.getUTCDate() - 7);
    const fourteenAgo = new Date(now);
    fourteenAgo.setUTCDate(now.getUTCDate() - 14);
    const [p, s, st, sh, xpThis, xpPrev] = await Promise.all([
      supabase
        .from("profiles")
        .select("display_name, username, plan_length_days, onboarding_completed_at, is_public")
        .eq("id", userId)
        .maybeSingle(),
      supabase
        .from("user_stats")
        .select("total_xp, level, discipline_score")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("streaks")
        .select("current_days, longest_days, freeze_active_until")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("shields")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gt("used_on", sevenAgo.toISOString().slice(0, 10)),
      supabase
        .from("xp_events")
        .select("amount")
        .eq("user_id", userId)
        .gte("created_at", sevenAgo.toISOString()),
      supabase
        .from("xp_events")
        .select("amount")
        .eq("user_id", userId)
        .gte("created_at", fourteenAgo.toISOString())
        .lt("created_at", sevenAgo.toISOString()),
    ]);
    const prof = (p.data as Profile | null) ?? null;
    setProfile(prof);
    setUsernameDraft(prof?.username ?? "");
    setStats((s.data as Stats) ?? null);
    setStreak((st.data as Streak) ?? null);
    setShieldsUsed(sh.count ?? 0);
    const sumThis = (xpThis.data ?? []).reduce((a, r) => a + (r.amount ?? 0), 0);
    const sumPrev = (xpPrev.data ?? []).reduce((a, r) => a + (r.amount ?? 0), 0);
    if (sumPrev > 0) setXpDeltaPct(Math.round(((sumThis - sumPrev) / sumPrev) * 100));
    else if (sumThis > 0) setXpDeltaPct(100);
    else setXpDeltaPct(null);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function activateShield() {
    setUsingShield(true);
    const { error } = await supabase.rpc("use_shield", {});
    setUsingShield(false);
    if (error) {
      toast.error(
        error.message.includes("shield_limit_reached")
          ? "Bu haftada shield ishlatib bo'lingan."
          : "Ba'zi maydonlar to'g'ri to'ldirilmagan.",
      );
      return;
    }
    toast.success("Shield faol. Bugungi bo'sh kun uchun streak saqlanadi.");
    refresh();
  }

  async function saveUsername() {
    const clean = usernameDraft
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "");
    if (clean.length < 3) return toast.error("Username 3+ belgidan iborat bo'lsin.");
    const { error } = await supabase.from("profiles").update({ username: clean }).eq("id", userId);
    if (error) return toast.error("Ba'zi maydonlar to'g'ri to'ldirilmagan.");
    toast.success("Username saqlandi.");
    refresh();
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  }

  const score =
    stats?.discipline_score ??
    estimateDisciplineScore({
      currentStreak: streak?.current_days ?? 0,
      totalXp: stats?.total_xp ?? 0,
      level: stats?.level ?? 1,
    });

  return (
    <AppShell title="Profil">
      <PageHero
        eyebrow="Sen"
        title={profile?.display_name ?? "Foydalanuvchi"}
        subtitle={
          profile?.username
            ? `@${profile.username}`
            : "Rankingni, streakni va shieldni bir joyda ko'r."
        }
        actions={<RankBadge score={score} />}
      />
      {profile?.username && profile.is_public && (
        <p className="-mt-4 font-ui text-xs text-muted-foreground">
          <Link
            to="/u/$username"
            params={{ username: profile.username }}
            className="text-primary hover:underline"
          >
            Ochiq profilni ko'rish →
          </Link>
        </p>
      )}

      {!loading && (
        <Panel className="mt-6 border-primary/30 bg-primary/5 p-5">
          <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
            Identitet
          </p>
          <p className="mt-2 font-serif text-xl leading-snug text-balance">
            Men — {identityFrom(stats?.level ?? 1, streak?.current_days ?? 0)}.
          </p>
          <p className="mt-2 font-ui text-xs text-muted-foreground">
            Har bajarilgan mikro-qadam — shu jumlaning isboti. Odat ovoz berishdir: har kuni sen
            qanday odam ekanligingga.
          </p>
        </Panel>
      )}

      {!loading && <ProgressTimeline current={streak?.current_days ?? 0} />}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Stat label="Daraja" value={stats?.level ?? 1} />
            <Stat
              label="Umumiy XP"
              value={stats?.total_xp ?? 0}
              context={
                xpDeltaPct === null
                  ? "so'nggi 7 kunda ma'lumot yig'ilyapti"
                  : `so'nggi 7 kun: ${xpDeltaPct >= 0 ? "+" : ""}${xpDeltaPct}% oldingi haftaga nisbatan`
              }
            />
            <Stat
              label="Joriy streak"
              value={`${streak?.current_days ?? 0} kun`}
              context={`eng uzun: ${streak?.longest_days ?? 0} kun`}
            />
          </div>

          <div className="mt-6">
            <ShieldIndicator usedThisWeek={shieldsUsed} max={3} />
          </div>

          <Panel className="mt-6 p-5">
            <PanelHeader eyebrow="Umumiy" title={<h2 className="font-serif text-lg">Rejang</h2>} />
            <div className="mt-4 space-y-3">
              <Row label="Reja" value={`${profile?.plan_length_days ?? 7} kun`} />
              <Row
                label="Onboarding"
                value={
                  profile?.onboarding_completed_at
                    ? new Date(profile.onboarding_completed_at).toLocaleDateString("uz-UZ")
                    : "—"
                }
              />
              <Row label="Eng uzun streak" value={`${streak?.longest_days ?? 0} kun`} />
            </div>
          </Panel>

          <Panel className="mt-6 p-5">
            <PanelHeader
              eyebrow="Ochiq profil"
              title={
                <Label htmlFor="uname" className="font-serif text-lg">
                  Username
                </Label>
              }
            />
            <div className="mt-4 flex gap-2">
              <Input
                id="uname"
                placeholder="masalan: aziz"
                value={usernameDraft}
                onChange={(e) => setUsernameDraft(e.target.value)}
                className="max-w-xs"
              />
              <Button onClick={saveUsername} variant="outline">
                Saqlash
              </Button>
            </div>
            <p className="mt-2 font-ui text-xs text-muted-foreground">
              Faqat kichik harflar, raqamlar, ostki chiziq. Kamida 3 belgi.
            </p>
          </Panel>

          <Panel className="mt-6 p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border">
                  <Shield className="h-4 w-4 text-primary" />
                </span>
                <div>
                  <p className="font-serif text-lg">Shield</p>
                  <p className="font-ui text-xs text-muted-foreground">
                    Haftada 1 marta — bo'sh kun uchun streak saqlanadi.
                    {streak?.freeze_active_until && (
                      <> Faol: {new Date(streak.freeze_active_until).toLocaleDateString("uz-UZ")}</>
                    )}
                  </p>
                </div>
              </div>
              <Button
                onClick={activateShield}
                disabled={usingShield || shieldsUsed >= 1}
                variant="outline"
                size="sm"
              >
                {shieldsUsed >= 1 ? "Ishlatildi" : "Faollashtirish"}
              </Button>
            </div>
          </Panel>

          <section className="mt-10">
            <h2 className="mb-3 font-serif text-2xl">Natijalarni ulash</h2>
            <ShareCard
              displayName={profile?.display_name ?? "Foydalanuvchi"}
              level={stats?.level ?? 1}
              totalXp={stats?.total_xp ?? 0}
              currentStreak={streak?.current_days ?? 0}
              disciplineScore={score}
            />
          </section>
        </>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link to="/dashboard">Bugungi kunga qaytish</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/settings">Sozlamalar</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/achievements">Yutuqlar</Link>
        </Button>
        <Button variant="ghost" onClick={signOut}>
          Chiqish
        </Button>
      </div>
    </AppShell>
  );
}

function Stat({
  label,
  value,
  context,
}: {
  label: string;
  value: string | number;
  context?: string;
}) {
  const isNumber = typeof value === "number";
  return (
    <Panel className="p-5">
      <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-serif text-3xl tabular-nums">
        {isNumber ? <CountUpNumber value={value} once={`profile-${label}`} /> : value}
      </p>
      {context && <p className="mt-1 font-ui text-[11px] text-muted-foreground">{context}</p>}
    </Panel>
  );
}

function ProgressTimeline({ current }: { current: number }) {
  const marks = [
    { day: 3, label: "Trigger o'rnadi", note: "Yosin sig'im shakllanmoqda" },
    { day: 7, label: "Birinchi to'lqin", note: "Prefrontal-striatal bog'lanish" },
    { day: 21, label: "Avtomatlashuv boshi", note: "Ilgak → harakat qisqaradi" },
    { day: 66, label: "O'rtacha to'liqlashuv", note: "Lally, UCL 2010" },
    { day: 100, label: "Identitet qatlami", note: '"Men — bunday odamman"' },
  ];
  const max = 100;
  const pct = Math.min(100, (current / max) * 100);
  return (
    <Panel className="mt-6 p-5">
      <PanelHeader
        eyebrow="Timeline"
        title={<h2 className="font-serif text-lg">Odat qatlamlari — 100 kun</h2>}
      />
      <div className="mt-6">
        <div className="relative h-1.5 rounded-full bg-border">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
          {marks.map((m) => {
            const left = (m.day / max) * 100;
            const reached = current >= m.day;
            return (
              <span
                key={m.day}
                aria-hidden
                className={
                  "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-colors " +
                  (reached
                    ? "h-3.5 w-3.5 border-primary bg-primary"
                    : "h-3 w-3 border-border bg-background")
                }
                style={{ left: `${left}%` }}
              />
            );
          })}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-5">
          {marks.map((m) => {
            const reached = current >= m.day;
            return (
              <div key={m.day} className="text-center">
                <p
                  className={
                    "font-serif text-lg tabular-nums " +
                    (reached ? "text-primary" : "text-muted-foreground")
                  }
                >
                  {m.day}
                  <span className="ml-1 font-ui text-[10px] uppercase tracking-[0.18em]">kun</span>
                </p>
                <p
                  className={
                    "mt-1 font-ui text-[11px] " +
                    (reached ? "text-foreground" : "text-muted-foreground")
                  }
                >
                  {m.label}
                </p>
                <p className="mt-0.5 font-ui text-[10px] leading-tight text-muted-foreground">
                  {m.note}
                </p>
              </div>
            );
          })}
        </div>
        <p className="mt-4 font-ui text-[11px] text-muted-foreground">
          Bugungi joyingiz: <strong className="text-foreground tabular-nums">{current} kun</strong>.
          Har bosqich — miya darajasidagi o'zgarish, marketing emas.
        </p>
      </div>
    </Panel>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between font-ui text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function identityFrom(level: number, streak: number): string {
  if (streak >= 66) return "izchillik ustasi";
  if (streak >= 21) return "tizim quruvchi";
  if (streak >= 7) return "kundalik amaliyotchi";
  if (level >= 5) return "o'zini boshqaruvchi";
  if (streak >= 3) return "boshlagan odam";
  return "yangi boshlanuvchi tizim quruvchi";
}
