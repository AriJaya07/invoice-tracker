import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getInvoices, calculateDashboardStats, InvoiceWithClient } from "@/services/invoice.service";
import { getUserById } from "@/services/user.service";
import { 
  TrendingUp, 
  ArrowUpRight, 
  Target, 
  Calendar,
  BarChart2
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default async function IncomePage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const [stats, invoices, user] = await Promise.all([
    calculateDashboardStats(session.user.id),
    getInvoices(session.user.id),
    getUserById(session.user.id)
  ]);

  const paidInvoices = invoices.filter((i: InvoiceWithClient) => i.status === "PAID");
  const currency = user?.defaultCurrency || "IDR";
  const currencySymbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : "Rp";

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Income analytics
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Track earnings and business growth.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 gap-2 border-zinc-300"
          >
            <Calendar className="h-3.5 w-3.5" aria-hidden />
            Month to date
          </Button>
          <Button
            type="button"
            className="h-10 gap-2 px-6 shadow-md shadow-blue-600/15"
          >
            <TrendingUp className="h-4 w-4" aria-hidden />
            View reports
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="group relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp className="w-24 h-24" />
          </div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
            Total received
          </p>
          <p className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            {currencySymbol}{stats.totalEarned.toLocaleString()}
          </p>
          <div className="mt-6 flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-800">
            <ArrowUpRight className="h-4 w-4" aria-hidden />
            <span>+8.2% vs last month</span>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Target className="w-24 h-24" />
          </div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
            Projected income
          </p>
          <p className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            {currencySymbol}{stats.pendingAmount.toLocaleString()}
          </p>
          <p className="mt-6 text-sm font-medium italic text-zinc-600">
            From{" "}
            {invoices.filter((i: InvoiceWithClient) => i.status === "SENT").length}{" "}
            open invoices
          </p>
        </div>

        <div className="group relative overflow-hidden rounded-3xl border border-blue-700 bg-blue-600 p-8 text-white shadow-sm">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-white">
            <BarChart2 className="w-24 h-24" />
          </div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-200">
            Annual goal
          </p>
          <p className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {currencySymbol}500,000,000
          </p>
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-tight text-blue-200">
              <span>Progress</span>
              <span>
                {Math.round((stats.totalEarned / 500000000) * 100)}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-blue-900/40">
              <div
                className="h-full rounded-full bg-white transition-all duration-1000"
                style={{
                  width: `${Math.min((stats.totalEarned / 500000000) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10 overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-sm">
        <div className="border-b border-zinc-100 bg-zinc-50/80 p-6 sm:p-8">
          <h2 className="text-lg font-bold tracking-tight text-zinc-900 sm:text-xl">
            Income sources
          </h2>
        </div>
        {paidInvoices.length === 0 ? (
          <div className="p-12 text-center sm:p-24">
            <p className="text-sm font-medium italic text-zinc-500">
              No paid invoices yet. When invoices are marked paid, they will
              appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/80">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:px-8 sm:py-5">
                    Invoice
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:px-8 sm:py-5">
                    Client
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:px-8 sm:py-5">
                    Date paid
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:px-8 sm:py-5">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {paidInvoices.map((item: InvoiceWithClient) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-zinc-50/80"
                  >
                    <td className="px-6 py-4 font-semibold uppercase text-blue-700 sm:px-8 sm:py-5">
                      #{item.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-900 sm:px-8 sm:py-5">
                      {item.client.name}
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-600 sm:px-8 sm:py-5">
                      {item.paidDate
                        ? new Date(item.paidDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-emerald-700 sm:px-8 sm:py-5">
                      {currencySymbol}{(item.totalCents / 100).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
