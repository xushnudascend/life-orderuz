import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserCog } from "lucide-react";

/**
 * Fast-track ro'yxatdan o'tgan (onboarding to'liq bo'lmagan) foydalanuvchilar
 * uchun dashboard tepasidagi karta. Bosilsa /onboarding'ga olib boradi.
 */
export function ProfileCompletionCard({ missing }: { missing: string[] }) {
  if (missing.length === 0) return null;
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius)] border border-primary/40 bg-primary/5 p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary">
          <UserCog className="h-4 w-4" />
        </span>
        <div>
          <p className="font-serif text-lg leading-tight">
            Profilingni tugat — reja aniqroq bo'ladi
          </p>
          <p className="mt-1 font-ui text-xs text-muted-foreground">
            Yetishmayapti: {missing.join(", ")}
          </p>
        </div>
      </div>
      <Button asChild size="sm">
        <Link to="/onboarding">
          Davom etish <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
