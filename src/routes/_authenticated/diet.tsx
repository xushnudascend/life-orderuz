import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { PageHero } from "@/components/page-hero";
import { IfThenHint } from "@/components/if-then-hint";
import { Panel, PanelHeader } from "@/components/panel";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Utensils, Trash2, Camera, Calculator } from "lucide-react";
import { toast } from "sonner";
import { uz } from "@/i18n";
import { PremiumLock } from "@/components/premium-lock";

export const Route = createFileRoute("/_authenticated/diet")({
  head: () => ({
    meta: [{ title: `Ovqatlanish — ${uz.brand.name}` }, { name: "robots", content: "noindex" }],
  }),
  component: Diet,
});

type Row = {
  id: string;
  kind: string;
  description: string;
  calories: number | null;
  logged_date: string;
  image_url: string | null;
};
const KINDS = ["Nonushta", "Tushlik", "Kechki ovqat", "Yengil ovqat"];

/** Mifflin–St Jeor formulasi */
function mifflin(
  sex: "male" | "female",
  weightKg: number,
  heightCm: number,
  age: number,
  activity: number,
): number {
  const base =
    sex === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  return Math.round(base * activity);
}

function Diet() {
  const { userId } = Route.useRouteContext();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [kind, setKind] = useState(KINDS[0]);
  const [desc, setDesc] = useState("");
  const [cal, setCal] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  // Kaloriya kalkulyator
  const [profile, setProfile] = useState<{
    sex: string | null;
    height_cm: number | null;
    weight_kg: number | null;
    age: number | null;
    activity_level: string | null;
  } | null>(null);

  async function refresh() {
    const [{ data }, { data: p }] = await Promise.all([
      supabase
        .from("meals")
        .select("id,kind,description,calories,logged_date,image_url")
        .eq("user_id", userId)
        .order("logged_date", { ascending: false })
        .limit(30),
      supabase
        .from("profiles")
        .select("sex, height_cm, weight_kg, age, activity_level")
        .eq("id", userId)
        .maybeSingle(),
    ]);
    setRows((data as Row[] | null) ?? []);
    setProfile(p as typeof profile);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Sign short-lived URLs (1h) for visible meal images at render time.
  useEffect(() => {
    let cancelled = false;
    const paths = rows
      .map((r) => r.image_url)
      .filter((v): v is string => !!v && !v.startsWith("http") && !v.startsWith("blob:"));
    if (paths.length === 0) {
      setSignedUrls({});
      return;
    }
    (async () => {
      const { data } = await supabase.storage.from("meals").createSignedUrls(paths, 60 * 60);
      if (cancelled || !data) return;
      const map: Record<string, string> = {};
      data.forEach((d) => {
        if (d.path && d.signedUrl) map[d.path] = d.signedUrl;
      });
      setSignedUrls(map);
    })();
    return () => {
      cancelled = true;
    };
  }, [rows]);

  const dailyTarget = useMemo(() => {
    if (!profile?.sex || !profile.height_cm || !profile.weight_kg || !profile.age) return null;
    const map: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    const act = map[profile.activity_level ?? ""] ?? 1.375;
    return mifflin(
      profile.sex as "male" | "female",
      Number(profile.weight_kg),
      Number(profile.height_cm),
      profile.age,
      act,
    );
  }, [profile]);

  const [pendingPath, setPendingPath] = useState<string | null>(null);

  async function pickImage(f: File | null | undefined) {
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      toast.error("Rasm 5MB dan kichik bo'lsin.");
      return;
    }
    setUploading(true);
    const ext = f.name.split(".").pop() || "jpg";
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("meals").upload(path, f, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) {
      setUploading(false);
      toast.error("Rasmni yuklab bo'lmadi.");
      return;
    }
    // Store storage path; sign short-lived URLs at render time.
    setPendingPath(path);
    // Local preview only — never persisted.
    setPendingImage(URL.createObjectURL(f));
    setUploading(false);
    toast.success("Rasm biriktirildi.");
  }

  async function add() {
    if (!desc.trim()) return;
    const { error } = await supabase.from("meals").insert({
      user_id: userId,
      kind,
      description: desc.trim(),
      calories: cal ? Number(cal) : null,
      image_url: pendingPath,
    });
    if (error) return toast.error("Saqlab bo'lmadi");
    setDesc("");
    setCal("");
    setPendingImage(null);
    setPendingPath(null);
    if (fileRef.current) fileRef.current.value = "";
    toast.success("Ovqat jurnalga qo'shildi.");
    refresh();
  }

  async function del(id: string) {
    await supabase.from("meals").delete().eq("id", id);
    refresh();
  }

  const today = new Date().toISOString().slice(0, 10);
  const todayCal = rows
    .filter((r) => r.logged_date === today)
    .reduce((s, r) => s + (r.calories ?? 0), 0);

  return (
    <AppShell title="Ovqatlanish">
      <PageHero
        eyebrow="Bugungi ovqat"
        title="Ovqatlanish kundaligi."
        subtitle="Nima yeyayotganingni ko'r — nima o'zgartirish kerakligini bil."
      />
      <IfThenHint trigger="stakan choy quysam" action="oldin bir stakan suv ichaman" />

      <div className="mt-4 flex flex-wrap items-center gap-3 text-muted-foreground">
        <span>
          Bugun jami: <span className="text-foreground">{todayCal} kkal</span>
        </span>
        {dailyTarget ? (
          <span className="rounded-full border border-primary/40 bg-primary/5 px-2.5 py-1 font-ui text-[11px] uppercase tracking-[0.2em] text-primary">
            <Calculator className="mr-1 inline h-3 w-3" />
            Maqsad: {dailyTarget} kkal
          </span>
        ) : (
          <span className="text-xs">Bo'y, vazn va yoshni kiriting.</span>
        )}
      </div>

      <Panel className="mt-8 p-5">
        <PanelHeader
          eyebrow="Yangi yozuv"
          title={<h2 className="font-serif text-xl">Bugun nima yeding?</h2>}
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-[160px_1fr_120px_auto]">
          <div>
            <Label htmlFor="mkind">Vaqti</Label>
            <select
              id="mkind"
              value={kind}
              onChange={(e) => setKind(e.target.value)}
              className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="desc">Nima yeding?</Label>
            <Input id="desc" value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="cal">Kkal</Label>
            <Input
              id="cal"
              type="number"
              min={0}
              value={cal}
              onChange={(e) => setCal(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={add} className="w-full">
              Qo'shish
            </Button>
          </div>
          <div className="sm:col-span-4">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) => pickImage(e.target.files?.[0])}
              className="hidden"
              id="mealimg"
            />
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                <Camera className="mr-1 h-4 w-4" />
                {uploading ? "Yuklanmoqda..." : "Rasm qo'shish"}
              </Button>
              <p className="font-ui text-xs text-muted-foreground">Rasm 5MB dan kichik bo'lsin.</p>
              {pendingImage && (
                <img
                  src={pendingImage}
                  alt=""
                  className="ml-auto h-10 w-10 rounded-md object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </Panel>

      <div className="mt-6">
        <PremiumLock title="AI ovqat tahlili Premium a'zolar uchun." />
      </div>

      <section className="mt-8">
        <h2 className="mb-3 font-serif text-2xl">Tarix</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<Utensils className="h-5 w-5" />}
            title="Bugungi ovqat yozilmagan"
            description="Yozib qo'yish — kichik e'tibor. E'tibor esa vaqt o'tib eng katta o'zgarishga aylanadi."
          />
        ) : (
          <div className="space-y-2">
            {rows.map((r) => (
              <Panel key={r.id} as="article" className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {r.image_url ? (
                    <img
                      src={
                        r.image_url.startsWith("http")
                          ? r.image_url
                          : (signedUrls[r.image_url] ?? "")
                      }
                      alt=""
                      className="h-12 w-12 rounded-md object-cover"
                    />
                  ) : (
                    <Utensils className="h-4 w-4 text-primary" />
                  )}
                  <div>
                    <p className="font-serif text-lg">{r.description}</p>
                    <p className="font-ui text-xs uppercase tracking-[0.18em] text-muted-foreground/80">
                      {r.kind} · {new Date(r.logged_date).toLocaleDateString("uz-UZ")}
                      {r.calories ? ` · ${r.calories} kkal` : ""}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => del(r.id)} aria-label="O'chirish">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Panel>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
