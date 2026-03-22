// Extend NextAuth types to include custom fields
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      subscriptionPlan?: string | null;
      subscriptionStatus?: string | null;
      trialEndsAt?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    subscriptionPlan?: string;
    subscriptionStatus?: string;
    trialEndsAt?: string | null;
  }
}

// ─── Application Types ────────────────────────────────────────────

export type SubscriptionPlan = "FREE" | "PRO" | "BUSINESS";
export type SubscriptionStatus =
  | "TRIALING"
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELLED"
  | "EXPIRED";
export type PaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "EXPIRED"
  | "CANCELLED";

export interface SubscriptionInfo {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  trialEndsAt?: string | null;
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
}

export interface PaymentInfo {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  plan: SubscriptionPlan;
  billingPeriod?: string | null;
  paidAt?: string | null;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  companyName?: string | null;
  companyLogo?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  taxId?: string | null;
  phone?: string | null;
  website?: string | null;
  defaultCurrency: string;
  defaultPaymentTerms: number;
  defaultTaxRate: number;
  invoicePrefix: string;
  trialStartDate?: string | null;
  trialEndDate?: string | null;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  highlighted?: boolean;
  ctaLabel: string;
}
