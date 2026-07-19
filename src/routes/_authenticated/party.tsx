import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { PageHero } from "@/components/page-hero";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Users, Copy, LogOut, Plus } from "lucide-react";
import { toast } from "sonner";
import { uz } from "@/i18n";

export const Route = createFileRoute("/_authenticated/party")({
  head: () => ({
    meta: [
      { title: `Party Challenge — ${uz.brand.name}` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PartyPage,
});

type Party = {
  id: string;
  owner_id: string;
  name: string;
  goal: string | null;
  invite_code: string;
};
type Member = {
  id: string;
  user_id: string;
  joined_at: string;
  display_name: string | null;
  current_streak: number;
};

function PartyPage() {
  const { userId } = Route.useRouteContext();
  const [loading, setLoading] = useState(true);
  const [parties, setParties] = useState<Party[]>([]);
  const [members, setMembers] = useState<Record<string, Member[]>>({});
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  async function refresh() {
    setLoading(true);
    // Owned parties + parties I'm a member of
    const { data: owned } = await supabase
      .from("party_challenges" as never)
      .select("id, owner_id, name, goal, invite_code")
      .order("created_at", { ascending: false });
    const list = (owned as Party[] | null) ?? [];
    setParties(list);

    // Load members per party
    const membersMap: Record<string, Member[]> = {};
    for (const p of list) {
      const { data: rows } = await supabase
        .from("party_members" as never)
        .select("id, user_id, joined_at")
        .eq("party_id", p.id);
      const raw = (rows as { id: string; user_id: string; joined_at: string }[] | null) ?? [];
      const uids = raw.map((r) => r.user_id);
      let profiles: Record<string, string | null> = {};
      let streaks: Record<string, number> = {};
      if (uids.length) {
        const { data: profs } = await supabase
          .from("profiles")
          .select("id, display_name")
          .in("id", uids);
        for (const pf of (profs as { id: string; display_name: string | null }[] | null) ?? []) {
          profiles[pf.id] = pf.display_name;
        }
        const { data: sts } = await supabase
          .from("streaks")
          .select("user_id, current_days")
          .in("user_id", uids);
        for (const s of (sts as { user_id: string; current_days: number }[] | null) ?? []) {
          streaks[s.user_id] = s.current_days;
        }
      }
      membersMap[p.id] = raw.map((r) => ({
        ...r,
        display_name: profiles[r.user_id] ?? null,
        current_streak: streaks[r.user_id] ?? 0,
      }));
    }
    setMembers(membersMap);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function createParty() {
    if (!name.trim()) return toast.error("Nom kerak.");
    const { data, error } = await supabase
      .from("party_challenges" as never)
      .insert({ owner_id: userId, name: name.trim(), goal: goal.trim() || null } as never)
      .select()
      .maybeSingle();
    if (error) return toast.error("Yaratib bo'lmadi");
    // Owner is auto a member
    const party = data as Party | null;
    if (party) {
      await supabase
        .from("party_members" as never)
        .insert({ party_id: party.id, user_id: userId } as never);
    }
    setName("");
    setGoal("");
    toast.success("Party yaratildi. Taklif kodi bilan do'stlaringni chaqir.");
    refresh();
  }

  async function joinByCode() {
    const code = inviteCode.trim().toLowerCase();
    if (!code) return;
    const { data } = await supabase
      .from("party_challenges" as never)
      .select("id")
      .eq("invite_code", code)
      .maybeSingle();
    const party = data as { id: string } | null;
    if (!party) return toast.error("Kod noto'g'ri.");
    const { error } = await supabase
      .from("party_members" as never)
      .insert({ party_id: party.id, user_id: userId } as never);
    if (error) return toast.error("Qo'shilib bo'lmadi (balki allaqachon a'zosan).");
    setInviteCode("");
    toast.success("Partyga qo'shildingiz.");
    refresh();
  }

  async function leave(partyId: string) {
    await supabase.from("party_members" as never).delete().eq("party_id", partyId).eq("user_id", userId);
    toast.success("Chiqdingiz.");
    refresh();
  }

  return (
    <AppShell title="Party Challenge">
      <PageHero
        eyebrow="Hisobdorlik guruhi"
        title="Party Challenge."
        subtitle="Kichik guruh — kuchli ta'sir. 3-5 kishilik hisobdorlik davrasi tuz va streaklaringni birga saqlanglar."
      />

      {/* Create + Join */}
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-[var(--radius)] border border-border p-5">
          <h2 className="mb-4 flex items-center gap-2 font-serif text-xl">
            <Plus className="h-4 w-4 text-primary" /> Yangi party
          </h2>
          <div className="space-y-3">
            <div>
              <Label htmlFor="pname">Nom</Label>
              <Input id="pname" value={name} onChange={(e) => setName(e.target.value)} placeholder="Masalan, Ertalab Klub" />
            </div>
            <div>
              <Label htmlFor="pgoal">Maqsad (ixtiyoriy)</Label>
              <Textarea id="pgoal" value={goal} onChange={(e) => setGoal(e.target.value)} rows={2} placeholder="30 kun har kuni 6:00'da tur" />
            </div>
            <Button onClick={createParty}>Yaratish</Button>
          </div>
        </div>

        <div className="rounded-[var(--radius)] border border-border p-5">
          <h2 className="mb-4 flex items-center gap-2 font-serif text-xl">
            <Users className="h-4 w-4 text-primary" /> Taklif kodi bilan qo'shilish
          </h2>
          <div className="space-y-3">
            <Input
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="8 belgili kod"
              className="uppercase tracking-widest"
            />
            <Button variant="outline" onClick={joinByCode}>Qo'shilish</Button>
          </div>
        </div>
      </section>

      {/* Parties list */}
      <section className="mt-10">
        <h2 className="mb-4 font-serif text-2xl">Mening guruhlarim</h2>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : parties.length === 0 ? (
          <EmptyState
            icon={<Users className="h-5 w-5" />}
            title="Hali guruhing yo'q"
            description="Yuqoridan yangi guruh yarat yoki do'sting bergan taklif kodini kirit. Kichik doira — kuchli hisobdorlik."
          />

        ) : (
          <div className="space-y-4">
            {parties.map((p) => {
              const isOwner = p.owner_id === userId;
              const list = members[p.id] ?? [];
              return (
                <div key={p.id} className="rounded-[var(--radius)] border border-border bg-card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-serif text-2xl">{p.name}</p>
                      {p.goal && <p className="mt-1 text-sm text-muted-foreground">{p.goal}</p>}
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(p.invite_code);
                          toast.success("Kod nusxa olindi");
                        }}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 font-ui text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="h-3 w-3" /> Kod: {p.invite_code}
                      </button>
                    </div>
                    {!isOwner && (
                      <Button variant="ghost" size="sm" onClick={() => leave(p.id)}>
                        <LogOut className="mr-1 h-4 w-4" /> Chiqish
                      </Button>
                    )}
                    {isOwner && (
                      <span className="font-ui text-[10px] uppercase tracking-[0.22em] text-primary">
                        Egasi
                      </span>
                    )}
                  </div>
                  <div className="mt-4 border-t border-border/60 pt-3">
                    <p className="mb-2 font-ui text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      A'zolar ({list.length})
                    </p>
                    <ul className="space-y-1.5">
                      {list.map((m) => (
                        <li
                          key={m.id}
                          className="flex items-center justify-between font-ui text-sm"
                        >
                          <span>{m.display_name ?? "A'zo"}</span>
                          <span className="text-muted-foreground">
                            Streak: <span className="text-foreground">{m.current_streak}</span> kun
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </AppShell>
  );
}
