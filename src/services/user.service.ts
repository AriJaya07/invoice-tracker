import { db } from "@/lib/db";

const TRIAL_DAYS = parseInt(process.env.TRIAL_DURATION_DAYS ?? "14", 10);

export async function getUserById(id: string) {
  return db.user.findUnique({
    where: { id },
    include: { subscription: true },
  });
}

export async function getUserByEmail(email: string) {
  return db.user.findUnique({ where: { email } });
}

export async function updateUser(
  id: string,
  data: Partial<{
    name: string;
    companyName: string;
    companyLogo: string;
    address: string;
    city: string;
    country: string;
    taxId: string;
    phone: string;
    website: string;
    defaultCurrency: string;
    defaultPaymentTerms: number;
    defaultTaxRate: number;
    defaultInvoiceNote: string;
    invoicePrefix: string;
  }>
) {
  return db.user.update({ where: { id }, data });
}

/**
 * Creates a new email/password user with a 14-day free trial subscription.
 * Called from the /api/auth/register route.
 */
export async function createUserWithTrial(input: {
  name: string;
  email: string;
  hashedPassword: string;
}) {
  const now = new Date();
  const trialEnd = new Date(now);
  trialEnd.setDate(trialEnd.getDate() + TRIAL_DAYS);

  return db.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: input.hashedPassword,
      trialStartDate: now,
      trialEndDate: trialEnd,
      subscription: {
        create: {
          plan: "FREE",
          status: "TRIALING",
          trialEndsAt: trialEnd,
        },
      },
    },
    include: { subscription: true },
  });
}
