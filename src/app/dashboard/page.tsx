import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { calculateDashboardStats, getInvoices } from "@/services/invoice.service";
import { getUserById } from "@/services/user.service";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ExternalLink, Plus } from "lucide-react";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentInvoices } from "@/components/dashboard/RecentInvoices";
import { SubscriptionNotice } from "@/components/dashboard/SubscriptionNotice";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const [stats, recentInvoices, user] = await Promise.all([
    calculateDashboardStats(userId),
    getInvoices(userId),
    getUserById(userId)
  ]);

  const currency = user?.defaultCurrency || "IDR";
  const currencySymbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : "Rp";

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8 md:flex-row md:items-center md:justify-between">
        <div className="relative z-10">
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
            Welcome back, {session.user.name?.split(" ")[0] || "User"}!
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Here&apos;s a snapshot of your business today.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link href="/dashboard/invoices/new" className="w-full md:w-auto">
            <Button className="w-full gap-2 shadow-md shadow-blue-600/15 md:w-auto">
              <Plus className="h-4 w-4" aria-hidden />
              New invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* Subscription/Trial Notice (Client Component) */}
      <SubscriptionNotice />

      {/* Stats Grid */}
      <DashboardStats stats={stats} currencySymbol={currencySymbol} />

      {/* Recent Activity */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-zinc-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <h2 className="text-lg font-bold text-zinc-900">Recent invoices</h2>
          <Link
            href="/dashboard/invoices"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 underline-offset-2 hover:text-blue-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded-sm"
          >
            View all
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
        <div className="p-4 sm:p-6">
          <RecentInvoices invoices={recentInvoices.slice(0, 5)} currencySymbol={currencySymbol} />
        </div>
      </div>
    </div>
  );
}
