import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserById, updateUser } from "@/services/user.service";
import { getSubscription, getTrialDaysRemaining } from "@/services/subscription.service";
import { updateProfileSchema } from "@/lib/validations";

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user, subscription, trialDaysRemaining] = await Promise.all([
      getUserById(session.user.id),
      getSubscription(session.user.id),
      getTrialDaysRemaining(session.user.id),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Don't return the password hash
    const { password: _password, ...safeUser } = user as typeof user & { password?: string | null };

    return NextResponse.json({
      user: safeUser,
      subscription,
      trialDaysRemaining,
    });
  } catch (error) {
    console.error("[GET_USER_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await updateUser(session.user.id, parsed.data);

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("[UPDATE_USER_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
