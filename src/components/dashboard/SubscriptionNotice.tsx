"use client";

import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Clock } from "lucide-react";

export const SubscriptionNotice = () => {
  const { trialDaysRemaining, isTrial } = useSubscription();

  if (!isTrial) return null;

  return (
    <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 ${
      trialDaysRemaining <= 3 
        ? "bg-red-50 border-red-200 text-red-800" 
        : "bg-blue-50 border-blue-200 text-blue-800"
    }`}>
      <div className="flex items-center gap-3">
        <Clock className="w-5 h-5 opacity-80" />
        <p className="text-sm font-medium">
          {trialDaysRemaining > 0 
            ? `Free trial active: ${trialDaysRemaining} days remaining.` 
            : "Free trial expired. Please upgrade to continue using InvoiceFlow."
          }
        </p>
      </div>
      <Link href="/pricing">
         <Button variant="outline" size="sm" className="bg-white border-transparent hover:bg-gray-50">
           Upgrade Plan
         </Button>
      </Link>
    </div>
  );
};
