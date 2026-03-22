import { db } from "@/lib/db";
import {
  createSnapToken,
  generateOrderId,
  verifyMidtransSignature,
} from "@/lib/midtrans";
import { activateSubscription } from "./subscription.service";

const PRICE_MAP: Record<string, Record<string, number>> = {
  PRO: {
    monthly: parseInt(process.env.NEXT_PUBLIC_PRO_MONTHLY_PRICE ?? "99000"),
    yearly: parseInt(process.env.NEXT_PUBLIC_PRO_YEARLY_PRICE ?? "990000"),
  },
  BUSINESS: {
    monthly: parseInt(
      process.env.NEXT_PUBLIC_BUSINESS_MONTHLY_PRICE ?? "199000"
    ),
    yearly: parseInt(
      process.env.NEXT_PUBLIC_BUSINESS_YEARLY_PRICE ?? "1990000"
    ),
  },
};

/**
 * Creates a Midtrans payment transaction and stores it in the database.
 * Returns the Snap token and order ID for the frontend popup.
 */
export async function createMidtransTransaction(
  userId: string,
  plan: "PRO" | "BUSINESS",
  billingPeriod: "monthly" | "yearly"
) {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const amount = PRICE_MAP[plan][billingPeriod];
  const orderId = generateOrderId(userId);

  // Expire in 24 hours
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  // Create payment record in DB
  const payment = await db.payment.create({
    data: {
      userId,
      orderId,
      amount,
      currency: "IDR",
      status: "PENDING",
      plan,
      billingPeriod,
      expiresAt,
    },
  });

  // Get Snap token from Midtrans
  const snap = await createSnapToken({
    orderId,
    amount,
    customerName: user.name ?? user.email,
    customerEmail: user.email,
    plan,
    billingPeriod,
  });

  // Store snap token
  await db.payment.update({
    where: { id: payment.id },
    data: {
      snapToken: snap.token,
      snapRedirectUrl: snap.redirect_url,
    },
  });

  return {
    orderId,
    snapToken: snap.token,
    snapRedirectUrl: snap.redirect_url,
    amount,
  };
}

/**
 * Handles incoming Midtrans webhook notifications.
 * Verifies signature, updates payment record, and activates subscription if paid.
 */
export async function handleWebhookNotification(body: Record<string, string>) {
  const {
    order_id: orderId,
    transaction_status: transactionStatus,
    fraud_status: fraudStatus,
    status_code: statusCode,
    gross_amount: grossAmount,
    signature_key: signatureKey,
    transaction_id: transactionId,
    payment_type: paymentType,
  } = body;

  // Verify signature
  const isValid = await verifyMidtransSignature(
    orderId,
    statusCode,
    grossAmount,
    signatureKey
  );
  if (!isValid) throw new Error("Invalid Midtrans signature");

  const payment = await db.payment.findUnique({ where: { orderId } });
  if (!payment) throw new Error("Payment record not found");

  // Determine our internal status
  let internalStatus: "PENDING" | "SUCCESS" | "FAILED" | "EXPIRED" | "CANCELLED" =
    "PENDING";

  if (transactionStatus === "capture") {
    internalStatus = fraudStatus === "accept" ? "SUCCESS" : "FAILED";
  } else if (transactionStatus === "settlement") {
    internalStatus = "SUCCESS";
  } else if (["cancel", "deny"].includes(transactionStatus)) {
    internalStatus = "CANCELLED";
  } else if (transactionStatus === "expire") {
    internalStatus = "EXPIRED";
  } else if (transactionStatus === "failure") {
    internalStatus = "FAILED";
  }

  // Update payment record
  await db.payment.update({
    where: { orderId },
    data: {
      status: internalStatus,
      transactionId,
      transactionStatus,
      fraudStatus,
      paymentType,
      paidAt: internalStatus === "SUCCESS" ? new Date() : undefined,
      metadata: body as any,
    },
  });

  // If paid → activate subscription
  if (internalStatus === "SUCCESS") {
    await activateSubscription(
      payment.userId,
      payment.plan as "PRO" | "BUSINESS",
      payment.id
    );
  }

  return { status: internalStatus, orderId };
}

export async function getPaymentsByUser(userId: string) {
  return db.payment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
