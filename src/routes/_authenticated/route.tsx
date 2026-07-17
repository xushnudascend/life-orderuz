import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
  const [onboarded, setOnboarded] = useState<boolean | null>(cached ? true : null);

  useEffect(() => {
    let alive = true;
    supabase
      .from("profiles")
      .select("onboarding_completed_at")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!alive) return;
        const ok = Boolean(data?.onboarding_completed_at);
        if (ok) window.localStorage.setItem(cacheKey, "1");
        else window.localStorage.removeItem(cacheKey);
        setOnboarded(ok);
      });
    return () => {
      alive = false;
    };
  }, [userId, cacheKey]);

  const isOnOnboarding = location.pathname.startsWith("/onboarding");

  useEffect(() => {
    if (onboarded === false && !isOnOnboarding) {
      navigate({ to: "/onboarding", replace: true });
    } else if (onboarded === true && isOnOnboarding) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [onboarded, isOnOnboarding, navigate]);

  // Never show a full-screen spinner: render children immediately.
  // Onboarding gate flips silently in the background.
  if (onboarded === false && !isOnOnboarding) return null;
  if (onboarded === true && isOnOnboarding) return null;

  return <Outlet />;
}

