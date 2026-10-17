import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { RESTAURANT_COLUMNS, ROLE_HOME, WORKSPACE_COOKIE, type AppRole } from "@/lib/constants";
import type { Membership, Profile, Restaurant, WorkspaceStatus } from "@/lib/types";

export interface Workspace {
  membership: Membership;
  restaurant: Restaurant;
}

export interface AppContext {
  user: User;
  profile: Profile;
  workspaces: Workspace[];
  /** The active workspace. Null until the user belongs to a restaurant. */
  current: Workspace | null;
}

/**
 * Loads the verified user, their active memberships and the selected
 * workspace. The workspace cookie is only a preference: it is checked against
 * the memberships the database returned, never trusted by itself.
 */
export const getContext = cache(async (): Promise<AppContext | null> => {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: memberships }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, phone").eq("id", user.id).maybeSingle(),
    supabase
      .from("memberships")
      .select("id, restaurant_id, user_id, role, status, created_at")
      .eq("user_id", user.id)
      .eq("status", "active"),
  ]);

  let workspaces: Workspace[] = [];
  const rows = (memberships ?? []) as Membership[];
  if (rows.length) {
    const { data: restaurants } = await supabase
      .from("restaurants")
      .select(RESTAURANT_COLUMNS)
      .in(
        "id",
        rows.map((m) => m.restaurant_id),
      );
    const byId = new Map((restaurants as Restaurant[] | null)?.map((r) => [r.id, r]) ?? []);
    workspaces = rows
      .map((membership) => ({ membership, restaurant: byId.get(membership.restaurant_id)! }))
      .filter((w) => w.restaurant)
      .sort((a, b) => a.restaurant.name.localeCompare(b.restaurant.name));
  }

  const store = await cookies();
  const wanted = store.get(WORKSPACE_COOKIE)?.value;
  const current = workspaces.find((w) => w.restaurant.id === wanted) ?? (workspaces.length === 1 ? workspaces[0] : null);

  return {
    user,
    profile: (profile as Profile | null) ?? { id: user.id, full_name: "", phone: null },
    workspaces,
    current,
  };
});

/** Where a signed-in person should land. */
export function homeFor(ctx: AppContext): string {
  if (ctx.current) return ROLE_HOME[ctx.current.membership.role];
  if (ctx.workspaces.length > 1) return "/workspace";
  return "/onboarding";
}

/**
 * Guards a page or action. Redirects when the person is signed out, has no
 * workspace, or their role in the active workspace is not allowed.
 */
export async function requireRole(allowed: AppRole[]): Promise<AppContext & { current: Workspace }> {
  const ctx = await getContext();
  if (!ctx) redirect("/login");
  if (!ctx.current) redirect(homeFor(ctx));
  if (!allowed.includes(ctx.current.membership.role)) redirect(ROLE_HOME[ctx.current.membership.role]);
  return ctx as AppContext & { current: Workspace };
}

export const MANAGERS: AppRole[] = ["owner", "manager"];
export const WAITER_ACCESS: AppRole[] = ["waiter", "owner", "manager"];
export const KITCHEN_ACCESS: AppRole[] = ["kitchen", "owner", "manager"];
export const CASHIER_ACCESS: AppRole[] = ["cashier", "owner", "manager"];

export async function getWorkspaceStatus(restaurantId: string): Promise<WorkspaceStatus | null> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("workspace_status", { p_restaurant: restaurantId });
  return (data as WorkspaceStatus | null) ?? null;
}
