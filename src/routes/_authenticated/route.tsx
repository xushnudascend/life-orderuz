import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Authenticated layout.
 *
 * ssr:false — session is in browser localStorage, unreachable from the server.
 * beforeLoad gate: requires a Supabase user, else → /auth.
 * Onboarding routing: reads profile.onboarding_completed_at inside the
 * component and navigates via useNavigate (avoid throwing during render).
 */
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/auth" });
    }
    return { userId: data.user.id };
  },
  component: AuthenticatedShell,
});

function AuthenticatedShell() {
  const { userId } = Route.useRouteContext();
  const location = useLocation();
  const navigate = useNavigate();
  const cacheKey = `lo:onboarded:${userId}`;
  const cached = typeof window !== "undefined" && window.localStorage.getItem(cacheKey) === "1";
  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "ready"; onboarded: boolean }
  >(cached ? { status: "ready", onboarded: true } : { status: "loading" });

  useEffect(() => {
    let alive = true;
    supabase
      .from("profiles")
      .select("onboarding_completed_at")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) {
          console.error("[auth] profile fetch failed", error);
        }
        const onboarded = Boolean(data?.onboarding_completed_at);
        if (onboarded) window.localStorage.setItem(cacheKey, "1");
        else window.localStorage.removeItem(cacheKey);
        setState({ status: "ready", onboarded });
      });
    return () => {
      alive = false;
    };
  }, [userId]);

  const isOnOnboarding = location.pathname.startsWith("/onboarding");
  const needsOnboarding =
    state.status === "ready" && !state.onboarded && !isOnOnboarding;
  const shouldLeaveOnboarding =
    state.status === "ready" && state.onboarded && isOnOnboarding;

  useEffect(() => {
    if (needsOnboarding) {
      navigate({ to: "/onboarding", replace: true });
    } else if (shouldLeaveOnboarding) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [needsOnboarding, shouldLeaveOnboarding, navigate]);

  if (state.status === "loading" || needsOnboarding || shouldLeaveOnboarding) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <Outlet />;
}
