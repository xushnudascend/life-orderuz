import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
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

type Answers = Record<string, string>;

function Onboarding() {
  const navigate = useNavigate();
  const { userId } = Route.useRouteContext();
  const total = ONBOARDING_QUESTIONS.length + 1; // +1 for plan-duration step
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState<7 | 30 | null>(null);
  const [saving, setSaving] = useState(false);

  const currentQuestion: OnboardingQuestion | null =
    step < ONBOARDING_QUESTIONS.length ? ONBOARDING_QUESTIONS[step] : null;
  const isPlanStep = step === ONBOARDING_QUESTIONS.length;

  const sectionA = sectionQuestions("A").length;
  const sectionLabel = currentQuestion
    ? currentQuestion.section === "A"
      ? "A · Sen haqingda"
      : "B · Naqshing"
    : "Reja davomiyligi";

  const bmi = useMemo(() => {
    const h = Number(answers["profile.height_cm"]);
    const w = Number(answers["profile.weight_kg"]);
    return calcBMI(h, w);
  }, [answers]);

  const canAdvance = currentQuestion
    ? Boolean(answers[currentQuestion.key])
    : plan !== null;

  function setAnswer(key: string, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
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
      // 1) Save all answers (source Uzbek strings)
      const rows = Object.entries(answers).map(([question_key, answer_value]) => ({
        user_id: userId,
        question_key,
        answer_value,
      }));
      const { error: ansErr } = await supabase
        .from("onboarding_answers")
        .upsert(rows, { onConflict: "user_id,question_key" });
      if (ansErr) throw ansErr;

      // 2) Update profile physical fields + plan + completion
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

      // Archetype tanlash — javoblar asosida
      const { archetypeFromAnswers } = await import("@/lib/nervous");
      const arche = archetypeFromAnswers({
        goal: answers["profile.goal"] ?? answers["goal"] ?? "",
        best_time: answers["profile.best_time"] ?? answers["best_time"] ?? "",
      });

      const { error: profErr } = await supabase
        .from("profiles")
        .update({
          age: Number.isFinite(ageNum) ? ageNum : null,
          height_cm: Number.isFinite(heightNum) ? heightNum : null,
          weight_kg: Number.isFinite(weightNum) ? weightNum : null,
          sex: sexMap[answers["profile.sex"]] ?? null,
          activity_level: actMap[answers["profile.activity"]] ?? null,
          plan_length_days: plan,
          archetype: arche.id,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq("id", userId);
      if (profErr) throw profErr;

      toast.success("Tashxis tugadi. Yo'l tuzildi.");
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Saqlanmadi";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-xl px-5 py-10">
        <ProgressBar current={step + 1} total={total} label={sectionLabel} />

        <div className="mt-10 animate-fade-in-up">
          {currentQuestion ? (
            <QuestionCard
              q={currentQuestion}
              value={answers[currentQuestion.key]}
              onChange={(v) => setAnswer(currentQuestion.key, v)}
              extra={
                currentQuestion.key === "profile.weight_kg" && bmi ? (
                  <p className="mt-3 font-ui text-xs text-muted-foreground">
                    BMI: <span className="text-foreground">{bmi}</span>{" "}
                    <span className="text-muted-foreground/80">
                      ({bmiLabel(bmi)})
                    </span>
                  </p>
                ) : null
              }
            />
          ) : (
            <PlanCard plan={plan} onChange={setPlan} />
          )}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <Button
            variant="ghost"
            className="font-ui"
            onClick={goBack}
            disabled={step === 0}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Orqaga
          </Button>

          {step < sectionA && (
            <span className="font-ui text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Savol {step + 1} / {total}
            </span>
          )}

          <Button
            className="font-ui font-semibold"
            onClick={goNext}
            disabled={!canAdvance || saving}
          >
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPlanStep ? "Yo'lni tuzish" : "Davom etish"}
            {!isPlanStep && <ArrowRight className="ml-1.5 h-4 w-4" />}
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
  extra,
}: {
  q: OnboardingQuestion;
  value: string | undefined;
  onChange: (v: string) => void;
  extra?: React.ReactNode;
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
              value={value ?? ""}
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
          <div className="space-y-2">
            {q.options?.map((opt) => {
              const selected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange(opt.value)}
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
                        ? "grid h-5 w-5 place-items-center rounded-full bg-primary"
                        : "h-5 w-5 rounded-full border border-border"
                    }
                  >
                    {selected && (
                      <span className="block h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}
        {extra}
      </div>
      <div className="mt-6">
        <Label className="font-ui text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Kalit: {q.key}
        </Label>
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  onChange,
}: {
  plan: 7 | 30 | null;
  onChange: (v: 7 | 30) => void;
}) {
  const options: { value: 7 | 30; title: string; body: string; tag: string }[] = [
    {
      value: 7,
      tag: "Tez sprint",
      title: "7 kun",
      body: "Bir haftalik intensiv boshlash — kichik odatlar, tez natija.",
    },
    {
      value: 30,
      tag: "To'liq o'zgarish",
      title: "30 kun",
      body: "Bir oy davomida chuqur qayta qurish — odatlar tanaga singiydi.",
    },
  ];
  return (
    <div>
      <h2 className="font-serif text-3xl leading-tight tracking-tight text-balance">
        Reja davomiyligini tanla
      </h2>
      <p className="mt-3 font-ui text-sm leading-relaxed text-muted-foreground">
        Har ikkisi ham ishlaydi. Farqi — bosim va tezlikda.
      </p>
      <div className="mt-8 grid gap-3 md:grid-cols-2">
        {options.map((opt) => {
          const selected = plan === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={
                selected
                  ? "rounded-[var(--radius)] border-2 border-primary bg-primary/5 p-6 text-left"
                  : "lift rounded-[var(--radius)] border border-border bg-card p-6 text-left"
              }
            >
              <span className="font-ui text-xs uppercase tracking-[0.22em] text-primary">
                {opt.tag}
              </span>
              <h3 className="mt-3 font-serif text-2xl">{opt.title}</h3>
              <p className="mt-2 font-ui text-sm text-muted-foreground">
                {opt.body}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
