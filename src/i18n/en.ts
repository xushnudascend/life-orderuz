import type { Dict } from "./uz";

/**
 * English translation — key entries. Missing keys fall back to Uzbek.
 */
const _en = {
  brand: {
    name: "Life Order",
    features: "Features",
    pricing: "Pricing",
    blog: "Blog",
    faq: "FAQ",
    tagline: "Motivation ends, the system remains.",
    oneLiner:
      "Self-Control OS — the operating system for mastery. 3-minute diagnosis, 3 daily steps, and a relentless AI mentor.",
    disciplineScore: "Discipline Score",
    xp: "XP",
    level: "Level",
    streak: "Streak",
    shield: "Shield",
    pro: "Pro",
    free: "Free",
    monthly: "monthly",
    yearly: "yearly",
  },
  onboarding: {
    title: "Diagnosis",
    subtitle: "Take 60 seconds so we can build a system tailored for you.",
    start: "Start",
    next: "Next",
    back: "Back",
    finish: "Finish",
    questions: {
      goal: "What is your primary goal?",
      focus: "What distracts you the most?",
      rhythm: "When do you feel your energy is at its peak?",
      sleep: "How is your sleep routine?",
      discipline: "How do you rate your current discipline level?",
    },
    messages: {
      finish: "Diagnosis complete. Your discipline path is ready.",
      ahaNote: "Your biorhythms and triggers have been analyzed. Nadir AI has shaped your behavioral architecture:",
      finalStepTitle: "Final details about you",
      finalStepDesc: "Click each row to provide your answer. You can edit them later if needed.",
      planTitle: "Plan Duration",
      socialTitle: "People like you",
      socialArchetype: "There are {count} people in this archetype. ",
      socialPlan: "Of them, {count} are starting their transformation right now.",
      socialVerified: "Verified Social Proof",
      firstWinTitle: "Today's first victory · {minutes} min",
      recommendedTime: "Recommended time",
    },
    plans: {
      sprint: {
        tag: "Fast Sprint",
        title: "7 days",
        desc: "One week of intensity — fast results.",
      },
      long: {
        tag: "Full Transformation",
        title: "30 days",
        desc: "Deeper rebuilding — habits will stick.",
      }
    }
  },
  auth: {
    title: "Sign In",
    subtitle: "Motivation ends. The system remains.",
    signIn: "Sign In",
    signUp: "Sign Up",
    email: "Email",
    password: "Password",
    forgot: "Forgot password?",
    google: "Continue with Google",
    apple: "Continue with Apple",
    microsoft: "Continue with Microsoft",
    or: "or via email",
    privacy: "Privacy and security",
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
    eyebrow: "Self-Control OS",
    title: "Motivation ends. The system remains.",
    subtitle:
      "You don't lack willpower to order your life — you lack an operating system (OS). Life Order turns chaos into three clear daily steps.",
    ctaPrimary: "Take the Diagnosis",
    ctaSecondary: "How it works",
    trustLine: "Try without a card · No fake social proof",
  },
  pillars: {
    heading: "Three pillars — one system",
    subheading:
      "Not a habit tracker. Trigger analysis, three daily steps, and an honest mentor — together.",
    items: [
      {
        tag: "01 · Diagnosis",
        title: "Trigger analysis",
        body: "During onboarding we identify your pattern: distraction, disorder, or purposelessness. The path is built around it.",
      },
      {
        tag: "02 · Practice",
        title: "Three daily steps",
        body: "Every day, three clear actions — no more, no less. Complete them — XP, streak, and Discipline Score grow.",
      },
      {
        tag: "03 · Dialogue",
        title: "Nadir — honest AI mentor",
        body: "Nadir doesn't flatter. Nadir tells the truth — with respect. Plans, asks, stops you if needed.",
      },
    ],
  },
  nervous: {
    heading: "Nervous system — invisible, but you feel it",
    subheading:
      "XP, Streak, Shield and Discipline Score are linked. Computed on the server — no cheating.",
    tiers: [
      { range: "0–19", uz: "Boshlovchi", en: "Beginner" },
      { range: "20–39", uz: "Intizomli", en: "Disciplined" },
      { range: "40–59", uz: "Kuchli", en: "Strong" },
      { range: "60–74", uz: "Elita", en: "Elite" },
      { range: "75–89", uz: "Usta", en: "Master" },
      { range: "90–100", uz: "Apex", en: "Apex" },
    ],
    shield: "Shield — recovers your streak once a week. Supportive, not punitive.",
  },
  mentor: {
    heading: "Who is Nadir?",
    body: "Nadir isn't the assistant who stays up for you. Nadir is a character who watches your choices and answers honestly. No empty \"good job\". What you're doing, why, what's next — those three.",
    quote:
      "«You skipped the workout today. The reason isn't tiredness — it's fear of going to bed. Tomorrow at 22:30, set the phone to silent. Nothing else.»",
    quoteBy: "— Nadir, real chat sample",
  },
  pricing: {
    meta: {
      title: "Pricing — Life Order: Premium & Free Plans",
      description: "Life Order pricing: Free forever and Pro plan features. Pick your plan and start your discipline journey now.",
    },
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
        '"Circle" — community and Party',
        "Leaderboard and achievements",
      ],
      cta: "Upgrade to Premium",
    },
  },
  cta: {
    heading: "Order your life today",
    body: "Get your personal growth protocol through a 3-minute diagnosis. Completely free.",
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
  dashboard: {
    hero: {
      plan: "plan",
      level: "Level",
      xp: "XP",
      streak: "Streak",
      kun: "days",
      discipline: "Discipline",
      greetingPrefix: "Today's",
    },
    sections: {
      problem: "Problem",
      mechanism: "Mechanism",
      urgent: "Urgent",
      dailyLoop: "Daily Loop",
      depth: "Depth",
      habits: "Today's habits",
      quickAccess: "Quick access",
      timetable: "Daily timetable",
    },
    problem: {
      title: "Why is change so hard?",
      subtitle: "We usually start with motivation, but fail because we lack a system.",
      items: [
        {
          t: "Willpower fades",
          d: "Making decisions every day drains your mental energy."
        },
        {
          t: "No clear plan",
          d: "Not knowing what to do leads to instant distraction."
        },
        {
          t: "Invisible progress",
          d: "Missing small wins kills your motivation to continue."
        }
      ]
    },
    mechanism: {
      title: "How Life Order Works",
      steps: [
        {
          n: "01",
          t: "Diagnosis",
          d: "We identify your unique biorhythms and triggers."
        },
        {
          n: "02",
          t: "Protocol",
          d: "3 clear daily actions that save your mental resources."
        },
        {
          n: "03",
          t: "Nadir AI",
          d: "A relentless mentor that keeps you from getting distracted."
        }
      ]
    },
    habits: {
      manage: "Manage",
      emptyTitle: "One small habit starting today",
      emptyDesc: "Start with a 2-minute habit — Nadir will create a personalized plan for you.",
      emptyCta: "Create a plan",
      loading: "Loading...",
    },
    quick: {
      workout: "Workout",
      diet: "Diet",
      quests: "Quests",
      mentor: "Nadir",
    },
    depth: {
      title: "Depth · Nadir, retention, 100 days",
      insightContext: "User: {name}. Today {done}/{total} habits ({percent}%). Streak: {streak} days. Level {level}, XP {xp}. Archetype: {archetype}. Time: {label}.",
    },
  },
  settings: {
    hero: {
      title: "Customize the app for yourself.",
      subtitle: "Manage notifications, language, theme, and profile in one place.",
    },
    profile: {
      title: "Profile",
      name: "Your name",
      public: "Public profile",
      publicHint: "Profile is public. Everyone can see it.",
      privateHint: "Profile is private. Only you can see it.",
    },
    notifications: {
      title: "Notifications",
      daily: "Daily reminder",
      dailyHint: "Every day at the set time",
      streak: "Streak warning",
      streakHint: "When streak is at risk",
      time: "Reminder time",
      browserCta: "Allow browser notifications",
    },
    mentor: {
      title: "AI mentor",
      nadir: "Deep dialogue with Nadir",
      nadirHint: "If enabled — the AI panel on the dashboard will be active",
    },
    animations: {
      title: "Animations",
      all: "All effects",
      enabled: "Animations enabled",
      disabled: "Animations disabled",
      level: "Motion level",
      autoHint: "auto — follows device settings. Select reduced for a quieter experience.",
      reduce: "Reduced",
      full: "Full",
    },
    adaptive: {
      title: "Adaptation",
      shrink: "Automatically scales down tasks on excuses",
      shrinkHint: "Does not punish you — adapts",
    },
    timezone: {
      title: "Timezone",
    },
    language: {
      title: "Language",
    },
    data: {
      title: "Data",
      desc: "You can download all your data in JSON format.",
      download: "Download data",
    },
    contact: {
      title: "Contact us",
      desc: "If you have questions or suggestions:",
    },
    save: "Save",
    saving: "Saving...",
    success: "Settings saved",
    error: "Failed to save",
  },
  faq: {
    items: [
      {
        q: "What is Life Order Pro and how does it differ from the free plan?",
        a: "The Free plan includes basic discipline protocols. The Pro plan provides premium tools such as unlimited mentor memory, weekly AI reports, Shield (streak protection), and burnout signaling."
      },
      {
        q: "What happens if I lose my streak?",
        a: "Life Order is based on the principle of 'Forgiving Discipline'. If a streak is lost, we don't punish you, but we recommend restarting the 66-day automation period. Pro users can use 3 Shields per week."
      },
      {
        q: "Is my data safe?",
        a: "Absolutely. Your data is stored on secure Supabase (Lovable Cloud) servers. We never sell your data to third parties or use it for advertising."
      },
      {
        q: "How is payment handled?",
        a: "For users in Uzbekistan, payment is available via Click and Payme in local currency. For international users, Stripe/Paddle systems are being integrated."
      },
      {
        q: "Can I install the app on my phone?",
        a: "Yes. Life Order is built using PWA (Progressive Web App) technology. You can select 'Add to Home Screen' or 'Install' from your browser menu to use it like a regular app."
      },
      {
        q: "Who is Nadir AI and how does it work?",
        a: "Nadir is an AI mentor based on behavioral psychology. It analyzes your triggers, circadian rhythms, and daily activity to provide advice in 'soft' or 'ruthless' discipline modes."
      }
    ]
  },
  profile: {
    hero: {
      eyebrow: "You",
      subtitle: "Ranking, streak, and shield in one place.",
      publicLink: "View public profile →",
    },
    stats: {
      level: "Level",
      totalXp: "Total XP",
      currentStreak: "Current streak",
      xpHistory: "{delta}% vs last week",
      xpCollecting: "collecting data for last 7 days",
      longestStreak: "longest: {days} days",
    },
    plan: {
      title: "Your Plan",
      label: "Plan",
      days: "{days} days",
      onboarding: "Onboarding",
      longest: "Longest streak",
    },
    username: {
      title: "Username",
      placeholder: "e.g. aziz",
      hint: "Lowercase letters, numbers, underscore only. Min 3 chars.",
      error: "Username must be 3+ chars.",
      saved: "Username saved.",
    },
    shield: {
      title: "Shield",
      desc: "Once a week — protects your streak on a day off.",
      activeUntil: "Active until: {date}",
      limitError: "Shield limit reached for this week.",
      genericError: "Some fields are incorrect.",
      success: "Shield active. Streak preserved for today.",
      cta: "Activate",
      used: "Used",
    },
    actions: {
      back: "Back to today",
      settings: "Settings",
      achievements: "Achievements",
      signOut: "Sign out",
    }
  },
  habits: {
    hero: {
      eyebrow: "Daily Rhythm",
      subtitle: "Today: {done} / {total} completed. Small repetition — big change.",
      forgiving: "Forgiving Streak Active",
    },
    add: {
      title: "Start Small",
      placeholder: "What will you do? (e.g. 2 min reading)",
      difficulty: "Difficulty",
      category: "Category",
      quick: "Quick pick",
      submit: "Add",
      limitError: "3 habit limit on Free plan. Upgrade to Pro for more.",
    },
    categories: {
      body: "Body",
      habit: "Habit",
      learn: "Learn",
      other: "Other",
    },
    empty: {
      title: "No habits added yet",
      desc: "Start with a small and clear habit — e.g. '2 min breathing'. A small start goes a long way.",
    },
    messages: {
      moved: "Moved to tomorrow.",
      alreadyScheduled: "This habit is scheduled for another day.",
      oneLeft: "One step left. Willpower is a muscle.",
      allDone: "Victory! Today's protocol is 100% closed.",
      xpAwarded: "+{xp} XP. Small step, big result.",
    }
  },
  journal: {
    hero: {
      eyebrow: "Reflection",
      title: "Journal",
      subtitle: "Talk to yourself honestly today. Only you read this.",
    },
    add: {
      title: "Write your internal landscape",
      placeholder: "What happened today? What did you avoid? What did you control?",
      submit: "Save",
    },
    empty: {
      title: "No entries yet",
      desc: "Write your mood today. By putting thoughts on paper, you gain control over them.",
    }
  },
};

export const en = _en as unknown as Dict;
