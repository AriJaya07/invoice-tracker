import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createTransactionSchema } from "@/lib/validations";
import { createMidtransTransaction } from "@/services/payment.service";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createTransactionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { plan, billingPeriod } = parsed.data;

    const result = await createMidtransTransaction(
      session.user.id,
      plan,
      billingPeriod
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[CREATE_TRANSACTION_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create payment transaction" },
      { status: 500 }
    );
  }
}
