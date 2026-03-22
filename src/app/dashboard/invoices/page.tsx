import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getInvoices } from "@/services/invoice.service";
import { Button } from "@/components/ui/Button";
import { Plus, Search, Filter, FileText } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

export default async function InvoicesPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const invoices = await getInvoices(session.user.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight font-geist-sans">Invoices</h1>
          <p className="text-gray-500 mt-1">Total {invoices.length} invoices generated.</p>
        </div>
        <Link href="/dashboard/invoices/new">
          <Button className="gap-2 shadow-lg shadow-blue-100">
            <Plus className="w-4 h-4" />
            Create Invoice
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by number or client..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
             <Button variant="outline" size="sm" className="gap-2 h-11 px-4 border-gray-200 hover:border-blue-200">
               <Filter className="w-3.5 h-3.5 text-gray-400" />
               <span className="text-gray-600">Filter Status</span>
             </Button>
             <select className="h-11 bg-white border border-gray-200 rounded-xl text-sm px-4 focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all text-gray-600 min-w-[140px]">
               <option>All Invoices</option>
               <option>Paid</option>
               <option>Pending</option>
               <option>Overdue</option>
               <option>Draft</option>
             </select>
          </div>
        </div>

        {invoices.length === 0 ? (
          <div className="p-24 text-center">
             <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10" />
             </div>
             <h3 className="text-xl font-bold text-gray-900">No invoices yet</h3>
             <p className="text-gray-500 mt-2 max-w-xs mx-auto">Start billing your clients by creating your first professional invoice.</p>
             <Link href="/dashboard/invoices/new" className="mt-8 inline-block">
                <Button variant="outline">Create Your First Invoice</Button>
             </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Number</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Client</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Issue Date</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Due Date</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Amount</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Status</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-8 py-5 font-extrabold text-blue-600">#{invoice.invoiceNumber}</td>
                    <td className="px-8 py-5 font-bold text-gray-900">{invoice.client.name}</td>
                    <td className="px-8 py-5 text-gray-500 font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</td>
                    <td className="px-8 py-5 text-gray-500 font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                    <td className="px-8 py-5 font-extrabold text-gray-900 text-right">Rp{(invoice.totalCents / 100).toLocaleString()}</td>
                    <td className="px-8 py-5">
                      <Badge status={invoice.status} />
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-9 px-4 rounded-lg text-xs font-bold hover:bg-white hover:shadow-sm">Edit</Button>
                        <a 
                          href={`/api/invoices/${invoice.id}/pdf`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Button variant="ghost" size="sm" className="h-9 px-4 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50">PDF</Button>
                        </a>
                      </div>
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
