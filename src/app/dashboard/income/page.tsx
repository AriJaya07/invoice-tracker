import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getInvoices, calculateDashboardStats, InvoiceWithClient } from "@/services/invoice.service";
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

  const stats = await calculateDashboardStats(session.user.id);
  const invoices = await getInvoices(session.user.id);
  const paidInvoices = invoices.filter((i: InvoiceWithClient) => i.status === "PAID");

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-geist-sans">Income Analytics</h1>
          <p className="text-gray-500 mt-1">Track your earnings and visualize business growth.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="gap-2 h-10 px-4 border-gray-200">
             <Calendar className="w-3.5 h-3.5" />
             Month to date
           </Button>
           <Button className="gap-2 shadow-lg shadow-blue-100 h-10 px-6">
             <TrendingUp className="w-4 h-4" />
             View Reports
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp className="w-24 h-24" />
          </div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Total Received</p>
          <p className="text-4xl font-extrabold text-gray-900 tracking-tighter">Rp{stats.totalEarned.toLocaleString()}</p>
          <div className="mt-6 flex items-center gap-2 text-green-600 text-sm font-bold bg-green-50 w-fit px-3 py-1 rounded-full">
            <ArrowUpRight className="w-4 h-4" /> 
            <span>+8.2% vs last month</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Target className="w-24 h-24" />
          </div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Projected Income</p>
          <p className="text-4xl font-extrabold text-gray-900 tracking-tighter">Rp{stats.pendingAmount.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-6 font-medium italic">From {invoices.filter((i: InvoiceWithClient) => i.status === "SENT").length} open invoices</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group text-white bg-blue-600">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-white">
            <BarChart2 className="w-24 h-24" />
          </div>
          <p className="text-sm font-bold text-blue-200 uppercase tracking-widest mb-2">Annual Goal</p>
          <p className="text-4xl font-extrabold tracking-tight">Rp500,000,000</p>
          <div className="mt-6">
             <div className="flex justify-between text-xs font-bold text-blue-200 mb-2 uppercase tracking-tight">
               <span>Progress</span>
               <span>{Math.round((stats.totalEarned / 500000000) * 100)}%</span>
             </div>
             <div className="h-2 bg-blue-800/50 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-white rounded-full transition-all duration-1000" 
                 style={{ width: `${Math.min((stats.totalEarned / 500000000) * 100, 100)}%` }}
               />
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-10">
        <div className="p-8 border-b bg-gray-50/30">
          <h2 className="font-bold text-gray-900 text-xl tracking-tight">Income Sources</h2>
        </div>
        {paidInvoices.length === 0 ? (
          <div className="p-24 text-center">
             <p className="text-gray-400 italic font-medium">No paid invoices found yet. When invoices are marked as paid, they will appear here as income.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Source Invoice</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Client</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Date Paid</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paidInvoices.map((item: InvoiceWithClient) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-5 font-extrabold text-blue-600 uppercase">#{item.invoiceNumber}</td>
                    <td className="px-8 py-5 text-gray-900 font-bold">{item.client.name}</td>
                    <td className="px-8 py-5 text-gray-500 font-medium">{item.paidDate ? new Date(item.paidDate).toLocaleDateString() : "N/A"}</td>
                    <td className="px-8 py-5 text-right font-extrabold text-green-600">Rp{(item.totalCents / 100).toLocaleString()}</td>
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
