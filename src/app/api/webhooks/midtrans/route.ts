import { NextRequest, NextResponse } from "next/server";
import { handleWebhookNotification } from "@/services/payment.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic validation — Midtrans always sends these fields
    if (!body.order_id || !body.signature_key) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await handleWebhookNotification(body);

    return NextResponse.json(
      { message: "Webhook processed", ...result },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[MIDTRANS_WEBHOOK_ERROR]", message);

    // Return 400 for signature errors so Midtrans won't retry
    if (message === "Invalid Midtrans signature") {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
