import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Compass,
  ListChecks,
  Target,
  BookText,
  Sparkles,
  Dumbbell,
  Salad,
  BarChart3,
  Trophy,
  User,
  Settings,
  Search,
  type LucideIcon,
} from "lucide-react";

type Cmd = { to: string; label: string; icon: LucideIcon; keywords: string };

const CMDS: Cmd[] = [
  { to: "/dashboard", label: "Bosh sahifa", icon: Compass, keywords: "bosh dashboard bugun" },
  { to: "/habits", label: "Odatlar", icon: ListChecks, keywords: "odat habit" },
  { to: "/quests", label: "Vazifalar", icon: Target, keywords: "vazifa quest" },
  { to: "/journal", label: "Kundalik", icon: BookText, keywords: "kundalik journal fikr" },
  { to: "/mentor", label: "Nadir AI", icon: Sparkles, keywords: "nadir mentor ai chat" },
  { to: "/workout", label: "Mashg'ulot", icon: Dumbbell, keywords: "mashgulot workout sport" },
  { to: "/diet", label: "Ovqatlanish", icon: Salad, keywords: "diet ovqat" },
  { to: "/analytics", label: "Tahlil", icon: BarChart3, keywords: "tahlil analytics grafik" },
  { to: "/leaderboard", label: "Reyting", icon: Trophy, keywords: "reyting leaderboard" },
  { to: "/profile", label: "Profil", icon: User, keywords: "profil" },
  { to: "/settings", label: "Sozlamalar", icon: Settings, keywords: "sozlama settings" },
];

/**
 * Kompakt navigatsiya paletka — desktop topbar'ida input, ⌘K/Ctrl+K bilan ochiladi.
 */
export function CommandBar() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = q.trim()
    ? CMDS.filter((c) =>
        (c.label + " " + c.keywords).toLowerCase().includes(q.trim().toLowerCase()),
      )
    : CMDS;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden h-9 items-center gap-2 rounded-md border border-border bg-card/60 px-3 font-ui text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground md:inline-flex"
        aria-label="Qidirish (Cmd+K)"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Sahifa qidirish…</span>
        <kbd className="ml-2 rounded border border-border bg-background px-1.5 py-0.5 font-ui text-[10px] text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-start justify-center bg-background/70 px-4 pt-24 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-lg border border-border bg-card shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-border px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Qayerga bormoqchisiz?"
                className="h-11 flex-1 bg-transparent font-ui text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-ui text-[10px] text-muted-foreground">
                Esc
              </kbd>
            </div>
            <ul className="max-h-80 overflow-y-auto p-1">
              {filtered.length === 0 ? (
                <li className="px-3 py-6 text-center font-ui text-sm text-muted-foreground">
                  Hech narsa topilmadi
                </li>
              ) : (
                filtered.map((c) => {
                  const Icon = c.icon;
                  return (
                    <li key={c.to}>
                      <Link
                        to={c.to}
                        onClick={() => {
                          setOpen(false);
                          setQ("");
                          navigate({ to: c.to });
                        }}
                        className="flex items-center gap-3 rounded-md px-3 py-2.5 font-ui text-sm text-foreground/90 transition-colors hover:bg-primary/10 hover:text-foreground"
                      >
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="flex-1 truncate">{c.label}</span>
                      </Link>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
