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
    <div className="min-h-screen bg-gray-50">
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
      />
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that's right for your business. All plans start with a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const isCurrentPlan = currentPlan === plan.planId;
            return (
              <div 
                key={plan.name}
                className={`
                  bg-white rounded-2xl border p-8 flex flex-col transition-all duration-300
                  ${plan.highlight 
                    ? "ring-2 ring-blue-600 shadow-xl scale-105 z-10" 
                    : "border-gray-200 shadow-sm hover:shadow-md"
                  }
                `}
              >
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="mt-2 text-gray-500 text-sm h-10">{plan.description}</p>
                  <div className="mt-6 flex items-baseline">
                    <span className="text-4xl font-extrabold text-gray-900">
                      Rp{parseInt(plan.price).toLocaleString()}
                    </span>
                    {!plan.isFree && <span className="ml-1 text-gray-500">/mo</span>}
                  </div>
                </div>

                <ul className="flex-1 space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-gray-600 text-sm">{feature}</span>
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

        <div className="mt-20 text-center">
          <p className="text-gray-500">
            Need a custom plan? <a href="#" className="text-blue-600 font-medium">Contact Sales</a>
          </p>
        </div>
      </main>
    </div>
  );
}
