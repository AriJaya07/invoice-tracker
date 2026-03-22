import { z } from "zod";

// ─── AUTH ──────────────────────────────────────────────────────

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// ─── PAYMENT ────────────────────────────────────────────────────

export const createTransactionSchema = z.object({
  plan: z.enum(["PRO", "BUSINESS"]),
  billingPeriod: z.enum(["monthly", "yearly"]),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

// ─── USER PROFILE ───────────────────────────────────────────────

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  companyName: z.string().max(200).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  taxId: z.string().max(50).optional(),
  phone: z.string().max(20).optional(),
  website: z.string().url().optional().or(z.literal("")),
  defaultCurrency: z.string().length(3).optional(),
  defaultPaymentTerms: z.number().int().min(0).max(365).optional(),
  defaultTaxRate: z.number().min(0).max(100).optional(),
  invoicePrefix: z.string().max(20).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
