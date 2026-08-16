import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHero } from "@/components/page-hero";
import { Panel } from "@/components/panel";
import { 
  Dumbbell, 
  GraduationCap, 
  BookText, 
  Users, 
  TrendingUp, 
  Sparkles,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { useT } from "@/i18n/use-t";

export const Route = createFileRoute("/_authenticated/hub")({
  head: () => ({
    meta: [
      { title: "Hub — Life Order" },
      { name: "robots", content: "noindex" }
    ],
  }),
  component: HubPage,
});

const MODULES = [
  {
    to: "/workout",
    icon: Dumbbell,
    title: "Tana",
    desc: "Sog'liq va jismoniy holat tahlili.",
    status: "Faol"
  },
  {
    to: "/c/learn",
    icon: GraduationCap,
    title: "O'rganish",
    desc: "Yangi ko'nikmalar va darslar.",
    status: "2 ta yangi"
  },
  {
    to: "/journal",
    icon: BookText,
    title: "Kundalik",
    desc: "Fikrlar va his-tuyg'ular qaydi.",
    status: "Bugun yozilmadi"
  },
  {
    to: "/community",
    icon: Users,
    title: "Davra",
    desc: "Hamjamiyat va guruhlar.",
    status: "15 ta faol"
  },
  {
    to: "/analytics",
    icon: TrendingUp,
    title: "Tahlil",
    desc: "Haftalik va oylik progress.",
    status: "Yaxshi"
  },
  {
    to: "/roadmap",
    icon: Calendar,
    title: "Yo'l xaritasi",
    desc: "Uzoq muddatli maqsadlar.",
    status: "30%"
  }
];

function HubPage() {
  const { t } = useT();
  if (!t) return null;

  return (
    <AppShell title="Hub">
      <PageHero
        eyebrow="Ekotizim"
        title="Hub."
        subtitle="Life Order modullari xaritasi. Barcha imkoniyatlar bir joyda."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((m) => (
          <Link key={m.to} to={m.to as any} className="group">
            <Panel className="h-full border-border/60 bg-secondary p-6 transition-all hover:border-primary/50 hover:bg-primary/5 shadow-premium group-active:scale-[0.98]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <m.icon className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2 tracking-tight group-hover:text-primary transition-colors">
                {m.title}
              </h3>
              <p className="mb-4 font-ui text-sm text-muted-foreground leading-relaxed">
                {m.desc}
              </p>
              <div className="flex items-center gap-2 font-ui text-[10px] uppercase tracking-widest text-primary/80">
                <CheckCircle2 className="h-3 w-3" />
                {m.status}
              </div>
            </Panel>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
