import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserById } from "@/services/user.service";
import { SettingsForm } from "@/components/settings/SettingsForm";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await getUserById(session.user.id);
  if (!user) redirect("/login");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage your account and billing preferences.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-zinc-200/80 shadow-sm">
        <SettingsForm user={user as any} />
      </div>
    </div>
  );
}
