import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Loader2, Sparkles, Target, ShieldCheck, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/panel";
import { PageHero } from "@/components/page-hero";
import { QUESTIONS, SCALES, LIKERT_LABELS, computeAllScores, type ScaleKey } from "@/lib/assessment-scales";
import { submitAssessment } from "@/lib/assessment.functions";

export const Route = createFileRoute("/_authenticated/assessment")({
  head: () => ({
    meta: [
      { title: "Human Potential Assessment — Life Order" },
      { name: "description", content: "3 daqiqada psixologik profilingizni aniqlang. Human Potential Score va shaxsiy yo'l xarita." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AssessmentPage,
});

type Phase = "intro" | "questions" | "computing" | "reveal";

function AssessmentPage() {
  const navigate = useNavigate();
  const submit = useServerFn(submitAssessment);
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [scores, setScores] = useState<ReturnType<typeof computeAllScores> | null>(null);
  const [commitName, setCommitName] = useState("");

  const total = QUESTIONS.length;
  const current = QUESTIONS[step];
  const progress = Math.round(((step + (answers[current?.key ?? ""] ? 1 : 0)) / total) * 100);

  const scaleMeta = useMemo(
    () => (current ? SCALES.find((s) => s.key === current.scale)! : null),
    [current],
  );

  const finalizingRef = useRef(false);

  function setAnswer(key: string, val: number) {
    let latest: Record<string, number> = {};
    setAnswers((prev) => {
      latest = { ...prev, [key]: val };
      return latest;
    });
    // auto-advance 300ms after tap (dopamine RPE — anticipation)
    setTimeout(() => {
      if (Object.keys(latest).length >= total) {
        if (finalizingRef.current) return;
        finalizingRef.current = true;
        void finalize(latest);
      } else {
        setStep((s) => (s + 1 >= total ? s : s + 1));
      }
    }, 280);
  }

  async function finalize(final: Record<string, number>) {
    setPhase("computing");
    // preview compute (client) for animation
    const preview = computeAllScores(final);
    setScores(preview);
    try {
      const res = await submit({ data: { responses: final } });
      setScores(res.scores);
      // reveal after 1.8s anticipation
      setTimeout(() => setPhase("reveal"), 1400);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Xatolik";
      toast.error(msg);
      finalizingRef.current = false;
      setPhase("questions");
    }
  }

  async function commitAndGo() {
    setSaving(true);
    try {
      navigate({ to: "/roadmap" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl px-4 py-8 sm:px-6">
      {phase === "intro" && <Intro onStart={() => setPhase("questions")} />}

      {phase === "questions" && current && scaleMeta && (
        <div className="animate-in fade-in duration-300">
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="uppercase tracking-widest">{scaleMeta.short}</span>
              <span>
                {step + 1} / {total}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted/40">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Panel>
            <p className="text-xs uppercase tracking-widest text-amber-400/80">
              {scaleMeta.title}
            </p>
            <h2 className="mt-2 text-xl font-semibold leading-snug sm:text-2xl">
              {current.prompt}
            </h2>

            <div className="mt-6 grid gap-2">
              {[1, 2, 3, 4, 5].map((v) => {
                const selected = answers[current.key] === v;
                return (
                  <button
                    key={v}
                    onClick={() => setAnswer(current.key, v)}
                    className={`group relative flex items-center justify-between overflow-hidden rounded-lg border px-4 py-3.5 text-left transition-all duration-200 will-change-transform active:scale-[0.98] ${
                      selected
                        ? "border-amber-500/70 bg-amber-500/[0.12] text-foreground shadow-[0_0_0_1px_hsl(var(--primary)/0.35),0_10px_30px_-12px_hsl(var(--primary)/0.5)] scale-[1.015]"
                        : "border-border/60 bg-card/40 text-muted-foreground hover:border-amber-500/40 hover:bg-amber-500/[0.06] hover:text-foreground hover:translate-x-0.5"
                    }`}
                  >
                    {selected && (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -z-0 animate-[pulse_1.2s_ease-out_1] bg-gradient-to-r from-transparent via-amber-400/10 to-transparent"
                      />
                    )}
                    <span className="relative z-10 text-sm">{LIKERT_LABELS[v]}</span>
                    <span
                      className={`relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
                        selected
                          ? "border-amber-400 bg-amber-400 shadow-[0_0_18px_hsl(var(--primary)/0.75)] scale-110"
                          : "border-muted-foreground/30 group-hover:border-amber-400/60"
                      }`}
                      aria-hidden
                    >
                      {selected ? (
                        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 text-background animate-in zoom-in-50 duration-300">
                          <path
                            d="M4 10.5l3.5 3.5L16 6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : null}
                    </span>
                    {selected && (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-amber-400/30 animate-ping"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> Orqaga
              </Button>
              <p className="text-xs text-muted-foreground">
                Halol javob bering — natija sizga ishlaydi.
              </p>
            </div>
          </Panel>
        </div>
      )}

      {phase === "computing" && (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-amber-500/20" />
            <Loader2 className="relative h-10 w-10 animate-spin text-amber-400" aria-hidden />
          </div>
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            Skorlar hisoblanmoqda
          </p>
          <p className="max-w-xs text-xs text-muted-foreground">
            9 shkala, {total} javob — psixologik profil qurilyapti.
          </p>
        </div>
      )}

      {phase === "reveal" && scores && (
        <div className="animate-in fade-in duration-500">
          <PageHero
            eyebrow="Human Potential Assessment"
            title={'Sizning hozirgi "men" — yakuniy "men" emas.'}
            subtitle="Bu 9 shkala bo'yicha bugungi holatingiz. Har biri o'zgarishi mumkin."
          />

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ScoreRing label="Human Potential" value={scores.potential} accent tone="amber" />
            <ScoreRing label="Discipline" value={scores.discipline} icon={<ShieldCheck className="h-4 w-4" />} />
            <ScoreRing label="Focus" value={scores.focus} icon={<Target className="h-4 w-4" />} />
            <ScoreRing label="Addiction Risk" value={scores.addiction_risk} icon={<Flame className="h-4 w-4" />} inverse />
          </div>

          <Panel className="mt-4">
            <p className="text-xs uppercase tracking-widest text-amber-400/80">
              9 shkala tafsiloti
            </p>
            <div className="mt-3 space-y-2">
              {SCALES.map((s) => {
                const v = scores.scales[s.key];
                const good = s.higherIsBetter ? v : 100 - v;
                return (
                  <div key={s.key} className="flex items-center gap-3">
                    <span className="w-32 shrink-0 text-xs text-muted-foreground">{s.title}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted/40">
                      <div
                        className="h-full bg-amber-500 transition-all duration-700"
                        style={{ width: `${good}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-xs tabular-nums text-foreground">
                      {v}
                    </span>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel className="mt-4">
            <p className="text-xs uppercase tracking-widest text-amber-400/80">
              Bir marta so'z bering
            </p>
            <h3 className="mt-2 text-lg font-semibold">
              Ushbu yo'lni jiddiy oling — o'zingizga aytib qo'ying.
            </h3>
            <div className="mt-3 rounded-lg border border-border/60 bg-card/40 p-4 font-mono text-sm leading-relaxed">
              <p>
                Men <span className="text-amber-400">{commitName || "___"}</span>, bugun,{" "}
                <span className="text-amber-400">{new Date().toLocaleDateString("uz-UZ")}</span>{" "}
                sanasida, o'zimga so'z beraman: Life Order yo'lini kamida 21 kun jiddiy sinab
                ko'raman.
              </p>
            </div>
            <input
              type="text"
              value={commitName}
              onChange={(e) => setCommitName(e.target.value.slice(0, 40))}
              placeholder="Ismingizni yozing"
              className="mt-3 w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-amber-500/60"
              maxLength={40}
            />
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={() => navigate({ to: "/dashboard" })}
                className="flex-1"
                size="lg"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Dashboardga o'tish
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                onClick={commitAndGo}
                variant="outline"
                disabled={saving}
                className="flex-1"
                size="lg"
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Yo'l xaritani ko'rish
              </Button>
            </div>
          </Panel>
        </div>
      )}
    </main>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-[60vh] py-8">
      <PageHero
        eyebrow="Human Potential Assessment"
        title={'Sizning hozirgi "men" — yakuniy "men" emas.'}
        subtitle="3 daqiqa. 9 shkala. Halol javoblar. So'ngida — sizga xos yo'l xarita."
      />
      <Panel className="mt-6">
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>· Impulsni boshqarish, uyqu, ma'no — 9 psixologik o'lchov.</li>
          <li>· Har savolga bitta javob. Orqaga qaytish mumkin.</li>
          <li>· Skorlar faqat sizga ko'rinadi — bo'lishmaymiz, sotmaymiz.</li>
          <li>· Testni istagan vaqtda takrorlashingiz mumkin (progress kuzatiladi).</li>
        </ul>
        <div className="mt-4 flex gap-2">
          <Button onClick={onStart} className="flex-1">
            Boshlash <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/dashboard">Keyinroq</Link>
          </Button>
        </div>
      </Panel>
    </div>
  );
}

function ScoreRing({
  label,
  value,
  accent,
  icon,
  inverse,
  tone,
}: {
  label: string;
  value: number;
  accent?: boolean;
  icon?: React.ReactNode;
  inverse?: boolean;
  tone?: "amber";
}) {
  // For addiction_risk, "inverse" means visual ring fills same but color shifts red
  const size = 96;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value)) / 100;
  const offset = c - pct * c;
  const color = inverse
    ? value > 60
      ? "#ef4444"
      : value > 40
      ? "#f59e0b"
      : "#10b981"
    : tone === "amber"
    ? "#f59e0b"
    : "#e5e7eb";
  return (
    <div
      className={`flex items-center gap-4 rounded-lg border p-4 ${
        accent
          ? "border-amber-500/40 bg-amber-500/[0.04]"
          : "border-border/60 bg-card/40"
      }`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
        <text
          x="50%"
          y="52%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-foreground text-xl font-semibold tabular-nums"
        >
          {value}
        </text>
      </svg>
      <div>
        <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground">
          {icon}
          {label}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {inverse ? "past — yaxshi" : "yuqori — yaxshi"}
        </p>
      </div>
    </div>
  );
}
