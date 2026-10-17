import { AppShell } from "@/components/AppShell";
import { getWorkspaceStatus, requireRole } from "@/lib/session";
import type { AppRole } from "@/lib/constants";

/** Wraps a role's pages in the app shell after checking the role in the active restaurant. */
export async function RoleLayout({ roles, wide, children }: { roles: AppRole[]; wide?: boolean; children: React.ReactNode }) {
  const ctx = await requireRole(roles);
  const status = await getWorkspaceStatus(ctx.current.restaurant.id);
  return (
    <AppShell ctx={ctx} workspace={ctx.current} status={status} wide={wide}>
      {children}
    </AppShell>
  );
}
