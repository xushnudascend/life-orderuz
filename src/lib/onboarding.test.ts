import { describe, it, expect } from "vitest";
import {
  calcBMI,
  bmiLabel,
  sectionQuestions,
  firstTaskFromAnswers,
  ONBOARDING_QUESTIONS,
} from "./onboarding";

describe("calcBMI", () => {
  it("to'g'ri BMI hisoblaydi", () => {
    expect(calcBMI(180, 81)).toBe(25);
    expect(calcBMI(170, 60)).toBe(20.8);
  });
  it("to'liq bo'lmagan ma'lumotda null qaytaradi", () => {
    expect(calcBMI(null, 70)).toBeNull();
    expect(calcBMI(180, null)).toBeNull();
    expect(calcBMI(0, 70)).toBeNull();
  });
});

describe("bmiLabel", () => {
  it("chegaralarni to'g'ri belgilaydi", () => {
    expect(bmiLabel(null)).toBeNull();
    expect(bmiLabel(17)).toBe("Kam vazn");
    expect(bmiLabel(22)).toBe("Normal");
    expect(bmiLabel(27)).toBe("Ortiqcha vazn");
    expect(bmiLabel(33)).toBe("Semizlik");
  });
});

describe("sectionQuestions", () => {
  it("bo'limlarni ajratadi va barcha savollarni qamraydi", () => {
    const a = sectionQuestions("A");
    const b = sectionQuestions("B");
    expect(a.length).toBeGreaterThan(0);
    expect(b.length).toBeGreaterThan(0);
    expect(a.length + b.length).toBe(ONBOARDING_QUESTIONS.length);
  });
  it("savol kalitlari unikal", () => {
    const keys = ONBOARDING_QUESTIONS.map((q) => q.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("firstTaskFromAnswers", () => {
  it("deterministik — bir xil kirishda bir xil natija", () => {
    const now = new Date("2026-08-03T09:00:00");
    const answers = { "trigger.core": ["telefon_qaramlik"], "trigger.free_minutes": "5_10" };
    const a = firstTaskFromAnswers(answers, now);
    const b = firstTaskFromAnswers(answers, now);
    expect(a).toEqual(b);
  });

  it("kam uyqu signalini eng yuqori ustuvorlikka qo'yadi", () => {
    const task = firstTaskFromAnswers(
      { "trigger.sleep_hours": "kam_5", "trigger.core": ["telefon_qaramlik"] },
      new Date("2026-08-03T09:00:00"),
    );
    expect(task.title.toLowerCase()).toContain("erta yot");
  });

  it("bo'sh javoblarda ham yaroqli vazifa qaytaradi", () => {
    const task = firstTaskFromAnswers({}, new Date("2026-08-03T20:00:00"));
    expect(task.title.length).toBeGreaterThan(3);
    expect(task.why.length).toBeGreaterThan(3);
    expect(task.minutes).toBeGreaterThan(0);
  });

  it("vaqtga qarab 'qachon' matnini o'zgartiradi", () => {
    const morning = firstTaskFromAnswers({}, new Date("2026-08-03T08:00:00"));
    const evening = firstTaskFromAnswers({}, new Date("2026-08-03T23:30:00"));
    expect(morning.when).not.toBe(evening.when);
  });
});
