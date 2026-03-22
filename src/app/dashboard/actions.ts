"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createClient } from "@/services/client.service";
import { createInvoice, updateInvoiceStatus } from "@/services/invoice.service";
import { InvoiceStatus } from "@prisma/client";

// --- CLIENT ACTIONS ---

export async function createClientAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    companyName: formData.get("companyName") as string || undefined,
    phone: formData.get("phone") as string || undefined,
    address: formData.get("address") as string || undefined,
    country: formData.get("country") as string || undefined,
  };

  await createClient(session.user.id, data);
  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard");
}

// --- INVOICE ACTIONS ---

export async function createInvoiceAction(data: {
  clientId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  items: { description: string; quantity: number; unitPrice: number }[];
  notes?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await createInvoice(session.user.id, {
    ...data,
    issueDate: new Date(data.issueDate),
    dueDate: new Date(data.dueDate),
    status: InvoiceStatus.SENT,
    currency: "IDR",
  });

  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard/income");
  revalidatePath("/dashboard");
}

export async function updateInvoiceStatusAction(id: string, status: InvoiceStatus) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await updateInvoiceStatus(id, session.user.id, status);
  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard/income");
  revalidatePath("/dashboard");
}
