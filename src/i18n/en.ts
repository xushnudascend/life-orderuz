import type { Dict } from "./uz";

/**
 * English translation — key entries. Missing keys fall back to Uzbek.
 */
const _en = {
  brand: {
    name: "Life Order",
    tagline: "Put your life in order",
    oneLiner:
      "Self-Control OS — the operating system for self-mastery. Trigger analysis, three clear daily steps, an honest AI mentor named Nadir. 60-second diagnosis. No card.",
  },
  nav: {
    features: "Features",
    method: "Method",
    mentor: "Mentor",
    pricing: "Pricing",
    signIn: "Sign in",
    startFree: "Start free",
  },
  hero: {
    eyebrow: "Beta · No card",
    title: "Losing control isn't a disease — it's a missing system.",
    subtitle:
      "Life Order turns your day into three clear steps. No emojis. No preaching. Nadir — the honest AI mentor — speaks truth to you.",
    ctaPrimary: "Get the 60-second diagnosis",
    ctaSecondary: "See the method",
    trustLine: "No card · Uzbek-first · PWA — installs to phone",
  },
  pillars: {
    heading: "Three pillars — one system",
    subheading:
      "Not a habit tracker. Trigger analysis, three daily steps, and an honest mentor — together.",
    items: [
      { tag: "01 · Diagnosis", title: "Trigger analysis", body: "During onboarding we identify your pattern: distraction, disorder, or purposelessness. The path is built around it." },
      { tag: "02 · Practice",  title: "Three daily steps", body: "Every day, three clear actions — no more, no less. Complete them — XP, streak, and Discipline Score grow." },
      { tag: "03 · Dialogue",  title: "Nadir — honest AI mentor", body: "Nadir doesn't flatter. Nadir tells the truth — with respect. Plans, asks, stops you if needed." },
    ],
  },
  nervous: {
    heading: "Nervous system — invisible, but you feel it",
    subheading:
      "XP, Streak, Shield and Discipline Score are linked. Computed on the server — no cheating.",
    tiers: [
      { range: "0–19",  uz: "Boshlovchi", en: "Beginner" },
      { range: "20–39", uz: "Intizomli",  en: "Disciplined" },
      { range: "40–59", uz: "Kuchli",     en: "Strong" },
      { range: "60–74", uz: "Elita",      en: "Elite" },
      { range: "75–89", uz: "Usta",       en: "Master" },
      { range: "90–100",uz: "Apex",       en: "Apex" },
    ],
    shield: "Shield — recovers your streak once a week. Supportive, not punitive.",
  },
  mentor: {
    heading: "Who is Nadir?",
    body:
      "Nadir isn't the assistant who stays up for you. Nadir is a character who watches your choices and answers honestly. No empty \"good job\". What you're doing, why, what's next — those three.",
    quote:
      "«You skipped the workout today. The reason isn't tiredness — it's fear of going to bed. Tomorrow at 22:30, set the phone to silent. Nothing else.»",
    quoteBy: "— Nadir, real chat sample",
  },
  pricing: {
    heading: "Pricing — simple",
    subheading: "Try without a card. If you don't like it — no trace stays.",
    free: {
      title: "Free",
      price: "0 UZS",
      period: "always",
      features: [
        "Three daily steps",
        "Habits and streak",
        "Chat with Nadir 5×/week",
        "Basic stats",
      ],
      cta: "Sign up",
    },
    premium: {
      title: "Premium",
      price: "$4.99",
      period: "per month · 7-day free trial",
      badge: "Recommended",
      features: [
        "Unlimited Nadir chat",
        "Daily AI analysis and plan",
        "Workout + Diet module",
        "\"Circle\" — community and Party",
        "Leaderboard and achievements",
      ],
      cta: "Start 7 days free",
    },
  },
  cta: {
    heading: "Start today. Tomorrow is late.",
    body: "60-second onboarding. No card. Don't like it — no trace stays.",
    button: "Take the diagnosis",
  },
  footer: {
    tagline: "Self-Control OS — built in Uzbek.",
    beta: "Beta · No fake quotes · Real users",
    links: {
      terms: "Terms",
      privacy: "Privacy",
      refund: "Refund",
      security: "Security",
    },
    rights: "© 2026 Life Order. All rights reserved.",
  },
};

export const en = _en as unknown as Dict;
