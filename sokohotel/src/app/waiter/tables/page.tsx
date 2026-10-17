import Link from "next/link";
import { Armchair } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/ui/Card";
import { LiveRefresh } from "@/components/LiveRefresh";
import { TablePicker, type PickerLocation } from "@/components/waiter/TablePicker";
import { createClient } from "@/lib/supabase/server";
import { requireRole, WAITER_ACCESS } from "@/lib/session";
import type { ServiceLocation } from "@/lib/types";

export const metadata = { title: "Choose a table" };

export default async function TablesPage() {
  const ctx = await requireRole(WAITER_ACCESS);
  const supabase = await createClient();
  const [{ data: locs }, { data: occ }] = await Promise.all([
    supabase.from("service_locations").select("id, name, area, kind, seats, is_active, sort_order").eq("is_active", true).order("sort_order").order("name"),
    supabase.rpc("occupied_locations", { p_restaurant: ctx.current.restaurant.id }),
  ]);
  const occupied = new Set(((occ ?? []) as unknown as (string | { occupied_locations: string })[]).map((r) => (typeof r === "string" ? r : r.occupied_locations)));
  const rows = (locs ?? []) as ServiceLocation[];
  const locations: PickerLocation[] = rows
    .map((l) => ({ id: l.id, name: l.name, area: l.area, kind: l.kind, occupied: occupied.has(l.id) }))
    // Natural order so Table 2 comes before Table 10.
    .sort((a, b) => a.area.localeCompare(b.area) || a.name.localeCompare(b.name, undefined, { numeric: true }));
  const areas = [...new Set(locations.map((l) => l.area))].sort((a, b) => (a === "Takeaway" ? 1 : b === "Takeaway" ? -1 : a.localeCompare(b)));
  const isManager = ["owner", "manager"].includes(ctx.current.membership.role);

  return (
    <>
      <LiveRefresh restaurantId={ctx.current.restaurant.id} />
      <PageHeader title="Choose a table" subtitle="Select the table where you want to take the order." />
      {locations.length === 0 ? (
        <EmptyState
          icon={<Armchair className="h-6 w-6" aria-hidden />}
          title="No tables have been set up yet"
          action={isManager ? <Link href="/manager/settings" className="font-semibold text-primary underline underline-offset-4">Add tables in Settings</Link> : undefined}
        >
          {isManager ? "Add your tables and service areas, then you can take orders." : "Ask your manager to add the restaurant's tables."}
        </EmptyState>
      ) : (
        <TablePicker locations={locations} areas={areas} />
      )}
    </>
  );
}
