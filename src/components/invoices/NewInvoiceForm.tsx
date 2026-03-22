"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createInvoiceAction } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { fieldBase } from "@/components/ui/field-classes";
import { cn } from "@/lib/cn";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Calendar,
  User,
  FileText,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

interface NewInvoiceFormProps {
  clients: { id: string; name: string; email: string }[];
  user: {
    invoicePrefix: string | null;
    defaultCurrency: string | null;
    defaultInvoiceNote: string | null;
  };
}

export const NewInvoiceForm = ({ clients, user }: NewInvoiceFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const prefix = user?.invoicePrefix || "INV";
  const currency = user?.defaultCurrency || "IDR";
  const currencySymbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : "Rp";

  const [formData, setFormData] = useState({
    clientId: "",
    invoiceNumber: `${prefix}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    notes: user?.defaultInvoiceNote || "",
  });

  const [items, setItems] = useState([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  }, [items]);

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    (newItems[index] as Record<string, string | number>)[field] =
      field === "description" ? value : Number(value);
    setItems(newItems);
  };

  async function handleSubmit() {
    if (!formData.clientId) {
      alert("Please select a client");
      return;
    }
    setIsSubmitting(true);
    try {
      await createInvoiceAction({
        ...formData,
        items,
      });
      router.push("/dashboard/invoices");
    } catch (error) {
      console.error(error);
      alert("Failed to create invoice");
    } finally {
      setIsSubmitting(false);
    }
  }

  const compactField = cn(
    fieldBase,
    "rounded-xl py-3 text-sm font-medium"
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-20 sm:space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/dashboard/invoices"
          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded-md"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" className="w-full sm:w-auto">
            Save draft
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            className="w-full gap-2 shadow-md shadow-blue-600/15 sm:w-auto sm:px-8"
          >
            <Save className="h-4 w-4" aria-hidden />
            Create invoice
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-sm">
        <div className="space-y-12 p-6 sm:p-10 md:p-14">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-start">
            <div className="space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25 sm:h-20 sm:w-20 sm:rounded-3xl">
                <FileText className="h-8 w-8 sm:h-10 sm:w-10" aria-hidden />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  New invoice
                </h1>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Professional billing
                </p>
              </div>
            </div>
            <div className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 sm:w-auto sm:min-w-[240px] sm:self-end sm:p-6">
              <label
                htmlFor="invoice-number"
                className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-zinc-500"
              >
                Invoice number
              </label>
              <input
                id="invoice-number"
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) =>
                  setFormData({ ...formData, invoiceNumber: e.target.value })
                }
                className="w-full border-0 bg-transparent p-0 text-xl font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:ring-offset-2 rounded sm:text-right sm:text-2xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12 border-t border-zinc-100 pt-10 md:grid-cols-2 md:gap-16">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-700">
                <User className="h-5 w-5" aria-hidden />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Bill to
                </span>
              </div>
              <Select
                label="Client"
                value={formData.clientId}
                onChange={(e) =>
                  setFormData({ ...formData, clientId: e.target.value })
                }
                required
              >
                <option value="">Select a customer…</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.email})
                  </option>
                ))}
              </Select>
              <Link
                href="/dashboard/clients"
                className="inline-block text-xs font-bold uppercase tracking-widest text-blue-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm"
              >
                + New client
              </Link>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-700">
                <Calendar className="h-5 w-5" aria-hidden />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Timeline
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="issue-date"
                    className="block text-center text-[10px] font-bold uppercase tracking-widest text-zinc-500"
                  >
                    Issue date
                  </label>
                  <input
                    id="issue-date"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, issueDate: e.target.value })
                    }
                    className={cn(compactField, "text-center")}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="due-date"
                    className="block text-center text-[10px] font-bold uppercase tracking-widest text-zinc-500"
                  >
                    Due date
                  </label>
                  <input
                    id="due-date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className={cn(compactField, "text-center")}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-700">
              <Plus className="h-5 w-5" aria-hidden />
              <span className="text-xs font-bold uppercase tracking-widest">
                Line items
              </span>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 items-center gap-3 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-3 sm:grid-cols-[1fr_5rem_7rem_2.5rem] md:grid-cols-[1fr_6rem_8rem_2.5rem] md:gap-4 md:p-4"
                >
                  <input
                    aria-label={`Line ${index + 1} description`}
                    placeholder="Service or product description"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(index, "description", e.target.value)
                    }
                    className={compactField}
                  />
                  <input
                    aria-label={`Line ${index + 1} quantity`}
                    placeholder="Qty"
                    type="number"
                    min={0}
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", e.target.value)
                    }
                    className={cn(compactField, "text-center")}
                  />
                  <div className="relative">
                    <span
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-400"
                      aria-hidden
                    >
                      {currencySymbol}
                    </span>
                    <input
                      aria-label={`Line ${index + 1} unit price`}
                      placeholder="0"
                      type="number"
                      min={0}
                      value={item.unitPrice || ""}
                      onChange={(e) =>
                        updateItem(index, "unitPrice", e.target.value)
                      }
                      className={cn(compactField, "pl-10 text-right")}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                    className="flex h-11 w-full items-center justify-center rounded-xl text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 disabled:pointer-events-none disabled:opacity-30 sm:h-auto sm:w-auto"
                    aria-label={`Remove line ${index + 1}`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={addItem}
              className="w-full gap-2 border-2 border-dashed border-zinc-300 py-5 text-xs font-bold uppercase tracking-widest hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-800 sm:w-auto sm:px-8"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add line item
            </Button>
          </div>

          <div className="flex flex-col gap-10 border-t border-zinc-100 pt-10 lg:flex-row lg:justify-between">
            <div className="min-w-0 flex-1 space-y-3">
              <Textarea
                label="Notes & payment terms"
                placeholder="e.g. Payment due within 30 days. Bank transfer to …"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={6}
                className="min-h-[160px] rounded-2xl"
              />
            </div>

            <div className="relative w-full shrink-0 overflow-hidden rounded-3xl bg-zinc-900 p-8 text-white shadow-xl lg:w-80">
              <TrendingUp
                className="pointer-events-none absolute -right-2 -top-2 h-32 w-32 text-white/[0.06]"
                aria-hidden
              />
              <div className="relative space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 text-sm text-zinc-300">
                  <span className="font-semibold uppercase tracking-wider">
                    Subtotal
                  </span>
                  <span className="font-semibold text-white">
                    {currencySymbol}{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-zinc-300">
                  <span className="font-semibold uppercase tracking-wider">
                    Tax (0%)
                  </span>
                  <span className="font-semibold text-white">
                    {currencySymbol}0
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-white/20 pt-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-300">
                    Total
                  </span>
                  <span className="text-2xl font-bold tracking-tight">
                    {currencySymbol}{subtotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
