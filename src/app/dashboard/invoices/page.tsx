import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getInvoices } from "@/services/invoice.service";
import { Button } from "@/components/ui/Button";
import { Plus, Search, Filter, FileText } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { fieldBase } from "@/components/ui/field-classes";
import { cn } from "@/lib/cn";
import { Select } from "@/components/ui/Select";

export default async function InvoicesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const invoices = await getInvoices(session.user.id);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Invoices
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            {invoices.length} invoice{invoices.length === 1 ? "" : "s"} total
          </p>
        </div>
        <Link href="/dashboard/invoices/new" className="shrink-0">
          <Button className="w-full gap-2 shadow-md shadow-blue-600/15 md:w-auto">
            <Plus className="h-4 w-4" aria-hidden />
            Create invoice
          </Button>
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-zinc-100 bg-zinc-50/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="relative w-full sm:max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              aria-hidden
            />
            <input
              type="search"
              name="q"
              placeholder="Search by number or client…"
              className={cn(fieldBase, "h-11 min-h-11 py-0 pl-10 text-sm")}
              aria-label="Search invoices"
            />
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-11 w-full gap-2 sm:w-auto"
            >
              <Filter className="h-3.5 w-3.5 text-zinc-500" aria-hidden />
              <span>Filter status</span>
            </Button>
            <div className="w-full sm:w-52 sm:shrink-0">
            <Select
              defaultValue="all"
              aria-label="Filter by invoice status"
              className="text-sm"
            >
              <option value="all">All invoices</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="draft">Draft</option>
            </Select>
            </div>
          </div>
        </div>

        {invoices.length === 0 ? (
          <div className="px-4 py-16 text-center sm:py-24">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
              <FileText className="h-10 w-10" aria-hidden />
            </div>
            <h2 className="text-xl font-bold text-zinc-900">No invoices yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-600">
              Create your first invoice to start billing clients professionally.
            </p>
            <Link href="/dashboard/invoices/new" className="mt-8 inline-block">
              <Button variant="outline">Create your first invoice</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/80">
                  <th
                    scope="col"
                    className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:px-6"
                  >
                    Number
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:px-6"
                  >
                    Client
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:px-6"
                  >
                    Issue
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:px-6"
                  >
                    Due
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:px-6"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:px-6"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:px-6"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="transition-colors hover:bg-zinc-50/80"
                  >
                    <td className="whitespace-nowrap px-4 py-4 font-semibold text-blue-700 sm:px-6">
                      #{invoice.invoiceNumber}
                    </td>
                    <td className="px-4 py-4 font-medium text-zinc-900 sm:px-6">
                      {invoice.client.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-zinc-600 sm:px-6">
                      {new Date(invoice.issueDate).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-zinc-600 sm:px-6">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right font-semibold text-zinc-900 sm:px-6">
                      Rp{(invoice.totalCents / 100).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      <Badge status={invoice.status} />
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-9 rounded-lg px-3 text-xs"
                        >
                          Edit
                        </Button>
                        <a
                          href={`/api/invoices/${invoice.id}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-9 rounded-lg px-3 text-xs text-blue-700 hover:bg-blue-50"
                          >
                            PDF
                          </Button>
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
