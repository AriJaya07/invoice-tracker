import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSubscription } from "@/services/subscription.service";
import { SubscriptionStatus } from "@/components/dashboard/SubscriptionStatus";
import { PaymentHistoryTable } from "@/components/dashboard/PaymentHistoryTable";

export default async function SubscriptionPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const subscription = await getSubscription(session.user.id);
  
  // Create a default free trial subscription object if none exists for UI safety
  const subData = subscription || {
    plan: "FREE" as const,
    status: "TRIALING",
    trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">Subscription</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage your plan and view billing history.</p>
      </div>

      <SubscriptionStatus subscription={subData as any} />

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Billing History</h2>
          <p className="text-sm text-zinc-500">Recents payments and invoices.</p>
        </div>
        <PaymentHistoryTable userId={session.user.id} />
      </section>
    </div>
  );
}
