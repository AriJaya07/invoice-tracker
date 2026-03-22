"use client";

import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Clock } from "lucide-react";

export const SubscriptionNotice = () => {
  const { trialDaysRemaining, isTrial } = useSubscription();

  if (!isTrial) return null;

  return (
    <div
      role="status"
      className={`flex flex-col items-stretch gap-4 rounded-xl border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between ${
        trialDaysRemaining <= 3
          ? "border-red-200 bg-red-50 text-red-900"
          : "border-blue-200 bg-blue-50 text-blue-900"
      }`}
    >
      <div className="flex items-start gap-3 sm:items-center">
        <Clock className="mt-0.5 h-5 w-5 shrink-0 opacity-80" aria-hidden />
        <p className="text-sm font-medium leading-snug">
          {trialDaysRemaining > 0
            ? `Free trial active: ${trialDaysRemaining} day${trialDaysRemaining === 1 ? "" : "s"} remaining.`
            : "Your free trial has ended. Upgrade to keep using InvoiceFlow."}
        </p>
      </div>
      <Link href="/pricing" className="shrink-0 sm:self-center">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-zinc-200 bg-white hover:bg-zinc-50 sm:w-auto"
        >
          Upgrade plan
        </Button>
      </Link>
    </div>
  );
};
