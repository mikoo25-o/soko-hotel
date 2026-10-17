"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ClipboardCheck, ShoppingBag } from "lucide-react";
import { RoleGlyph } from "@/components/RoleGlyph";
import { cn } from "@/lib/cn";

export interface PickerLocation {
  id: string;
  name: string;
  area: string;
  kind: "table" | "takeaway";
  occupied: boolean;
}

export function TablePicker({ locations, areas }: { locations: PickerLocation[]; areas: string[] }) {
  const [area, setArea] = useState(areas[0] ?? "");
  const [selected, setSelected] = useState<string | null>(null);
  const shown = locations.filter((l) => l.area === area);
  const chosen = locations.find((l) => l.id === selected);

  return (
    <>
      <div role="tablist" aria-label="Areas" className="scroll-hide -mx-4 mb-4 flex gap-2 overflow-x-auto px-4">
        {areas.map((a) => {
          const on = a === area;
          return (
            <button
              key={a}
              role="tab"
              type="button"
              aria-selected={on}
              onClick={() => setArea(a)}
              className={cn(
                "inline-flex min-h-11 shrink-0 items-center rounded-xl border px-4 text-[15px] font-semibold",
                on ? "border-primary bg-primary text-white" : "border-line bg-white text-ink hover:bg-canvas",
              )}
            >
              {a}
            </button>
          );
        })}
      </div>

      <ul className="grid grid-cols-2 gap-3 pb-24 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {shown.map((l) => {
          const on = l.id === selected;
          return (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => setSelected(l.id)}
                aria-pressed={on}
                className={cn(
                  "flex w-full flex-col items-start rounded-2xl border bg-white p-3.5 text-left shadow-card transition-colors",
                  on ? "border-2 border-primary bg-primary/5" : "border-line hover:border-primary/60",
                )}
              >
                {l.kind === "takeaway" ? <ShoppingBag className="h-9 w-9 text-primary" aria-hidden /> : <RoleGlyph name="table" className={cn("h-11 w-16", on ? "text-primary" : "text-muted")} />}
                <span className="mt-2 text-base font-semibold text-ink">{l.name}</span>
                <span
                  className={cn(
                    "mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    l.occupied ? "bg-warn/10 text-warn" : "bg-action/15 text-forest",
                  )}
                >
                  <span className={cn("h-2 w-2 rounded-full", l.occupied ? "bg-warn" : "bg-action")} aria-hidden />
                  {l.occupied ? "Occupied" : "Available"}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="fixed inset-x-0 bottom-16 z-20 border-t border-line bg-white/95 px-4 py-3 backdrop-blur-none lg:bottom-0 lg:left-60">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ClipboardCheck className="h-6 w-6" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-ink">{chosen ? `${chosen.name} selected` : "No table selected"}</p>
            <p className="truncate text-sm text-muted">{chosen ? (chosen.occupied ? "Already has an order. A new order will be added." : "Ready to add items to the order") : "Tap a table to start an order"}</p>
          </div>
          {chosen ? (
            <Link href={`/waiter/order/new?table=${chosen.id}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 font-semibold text-white hover:bg-forest">
              Continue <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
          ) : (
            <span className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-line px-5 font-semibold text-muted" aria-disabled>
              Continue <ArrowRight className="h-5 w-5" aria-hidden />
            </span>
          )}
        </div>
      </div>
    </>
  );
}
