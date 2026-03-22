import midtransClient from "midtrans-client";

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

// Snap client — used to create payment popups
export const snap = new midtransClient.Snap({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

// Core API client — used for server-side operations & status checks
export const coreApi = new midtransClient.CoreApi({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

/**
 * Generates a unique Midtrans order ID
 */
export function generateOrderId(userId: string): string {
  const timestamp = Date.now();
  const short = userId.slice(-6);
  return `INV-${short}-${timestamp}`;
}

/**
 * Creates a Midtrans Snap payment token.
 * Returns { token, redirect_url }
 */
export async function createSnapToken(params: {
  orderId: string;
  amount: number; // IDR
  customerName: string;
  customerEmail: string;
  plan: string;
  billingPeriod: string;
}) {
  const { orderId, amount, customerName, customerEmail, plan, billingPeriod } =
    params;

  const transaction = await snap.createTransaction({
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    item_details: [
      {
        id: `${plan}_${billingPeriod}`,
        price: amount,
        quantity: 1,
        name: `InvoiceFlow ${plan} — ${billingPeriod}`,
      },
    ],
    customer_details: {
      first_name: customerName,
      email: customerEmail,
    },
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      error: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=error`,
      pending: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=pending`,
    },
  });

  return transaction as { token: string; redirect_url: string };
}

/**
 * Verifies a Midtrans webhook notification signature.
 * signature_key = SHA512(order_id + status_code + gross_amount + server_key)
 */
export async function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
): Promise<boolean> {
  const crypto = await import("crypto");
  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const payload = orderId + statusCode + grossAmount + serverKey;
  const expected = crypto
    .createHash("sha512")
    .update(payload)
    .digest("hex");
  return expected === signatureKey;
}
