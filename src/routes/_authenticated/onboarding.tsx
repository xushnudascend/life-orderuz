import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles, Target } from "lucide-react";
import { useT } from "@/i18n/use-t";
import {
  ONBOARDING_QUESTIONS,
  bmiLabel,
  calcBMI,
  sectionQuestions,
  firstTaskFromAnswers,
  type OnboardingQuestion,
} from "@/lib/onboarding";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [{ title: "Tashxis — Life Order" }, { name: "robots", content: "noindex" }],
  }),
  component: Onboarding,
});

/**
 * Javob qiymati:
 *  - single/number: string
 *  - multi: string[] (DBga vergul bilan saqlanadi)
 */
type AnswerValue = string | string[];
type Answers = Record<string, AnswerValue>;

function Onboarding() {
  const { userId } = Route.useRouteContext();
  const { t } = useT();
  if (!t) return null;
  const navigate = useNavigate();

  // Ketma-ketlik: avval B bo'lim (naqsh) — barcha savollar alohida qadamlarda.
  // Oxirgi qadam — A bo'lim (barcha savollar) bitta sahifada.
  const bQuestions = useMemo(() => sectionQuestions("B"), []);
  const aQuestions = useMemo(() => sectionQuestions("A"), []);
  const total = bQuestions.length + 1; // B sections + 1 final page for A

  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState<7 | 30 | null>(null);
  const [saving, setSaving] = useState(false);
  const [ahaNudge, setAhaNudge] = useState<string | null>(null);
  const [archetypeName, setArchetypeName] = useState<string>("");

  const progressPercent = Math.round(((step + 1) / total) * 100);

  const isFinalStep = step === bQuestions.length;
  const currentB: OnboardingQuestion | null = isFinalStep ? null : bQuestions[step];
  const sectionLabel = currentB ? `Naqshingiz tahlili` : "Siz haqingizda";

  const bmi = useMemo(() => {
    const h = Number(answers["profile.height_cm"]);
    const w = Number(answers["profile.weight_kg"]);
    return calcBMI(h, w);
  }, [answers]);

  function isAnswered(q: OnboardingQuestion): boolean {
    const v = answers[q.key];
    if (q.type === "multi") return Array.isArray(v) && v.length > 0;
    return typeof v === "string" && v.length > 0;
  }

  const canAdvance = currentB
    ? isAnswered(currentB)
    : aQuestions.every(isAnswered) && plan !== null;

  function setAnswer(key: string, value: AnswerValue) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function toggleMulti(key: string, val: string) {
    setAnswers((prev) => {
      const cur = Array.isArray(prev[key]) ? (prev[key] as string[]) : [];
      const next = cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val];
      return { ...prev, [key]: next };
    });
  }

  function goBack() {
    if (step === 0) return;
    setStep((s) => s - 1);
  }
  function goNext() {
    if (!canAdvance) return;
    if (step < total - 1) setStep((s) => s + 1);
    else void submit();
  }

  async function submit() {
    if (saving) return;
    setSaving(true);
    try {
      const rows = Object.entries(answers).map(([question_key, val]) => ({
        user_id: userId,
        question_key,
        answer_value: Array.isArray(val) ? val.join(",") : val,
      }));
      const { error: ansErr } = await supabase
        .from("onboarding_answers")
        .upsert(rows, { onConflict: "user_id,question_key" });
      if (ansErr) throw ansErr;

      const ageNum = Number(answers["profile.age"]);
      const heightNum = Number(answers["profile.height_cm"]);
      const weightNum = Number(answers["profile.weight_kg"]);
      const sexMap: Record<string, "male" | "female" | "other" | "prefer_not_say"> = {
        erkak: "male",
        ayol: "female",
        boshqa: "other",
        aytmayman: "prefer_not_say",
      };
      const actMap: Record<string, "sedentary" | "light" | "moderate" | "active" | "very_active"> =
        {
          kam_harakat: "sedentary",
          engil: "light",
          o_rta: "moderate",
          faol: "active",
          juda_faol: "very_active",
        };

      const { archetypeFromAnswers } = await import("@/lib/nervous");
      const energyTime = answers["trigger.energy_time"];
      const arche = archetypeFromAnswers({
        goal: "",
        best_time: typeof energyTime === "string" ? energyTime : "",
      });

      const sexVal = answers["profile.sex"];
      const actVal = answers["profile.activity"];

      const { error: profErr } = await supabase
        .from("profiles")
        .update({
          age: Number.isFinite(ageNum) ? ageNum : null,
          height_cm: Number.isFinite(heightNum) ? heightNum : null,
          weight_kg: Number.isFinite(weightNum) ? weightNum : null,
          sex: typeof sexVal === "string" ? (sexMap[sexVal] ?? null) : null,
          activity_level: typeof actVal === "string" ? (actMap[actVal] ?? null) : null,
          plan_length_days: plan,
          archetype: arche.id,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq("id", userId);
      if (profErr) throw profErr;

      toast.success(t("onboarding.messages.finish"));
      setArchetypeName(arche.id);

      // "Aha!" — shaxsiy nudge (best-effort, xatolarda dashbordga to'g'ridan-to'g'ri o'tamiz)
      try {
        const { data: sess } = await supabase.auth.getSession();
        const token = sess.session?.access_token;
        if (token && plan) {
          const triggerKeys = bQuestions.map((q) => q.key);
          const triggers: string[] = [];
          for (const k of triggerKeys) {
            const v = answers[k];
            if (Array.isArray(v)) triggers.push(...v);
            else if (typeof v === "string" && v) triggers.push(v);
          }
          const res = await fetch("/api/ai/onboarding-nudge", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              archetype: arche.id,
              energyTime: typeof energyTime === "string" ? energyTime : "",
              planDays: plan,
              triggers: triggers.slice(0, 10),
            }),
          });
          if (res.ok) {
            const j = (await res.json()) as { nudge?: string };
            if (j.nudge) {
              setAhaNudge(j.nudge);
              setSaving(false);
              return;
            }
          }
        }
      } catch {
        // ignore — fall through to redirect
      }

      // AI nudge bo'lmasa ham "Aha" ekrani ko'rsatiladi — birinchi qadam u yerda.
      setAhaNudge((cur) => cur ?? "");
      setSaving(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Saqlanmadi";
      toast.error(msg);
      setSaving(false);
    }
  }

  if (ahaNudge !== null) {
    return (
      <div className="min-h-dvh bg-background text-foreground relative overflow-hidden flex items-center justify-center">
        {/* Apple-style background refinement */}
        <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] animate-orb-float rounded-full bg-primary/5 blur-[120px]" />
        
        <div className="mx-auto max-w-2xl px-5 py-16 relative z-10 w-full">
          <div className="animate-fade-in-up rounded-[32px] border border-border/40 bg-secondary p-8 md:p-12 shadow-premium backdrop-blur-4xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 font-ui text-[11px] font-bold uppercase tracking-[0.2em] text-primary shadow-[0_0_20px_hsl(var(--primary)/0.2)]">
              <Sparkles className="h-4 w-4" />
              {t("onboarding.finish")}
            </div>
            <h1 className="mb-4 font-serif text-[36px] leading-[0.95] tracking-tighter sm:text-[48px]">
              {t("brand.oneLiner").split(".")[0]}.
            </h1>
            <p className="mb-8 text-lg text-muted-foreground/80 font-ui leading-relaxed">
              {t("onboarding.messages.ahaNote")}
            </p>
            {archetypeName && (
              <p className="mb-6 font-ui text-[10px] font-bold uppercase tracking-[0.3em] text-primary/80">
                {t("brand.disciplineScore")} · {archetypeName.replace('_', ' ')}
              </p>
            )}
            {ahaNudge && (
              <div className="whitespace-pre-line rounded-2xl border border-primary/20 bg-primary/5 p-6 font-body text-base leading-relaxed text-foreground shadow-inner">
                {ahaNudge}
              </div>
            )}
            
            <SocialMirror t={t} />
            <div className="mt-8">
              <FirstTaskCard answers={answers} t={t} />
            </div>
            
            <Button
              className="mt-10 w-full h-14 rounded-full font-ui text-base font-semibold shadow-[0_20px_40px_-12px_hsl(var(--primary)/0.5)] transition-all hover:scale-[1.02]"
              size="lg"
              onClick={() => navigate({ to: "/dashboard" })}
            >
              {t("onboarding.start")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-xl px-5 py-10">
        <ProgressBar current={step + 1} total={total} label={sectionLabel} />

        <div className="mt-4 flex flex-wrap gap-1.5">
          {Array.from({ length: total }, (_, i) => {
            const done =
              i < bQuestions.length
                ? isAnswered(bQuestions[i])
                : aQuestions.every(isAnswered) && plan !== null;
            const active = i === step;
            const reachable = done || active || i <= step + 1;
            return (
              <button
                key={i}
                type="button"
                disabled={!reachable}
                onClick={() => reachable && setStep(i)}
                className={
                  "h-7 min-w-7 rounded-md border px-2 font-ui text-[11px] tabular-nums transition-colors " +
                  (active
                    ? "border-primary bg-primary/10 text-primary"
                    : done
                      ? "border-border bg-card text-foreground hover:border-primary/40"
                      : reachable
                        ? "border-dashed border-border text-muted-foreground hover:text-foreground"
                        : "border-dashed border-border/40 text-muted-foreground/40 cursor-not-allowed")
                }
                aria-label={`Qadam ${i + 1}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        <div className="mt-10 animate-fade-in-up">
          {currentB ? (
            <QuestionCard
              q={currentB}
              value={answers[currentB.key]}
              onChange={(v) => {
                setAnswer(currentB.key, v);
                // Single-choice — avtomatik keyingi savolga o'tish
                if (currentB.type === "single") {
                  setTimeout(() => {
                    setStep((s) => (s < total - 1 ? s + 1 : s));
                  }, 300);
                }
              }}
              onToggleMulti={(v) => toggleMulti(currentB.key, v)}
            />
          ) : (
            <FinalPage
              questions={aQuestions}
              answers={answers}
              onChange={(k, v) => setAnswer(k, v)}
              bmi={bmi}
              plan={plan}
              onPlanChange={setPlan}
              t={t}
            />
          )}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <Button
            variant="ghost"
            className="font-ui"
            onClick={goBack}
            disabled={step === 0 || saving}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            {t("onboarding.back")}
          </Button>

          <Button
            size="lg"
            className="group h-12 rounded-full px-7 font-ui font-semibold transition-all duration-300 hover:shadow-[0_12px_40px_-16px_hsl(var(--primary)/0.7)] active:scale-[0.98] disabled:opacity-40"
            onClick={goNext}
            disabled={!canAdvance || saving}
          >
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isFinalStep ? t("onboarding.finish") : t("onboarding.next")}
            {!isFinalStep && (
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ current, total, label }: { current: number; total: number; label: string }) {
  const pct = Math.min(100, Math.round((current / total) * 100));
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="font-ui text-xs uppercase tracking-[0.28em] text-primary">{label}</p>
        <span className="font-ui text-xs text-muted-foreground tabular-nums">{pct}%</span>
      </div>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function QuestionCard({
  q,
  value,
  onChange,
  onToggleMulti,
}: {
  q: OnboardingQuestion;
  value: AnswerValue | undefined;
  onChange: (v: string) => void;
  onToggleMulti: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="font-serif text-3xl leading-tight tracking-tight text-balance">{q.prompt}</h2>
      {q.helper && (
        <p className="mt-3 font-ui text-sm leading-relaxed text-muted-foreground">{q.helper}</p>
      )}
      <div className="mt-8">
        {q.type === "number" ? (
          <div className="flex items-baseline gap-3">
            <Input
              type="number"
              inputMode="numeric"
              min={q.min}
              max={q.max}
              value={typeof value === "string" ? value : ""}
              onChange={(e) => onChange(e.target.value)}
              className="w-40 font-serif text-3xl h-auto py-3"
            />

            {q.suffix && <span className="font-ui text-sm text-muted-foreground">{q.suffix}</span>}
          </div>
        ) : (
          <OptionList q={q} value={value} onChange={onChange} onToggleMulti={onToggleMulti} />
        )}
      </div>
    </div>
  );
}

function OptionList({
  q,
  value,
  onChange,
  onToggleMulti,
}: {
  q: OnboardingQuestion;
  value: AnswerValue | undefined;
  onChange: (v: string) => void;
  onToggleMulti: (v: string) => void;
}) {
  const isMulti = q.type === "multi";
  const selectedArr = isMulti && Array.isArray(value) ? value : [];
  const selectedStr = !isMulti && typeof value === "string" ? value : "";

  return (
    <div className="space-y-2">
      {q.options?.map((opt) => {
        const selected = isMulti ? selectedArr.includes(opt.value) : selectedStr === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => (isMulti ? onToggleMulti(opt.value) : onChange(opt.value))}
            className={
              selected
                ? "flex w-full items-center justify-between rounded-[var(--radius-md)] border-2 border-primary bg-primary/5 px-5 py-4 text-left font-ui text-sm transition-all"
                : "lift flex w-full items-center justify-between rounded-[var(--radius-md)] border border-border bg-card px-5 py-4 text-left font-ui text-sm transition-colors hover:border-foreground/30"
            }
          >
            <span className={selected ? "text-foreground" : "text-foreground/90"}>{opt.label}</span>
            <span
              aria-hidden
              className={
                selected
                  ? isMulti
                    ? "grid h-5 w-5 place-items-center rounded-[4px] bg-primary"
                    : "grid h-5 w-5 place-items-center rounded-full bg-primary"
                  : isMulti
                    ? "h-5 w-5 rounded-[4px] border border-border"
                    : "h-5 w-5 rounded-full border border-border"
              }
            >
              {selected && (
                <span
                  className={
                    isMulti
                      ? "block h-2 w-2 rounded-[1px] bg-primary-foreground"
                      : "block h-1.5 w-1.5 rounded-full bg-primary-foreground"
                  }
                />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function FinalPage({
  questions,
  answers,
  onChange,
  bmi,
  plan,
  onPlanChange,
  t,
}: {
  questions: OnboardingQuestion[];
  answers: Answers;
  onChange: (key: string, value: AnswerValue) => void;
  bmi: number | null;
  plan: 7 | 30 | null;
  onPlanChange: (p: 7 | 30) => void;
  t: any;
}) {
  // Har bir savol yig'ilib turadi — ustiga bossa ochiladi.
  // Boshida — birinchi javob berilmagan savol avtomatik ochiladi.
  const firstUnanswered =
    questions.find((q) => {
      const v = answers[q.key];
      return !(typeof v === "string" && v.length > 0) && !(Array.isArray(v) && v.length > 0);
    })?.key ?? (plan === null ? "__plan__" : questions[0].key);

  const [openKey, setOpenKey] = useState<string | null>(firstUnanswered);

  function toggle(key: string) {
    setOpenKey((cur) => (cur === key ? null : key));
  }

  function summary(q: OnboardingQuestion): string {
    const v = answers[q.key];
    if (q.type === "number") {
      if (typeof v !== "string" || !v) return "—";
      return `${v}${q.suffix ? " " + q.suffix : ""}`;
    }
    if (typeof v !== "string" || !v) return "—";
    return q.options?.find((o) => o.value === v)?.label ?? v;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl leading-tight tracking-tight text-balance sm:text-3xl">
          {t("onboarding.messages.finalStepTitle")}
        </h2>
        <p className="mt-2 font-ui text-sm leading-relaxed text-muted-foreground">
          {t("onboarding.messages.finalStepDesc")}
        </p>
      </div>

      <div className="divide-y divide-border/40 overflow-hidden rounded-[var(--radius-md)] border border-border/60 bg-card/30">
        {questions.map((q) => {
          const isOpen = openKey === q.key;
          const answered = summary(q) !== "—";
          return (
            <div key={q.key}>
              <button
                type="button"
                onClick={() => toggle(q.key)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-card/60"
                aria-expanded={isOpen}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-ui text-sm font-medium text-foreground">{q.prompt}</p>
                  <p
                    className={
                      "mt-1 truncate font-ui text-xs " +
                      (answered ? "text-primary" : "text-muted-foreground")
                    }
                  >
                    {summary(q)}
                  </p>
                </div>
                <span
                  aria-hidden
                  className={
                    "shrink-0 font-ui text-lg text-muted-foreground transition-transform " +
                    (isOpen ? "rotate-45" : "")
                  }
                >
                  +
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-border/40 px-5 pb-5 pt-4 animate-fade-in">
                  {q.type === "number" ? (
                    <div className="flex items-baseline gap-3">
                      <Input
                        type="number"
                        inputMode="numeric"
                        min={q.min}
                        max={q.max}
                        value={typeof answers[q.key] === "string" ? (answers[q.key] as string) : ""}
                        onChange={(e) => onChange(q.key, e.target.value)}
                        className="w-32 font-serif text-2xl h-auto py-2"
                      />

                      {q.suffix && (
                        <span className="font-ui text-sm text-muted-foreground">{q.suffix}</span>
                      )}
                      {q.key === "profile.weight_kg" && bmi && (
                        <span className="font-ui text-xs text-muted-foreground ml-2">
                          BMI: <span className="text-foreground">{bmi}</span> ({bmiLabel(bmi)})
                        </span>
                      )}
                    </div>
                  ) : (
                    <OptionList
                      q={q}
                      value={answers[q.key]}
                      onChange={(v) => {
                        onChange(q.key, v);
                        setOpenKey(null); // tanlangach yopib qo'yamiz — qulaylik uchun
                      }}
                      onToggleMulti={() => {}}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Reja davomiyligi — xuddi savolga o'xshab yig'iladigan qator */}
        {(() => {
          const isOpen = openKey === "__plan__";
          const planLabel =
            plan === 7 ? "7 kun — Tez sprint" : plan === 30 ? "30 kun — To'liq o'zgarish" : "—";
          const answered = plan !== null;
          return (
            <div>
              <button
                type="button"
                onClick={() => toggle("__plan__")}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-card/60"
                aria-expanded={isOpen}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-ui text-sm font-medium text-foreground">{t("onboarding.messages.planTitle")}</p>
                  <p
                    className={
                      "mt-1 truncate font-ui text-xs " +
                      (answered ? "text-primary" : "text-muted-foreground")
                    }
                  >
                    {planLabel}
                  </p>
                </div>
                <span
                  aria-hidden
                  className={
                    "shrink-0 font-ui text-lg text-muted-foreground transition-transform " +
                    (isOpen ? "rotate-45" : "")
                  }
                >
                  +
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-border/40 px-5 pb-5 pt-4 animate-fade-in">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      {
                        value: 7 as const,
                        tag: t("onboarding.plans.sprint.tag"),
                        title: t("onboarding.plans.sprint.title"),
                        body: t("onboarding.plans.sprint.desc"),
                      },
                      {
                        value: 30 as const,
                        tag: t("onboarding.plans.long.tag"),
                        title: t("onboarding.plans.long.title"),
                        body: t("onboarding.plans.long.desc"),
                      },
                    ].map((opt) => {
                      const selected = plan === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            onPlanChange(opt.value);
                            setOpenKey(null);
                          }}
                          className={
                            selected
                              ? "rounded-[var(--radius-md)] border-2 border-primary bg-primary/5 p-4 text-left"
                              : "lift rounded-[var(--radius-md)] border border-border bg-card p-4 text-left"
                          }
                        >
                          <span className="font-ui text-[10px] uppercase tracking-[0.22em] text-primary">
                            {opt.tag}
                          </span>
                          <h4 className="mt-2 font-serif text-xl">{opt.title}</h4>
                          <p className="mt-1 font-ui text-xs text-muted-foreground">{opt.body}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

function SocialMirror({ t }: { t: any }) {
  const [data, setData] = useState<{ sameArchetype: number; samePlan: number } | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { archetypePeers } = await import("@/lib/cohort.functions");
        const res = await archetypePeers();
        if (!cancelled) setData({ sameArchetype: res.sameArchetype, samePlan: res.samePlan });
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <div className="mt-8 relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent blur-lg opacity-50" />
      <div className="relative rounded-[var(--radius-md)] border border-border/60 bg-background/60 p-5 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-6 w-6 rounded-full border-2 border-background bg-muted overflow-hidden">
                <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/40" />
              </div>
            ))}
          </div>
          <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
            {t("onboarding.messages.socialTitle")}
          </p>
        </div>
        <p className="font-ui text-[14px] leading-relaxed text-foreground/90">
          {t("onboarding.messages.socialArchetype").replace("{count}", ((data?.sameArchetype ?? 0) + 1240).toString())}
          {t("onboarding.messages.socialPlan").replace("{count}", ((data?.samePlan ?? 0) + 820).toString())}
        </p>
        <div className="mt-3 flex items-center gap-1.5 font-ui text-[11px] text-muted-foreground/60 italic">
          <Check className="h-3 w-3 text-primary" />
          {t("onboarding.messages.socialVerified")}
        </div>
      </div>
    </div>
  );
}

function FirstTaskCard({ answers, t }: { answers: Answers; t: any }) {
  const task = useMemo(() => firstTaskFromAnswers(answers), [answers]);
  return (
    <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-[inset_0_0_20px_rgba(45,212,191,0.05)]">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-4 w-4 text-primary" />
        <p className="font-ui text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
          {t("onboarding.messages.firstWinTitle").replace("{minutes}", task.minutes.toString())}
        </p>
      </div>
      <h2 className="font-serif text-2xl leading-tight tracking-tight text-foreground">{task.title}</h2>
      <p className="mt-3 font-ui text-[14px] leading-relaxed text-muted-foreground/90 border-l-2 border-primary/30 pl-4 py-1">
        {task.why}
      </p>
      <div className="mt-5 flex items-center gap-2 font-ui text-[10px] font-bold uppercase tracking-[0.1em] text-primary/80">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        {t("onboarding.messages.recommendedTime")}: {task.when}
      </div>
    </div>
  );
}
