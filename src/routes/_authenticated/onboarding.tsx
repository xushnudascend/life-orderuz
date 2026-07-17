import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import {
  ONBOARDING_QUESTIONS,
  bmiLabel,
  calcBMI,
  sectionQuestions,
  type OnboardingQuestion,
} from "@/lib/onboarding";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding — Life Order" },
      { name: "robots", content: "noindex" },
    ],
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

  // Ketma-ketlik: avval B bo'lim (naqsh) — 4 ta savol alohida qadamlarda.
  // Oxirgi qadam — A bo'lim (5 ta savol) + reja davomiyligi bitta sahifada.
  const bQuestions = sectionQuestions("B");
  const aQuestions = sectionQuestions("A");
  const total = bQuestions.length + 1; // B + 1 combined page

  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState<7 | 30 | null>(null);
  const [saving, setSaving] = useState(false);

  const isFinalStep = step === bQuestions.length;
  const currentB: OnboardingQuestion | null = isFinalStep ? null : bQuestions[step];

  const sectionLabel = currentB ? "B · Naqshing" : "A · Sen haqingda + Reja";

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
      const actMap: Record<
        string,
        "sedentary" | "light" | "moderate" | "active" | "very_active"
      > = {
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
          sex: typeof sexVal === "string" ? sexMap[sexVal] ?? null : null,
          activity_level: typeof actVal === "string" ? actMap[actVal] ?? null : null,
          plan_length_days: plan,
          archetype: arche.id,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq("id", userId);
      if (profErr) throw profErr;

      toast.success("Tashxis tugadi. Yo'l tuzildi.");
      // Hard nav — _authenticated layout profilni qaytadan o'qishi shart,
      // aks holda eski state onboarded=false qolib, /onboarding'ga qaytaradi.
      window.location.assign("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Saqlanmadi";
      toast.error(msg);
      setSaving(false);
    }
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
              onChange={(v) => setAnswer(currentB.key, v)}
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
            Orqaga
          </Button>

          <Button
            className="font-ui font-semibold"
            onClick={goNext}
            disabled={!canAdvance || saving}
          >
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isFinalStep ? "Yo'lni tuzish" : "Davom etish"}
            {!isFinalStep && <ArrowRight className="ml-1.5 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({
  current,
  total,
  label,
}: {
  current: number;
  total: number;
  label: string;
}) {
  const pct = Math.min(100, Math.round((current / total) * 100));
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="font-ui text-xs uppercase tracking-[0.28em] text-primary">
          {label}
        </p>
        <span className="font-ui text-xs text-muted-foreground tabular-nums">
          {pct}%
        </span>
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
      <h2 className="font-serif text-3xl leading-tight tracking-tight text-balance">
        {q.prompt}
      </h2>
      {q.helper && (
        <p className="mt-3 font-ui text-sm leading-relaxed text-muted-foreground">
          {q.helper}
        </p>
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
              autoFocus
            />
            {q.suffix && (
              <span className="font-ui text-sm text-muted-foreground">
                {q.suffix}
              </span>
            )}
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
        const selected = isMulti
          ? selectedArr.includes(opt.value)
          : selectedStr === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => (isMulti ? onToggleMulti(opt.value) : onChange(opt.value))}
            className={
              selected
                ? "flex w-full items-center justify-between rounded-[var(--radius)] border-2 border-primary bg-primary/5 px-5 py-4 text-left font-ui text-sm transition-all"
                : "lift flex w-full items-center justify-between rounded-[var(--radius)] border border-border bg-card px-5 py-4 text-left font-ui text-sm transition-colors hover:border-foreground/30"
            }
          >
            <span className={selected ? "text-foreground" : "text-foreground/90"}>
              {opt.label}
            </span>
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
}: {
  questions: OnboardingQuestion[];
  answers: Answers;
  onChange: (key: string, value: AnswerValue) => void;
  bmi: number | null;
  plan: 7 | 30 | null;
  onPlanChange: (p: 7 | 30) => void;
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
          Sen haqingda oxirgi ma'lumot
        </h2>
        <p className="mt-2 font-ui text-sm leading-relaxed text-muted-foreground">
          Har bir qatorga bosib, javobingni yoz. Kerak bo'lsa qaytadan ochib tahrirlaysan.
        </p>
      </div>

      <div className="divide-y divide-border/40 overflow-hidden rounded-[var(--radius)] border border-border/60 bg-card/30">
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
                        autoFocus
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
          const planLabel = plan === 7 ? "7 kun — Tez sprint" : plan === 30 ? "30 kun — To'liq o'zgarish" : "—";
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
                  <p className="font-ui text-sm font-medium text-foreground">Reja davomiyligi</p>
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
                    {(
                      [
                        { value: 7 as const, tag: "Tez sprint", title: "7 kun", body: "Bir haftalik intensiv — tez natija." },
                        { value: 30 as const, tag: "To'liq o'zgarish", title: "30 kun", body: "Chuqurroq qayta qurish — odat singiydi." },
                      ]
                    ).map((opt) => {
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
                              ? "rounded-[var(--radius)] border-2 border-primary bg-primary/5 p-4 text-left"
                              : "lift rounded-[var(--radius)] border border-border bg-card p-4 text-left"
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

