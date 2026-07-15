import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation,
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
 * component (avoids two round-trips in beforeLoad).
 */
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
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
  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "ready"; onboarded: boolean }
  >({ status: "loading" });

  useEffect(() => {
    let alive = true;
    supabase
      .from("profiles")
      .select("onboarding_completed_at")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!alive) return;
        setState({
          status: "ready",
          onboarded: Boolean(data?.onboarding_completed_at),
        });
      });
    return () => {
      alive = false;
    };
  }, [userId, location.pathname]);

  if (state.status === "loading") {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isOnOnboarding = location.pathname.startsWith("/onboarding");
  if (!state.onboarded && !isOnOnboarding) {
    throw redirect({ to: "/onboarding" });
  }
  if (state.onboarded && isOnOnboarding) {
    throw redirect({ to: "/dashboard" });
  }

  return <Outlet />;
}
