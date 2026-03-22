"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { useSubscription } from "@/hooks/useSubscription";
import { Check } from "lucide-react";
import Script from "next/script";
import { useState } from "react";
import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Free Trial",
    price: "0",
    description: "Perfect for exploring the platform",
    features: [
      "14 days access",
      "Unlimited invoices",
      "Manage up to 5 clients",
      "Basic reports",
    ],
    cta: "Current Plan",
    planId: "FREE",
    isFree: true,
  },
  {
    name: "Pro",
    price: process.env.NEXT_PUBLIC_PRO_MONTHLY_PRICE || "99000",
    description: "Best for freelancers and small teams",
    features: [
      "Everything in Free",
      "Unlimited clients",
      "Advanced tax reports",
      "Custom invoice branding",
      "Recurring invoices",
    ],
    cta: "Upgrade to Pro",
    planId: "PRO",
    highlight: true,
  },
  {
    name: "Business",
    price: process.env.NEXT_PUBLIC_BUSINESS_MONTHLY_PRICE || "199000",
    description: "For growing businesses",
    features: [
      "Everything in Pro",
      "Multi-user support",
      "Team collaboration",
      "Priority support",
      "API access",
    ],
    cta: "Go Business",
    planId: "BUSINESS",
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { plan: currentPlan, isActive, loading } = useSubscription();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    if (loading) return;
    setIsProcessing(planId);

    try {
      const response = await fetch("/api/payments/create-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planId,
          billingPeriod: "monthly",
        }),
      });

      const data = await response.json();

      if (data.snapToken) {
        // @ts-ignore - Midtrans Snap global
        window.snap.pay(data.snapToken, {
          onSuccess: function (result: any) {
            console.log("payment success!", result);
            router.push("/dashboard?payment=success");
          },
          onPending: function (result: any) {
            console.log("payment pending!", result);
            router.push("/dashboard?payment=pending");
          },
          onError: function (result: any) {
            console.log("payment error!", result);
            setIsProcessing(null);
          },
          onClose: function () {
            console.log("customer closed the popup without finishing the payment");
            setIsProcessing(null);
          },
        });
      }
    } catch (error) {
      console.error("Upgrade error", error);
      setIsProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
      />
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-12 text-center sm:mb-16">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-600 sm:text-lg">
            Choose the plan that fits your business. Every plan starts with a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {plans.map((plan) => {
            const isCurrentPlan = currentPlan === plan.planId;
            return (
              <div 
                key={plan.name}
                className={`
                  flex flex-col rounded-2xl border bg-white p-6 transition-shadow duration-300 sm:p-8
                  ${plan.highlight 
                    ? "border-blue-600 shadow-lg ring-2 ring-blue-600 md:z-10 md:-mt-2 md:mb-2 md:scale-[1.02]" 
                    : "border-zinc-200 shadow-sm hover:shadow-md"
                  }
                `}
              >
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-xl font-bold text-zinc-900">{plan.name}</h3>
                  <p className="mt-2 min-h-[2.5rem] text-sm text-zinc-600">{plan.description}</p>
                  <div className="mt-6 flex flex-wrap items-baseline gap-x-1">
                    <span className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
                      Rp{parseInt(plan.price, 10).toLocaleString()}
                    </span>
                    {!plan.isFree ? (
                      <span className="text-sm font-medium text-zinc-500">/month</span>
                    ) : null}
                  </div>
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
                      <span className="text-sm text-zinc-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.highlight ? "primary" : "outline"}
                  isLoading={isProcessing === plan.planId}
                  disabled={isCurrentPlan || (plan.isFree && isActive)}
                  onClick={() => !plan.isFree && handleUpgrade(plan.planId)}
                >
                  {isCurrentPlan ? "Current Plan" : plan.cta}
                </Button>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center sm:mt-20">
          <p className="text-sm text-zinc-600">
            Need a custom plan?{" "}
            <a
              href="#"
              className="font-semibold text-blue-700 underline-offset-2 hover:text-blue-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded-sm"
            >
              Contact sales
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
