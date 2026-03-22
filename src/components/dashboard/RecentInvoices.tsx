import { Badge } from "@/components/ui/Badge";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { InvoiceWithClient } from "@/services/invoice.service";

interface RecentInvoicesProps {
  invoices: InvoiceWithClient[];
}

export const RecentInvoices = ({ invoices }: RecentInvoicesProps) => {
  if (invoices.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-10" />
        <p className="font-medium italic">No recent activity. Create your first invoice to get started.</p>
        <Link href="/dashboard/invoices/new" className="mt-4 inline-block">
          <Button variant="outline" size="sm">Create New Invoice</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm">
      <table className="w-full text-left border-collapse bg-white">
        <thead>
          <tr className="bg-gray-50/50">
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Number</th>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Client</th>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Amount</th>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Due</th>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-gray-50 transition-colors cursor-pointer group">
              <td className="px-6 py-4">
                <span className="font-extrabold text-blue-600 group-hover:underline">#{invoice.invoiceNumber}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900">{invoice.client.name}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{invoice.client.email}</span>
                </div>
              </td>
              <td className="px-6 py-4 font-extrabold text-gray-900 text-right">
                Rp{(invoice.totalCents / 100).toLocaleString()}
              </td>
              <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                {new Date(invoice.dueDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-center">
                <Badge status={invoice.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
