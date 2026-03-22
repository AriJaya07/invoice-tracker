"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import type { SubscriptionInfo } from "@/types";

interface UserMeResponse {
  subscription: SubscriptionInfo;
  trialDaysRemaining: number;
}

export function useSubscription() {
  const { data: session, status } = useSession();
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    if (status !== "authenticated") return;
    try {
      const res = await fetch("/api/users/me");
      if (!res.ok) return;
      const data: UserMeResponse = await res.json();
      setSubscription(data.subscription ?? null);
      setTrialDaysRemaining(data.trialDaysRemaining ?? 0);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (status === "unauthenticated") setLoading(false);
    fetchSubscription();
  }, [fetchSubscription, status]);

  const isActive =
    subscription?.status === "ACTIVE" ||
    (subscription?.status === "TRIALING" && trialDaysRemaining > 0);

  const isTrial = subscription?.status === "TRIALING";
  const isPro = subscription?.plan === "PRO" || subscription?.plan === "BUSINESS";

  return {
    subscription,
    trialDaysRemaining,
    isActive,
    isTrial,
    isPro,
    loading,
    plan: session?.user?.subscriptionPlan ?? subscription?.plan ?? "FREE",
    status: session?.user?.subscriptionStatus ?? subscription?.status ?? null,
    refresh: fetchSubscription,
  };
}
