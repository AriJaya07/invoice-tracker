import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { calculateDashboardStats, getInvoices } from "@/services/invoice.service";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { 
  FileText, 
  TrendingUp, 
  Users, 
  ExternalLink,
  Plus
} from "lucide-react";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentInvoices } from "@/components/dashboard/RecentInvoices";
import { SubscriptionNotice } from "@/components/dashboard/SubscriptionNotice";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const stats = await calculateDashboardStats(userId);
  const recentInvoices = await getInvoices(userId);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {session.user.name?.split(" ")[0] || "User"}! 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Here's what's happening with your business today.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/dashboard/invoices/new">
            <Button className="gap-2 shadow-lg shadow-blue-100">
              <Plus className="w-4 h-4" />
              New Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* Subscription/Trial Notice (Client Component) */}
      <SubscriptionNotice />

      {/* Stats Grid */}
      <DashboardStats stats={stats} />

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Recent Invoices</h2>
          <Link href="/dashboard/invoices" className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline">
            View All <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
        <RecentInvoices invoices={recentInvoices.slice(0, 5)} />
      </div>
    </div>
  );
}
