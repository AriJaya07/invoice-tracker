"use client";

import { Check, Clock, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface SubscriptionStatusProps {
  subscription: {
    plan: "FREE" | "PRO" | "BUSINESS";
    status: string;
    trialEndsAt?: Date | null;
    currentPeriodEnd?: Date | null;
  };
}

export const SubscriptionStatus = ({ subscription }: SubscriptionStatusProps) => {
  const isTrial = subscription.status === "TRIALING";
  const planName = subscription.plan === "FREE" ? "Free Trial" : subscription.plan;
  
  const expiryDate = isTrial ? subscription.trialEndsAt : subscription.currentPeriodEnd;
  const daysLeft = expiryDate 
    ? Math.max(0, Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Current Plan Card */}
      <div className="bg-white p-8 rounded-3xl border border-zinc-200/80 shadow-sm flex flex-col justify-between overflow-hidden relative group">
        <div className="absolute -right-8 -top-8 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700">
           <Zap className="w-40 h-40" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 mb-4 bg-blue-50 w-fit px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            Current Plan
          </div>
          <h2 className="text-3xl font-black text-zinc-900">{planName}</h2>
          <p className="text-zinc-500 mt-2 text-sm font-medium">
            {isTrial 
              ? `Your trial period expires in ${daysLeft} days.` 
              : `Your next billing cycle is on ${expiryDate?.toLocaleDateString()}.`
            }
          </p>
        </div>

        <div className="mt-12 flex gap-4 relative z-10">
           <Link href="/pricing" className="flex-1">
              <Button className="w-full gap-2 shadow-xl shadow-blue-600/10">
                <Zap className="w-4 h-4 fill-current" />
                Change Plan
              </Button>
           </Link>
        </div>
      </div>

      {/* Benefits Card */}
      <div className="bg-zinc-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Zap className="w-24 h-24" />
         </div>
         <h3 className="text-lg font-bold mb-6">Plan Benefits</h3>
         <ul className="space-y-4">
            {[
              "Unlimited Invoices",
              "CRM for Clients",
              "PDF Generation",
              "Income Insights",
              "Midtrans Integration"
            ].map(benefit => (
              <li key={benefit} className="flex items-center gap-3 text-sm text-zinc-300">
                <div className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                {benefit}
              </li>
            ))}
         </ul>
      </div>
    </div>
  );
};
