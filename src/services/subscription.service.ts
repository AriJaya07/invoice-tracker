import { db } from "@/lib/db";

export async function getSubscription(userId: string) {
  return db.subscription.findUnique({ where: { userId } });
}

export async function isTrialActive(userId: string): Promise<boolean> {
  const sub = await db.subscription.findUnique({ where: { userId } });
  if (!sub) return false;
  if (sub.status !== "TRIALING") return false;
  if (!sub.trialEndsAt) return true; // no end date = trial active
  return sub.trialEndsAt > new Date();
}

export async function isSubscriptionActive(userId: string): Promise<boolean> {
  const sub = await db.subscription.findUnique({ where: { userId } });
  if (!sub) return false;

  if (sub.status === "ACTIVE") {
    if (sub.currentPeriodEnd && sub.currentPeriodEnd < new Date()) return false;
    return true;
  }

  if (sub.status === "TRIALING") {
    return isTrialActive(userId);
  }

  return false;
}

export async function activateSubscription(
  userId: string,
  plan: "PRO" | "BUSINESS",
  paymentId: string
) {
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1); // default 1-month

  return db.subscription.update({
    where: { userId },
    data: {
      plan,
      status: "ACTIVE",
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    },
  });
}

export async function getTrialDaysRemaining(userId: string): Promise<number> {
  const sub = await db.subscription.findUnique({ where: { userId } });
  if (!sub || sub.status !== "TRIALING" || !sub.trialEndsAt) return 0;

  const now = new Date();
  const diff = sub.trialEndsAt.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
