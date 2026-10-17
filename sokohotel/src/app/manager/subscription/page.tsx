import { Info } from "lucide-react";
import { SubBadge } from "@/components/ui/Badge";
import { Card, PageHeader, SectionTitle } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";
import { getWorkspaceStatus, MANAGERS, requireRole } from "@/lib/session";
import { formatDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { n } from "@/lib/types";
import type { SubStatus } from "@/lib/constants";

export const metadata = { title: "Subscription" };

const NOTICE: Record<SubStatus, string> = {
  trial: "You are on a free trial. Everything works normally.",
  active: "Your subscription is active.",
  past_due: "Your payment is due. Everything keeps working while you arrange payment.",
  grace: "Your plan has ended and you are in a grace period. Everything still works for now.",
  suspended: "Changes are paused because the subscription has lapsed. Your data is safe, and you can still view and export it.",
  cancelled: "This subscription is cancelled. Your data is kept, and you can still view and export it.",
};

export default async function SubscriptionPage() {
  const ctx = await requireRole(MANAGERS);
  const r = ctx.current.restaurant;
  const supabase = await createClient();
  const [status, { data: sub }] = await Promise.all([
    getWorkspaceStatus(r.id),
    supabase.from("subscriptions").select("status, trial_ends_at, current_period_end, grace_days, note, plan_id").maybeSingle(),
  ]);
  const { data: plan } = sub?.plan_id ? await supabase.from("subscription_plans").select("name, description, price_minor, billing_interval, max_staff").eq("id", sub.plan_id).maybeSingle() : { data: null };
  const { data: plans } = await supabase.from("subscription_plans").select("id, name, description, price_minor, billing_interval, max_staff").eq("is_active", true).order("sort_order");
  const eff = status?.status ?? "trial";

  return (
    <>
      <PageHeader title="Subscription" subtitle={r.name} />
      <Card className="p-5">
        <div className="flex flex-wrap items-center gap-3"><h2 className="font-display text-xl font-semibold text-ink">{plan?.name ?? "Free trial"}</h2><SubBadge status={eff} /></div>
        <p className="mt-2 text-[15px] text-ink">{NOTICE[eff]}</p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          {status?.ends_at ? <div><dt className="text-muted">{sub?.status === "trial" ? "Trial ends" : "Current period ends"}</dt><dd className="font-medium text-ink">{formatDate(status.ends_at, r.timezone)}</dd></div> : null}
          <div><dt className="text-muted">Grace period</dt><dd className="font-medium text-ink">{status?.grace_days ?? 7} days</dd></div>
          {plan ? <div><dt className="text-muted">Price</dt><dd className="font-medium text-ink">{formatMoney(plan.price_minor)} per {plan.billing_interval}</dd></div> : null}
        </dl>
        {sub?.note ? <p className="mt-3 text-sm text-muted">{sub.note}</p> : null}
      </Card>

      <SectionTitle>Plans</SectionTitle>
      {plans?.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {plans.map((p) => (
            <Card key={p.id} className="p-5"><h3 className="font-display text-lg font-semibold text-ink">{p.name}</h3><p className="text-ink">{n(p.price_minor) === 0 ? "Free" : `${formatMoney(p.price_minor)} per ${p.billing_interval}`}</p>{p.description ? <p className="mt-1 text-sm text-muted">{p.description}</p> : null}{p.max_staff ? <p className="mt-1 text-sm text-muted">Up to {p.max_staff} staff</p> : null}</Card>
          ))}
        </div>
      ) : (
        <Card className="p-5 text-[15px] text-muted">No paid plans have been published yet.</Card>
      )}

      <Card className="mt-5 flex gap-3 p-5 text-sm text-muted">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
        <div>
          <p>Online card or M-Pesa payment for your SokoHotel subscription is not built into the app yet. Plan changes and renewals are recorded by the SokoHotel team after you pay them directly.</p>
          <p className="mt-2">We never delete your restaurant&apos;s data because of a late payment. If a subscription lapses, the app becomes read-only, and you can still view reports and export your records.</p>
        </div>
      </Card>
    </>
  );
}
