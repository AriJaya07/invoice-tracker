import { Badge } from "@/components/ui/Badge";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { InvoiceWithClient } from "@/services/invoice.service";

interface RecentInvoicesProps {
  invoices: InvoiceWithClient[];
  currencySymbol?: string;
}

export const RecentInvoices = ({ invoices, currencySymbol = "Rp" }: RecentInvoicesProps) => {
  if (invoices.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 p-10 text-center text-zinc-600 sm:p-12">
        <AlertCircle
          className="mx-auto mb-4 h-12 w-12 text-zinc-300"
          aria-hidden
        />
        <p className="font-medium">
          No recent activity yet. Create your first invoice to get started.
        </p>
        <Link href="/dashboard/invoices/new" className="mt-4 inline-block">
          <Button variant="outline" size="sm">
            Create invoice
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200/80 shadow-sm">
      <table className="w-full min-w-[520px] border-collapse bg-white text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-100 bg-zinc-50/80">
            <th
              scope="col"
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:px-6 sm:py-4"
            >
              Number
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:px-6 sm:py-4"
            >
              Client
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:px-6 sm:py-4"
            >
              Amount
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:px-6 sm:py-4"
            >
              Due
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:px-6 sm:py-4"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {invoices.map((invoice) => (
            <tr
              key={invoice.id}
              className="transition-colors hover:bg-zinc-50/80"
            >
              <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                <span className="font-semibold text-blue-700">
                  #{invoice.invoiceNumber}
                </span>
              </td>
              <td className="px-4 py-4 sm:px-6">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-zinc-900">
                    {invoice.client.name}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {invoice.client.email}
                  </span>
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-4 text-right font-semibold text-zinc-900 sm:px-6">
                {currencySymbol}{(invoice.totalCents / 100).toLocaleString()}
              </td>
              <td className="whitespace-nowrap px-4 py-4 text-xs font-medium text-zinc-600 sm:px-6">
                {new Date(invoice.dueDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-4 text-center sm:px-6">
                <Badge status={invoice.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
