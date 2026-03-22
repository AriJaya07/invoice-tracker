import { db } from "@/lib/db";
import { InvoiceStatus, Invoice, Client, InvoiceLineItem } from "@prisma/client";

export type InvoiceWithClient = Invoice & {
  client: Client;
  lineItems: InvoiceLineItem[];
};

export async function getInvoices(userId: string): Promise<InvoiceWithClient[]> {
  const invoices = await db.invoice.findMany({
    where: { userId },
    include: {
      client: true,
      lineItems: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return invoices as InvoiceWithClient[];
}

export async function getInvoiceById(id: string, userId: string): Promise<InvoiceWithClient | null> {
  const invoice = await db.invoice.findFirst({
    where: { id, userId },
    include: {
      client: true,
      lineItems: true,
    },
  });
  return invoice as InvoiceWithClient | null;
}

export async function createInvoice(userId: string, data: {
  clientId: string;
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  status: InvoiceStatus;
  currency: string;
  taxRate?: number;
  discountCents?: number;
  notes?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
}) {
  const { items, ...invoiceData } = data;
  
  // Calculate financials in cents
  const subtotalCents = items.reduce((sum: number, item) => sum + Math.round(item.quantity * item.unitPrice * 100), 0);
  const taxAmountCents = Math.round(subtotalCents * ((invoiceData.taxRate || 0) / 100));
  const totalCents = subtotalCents + taxAmountCents - (invoiceData.discountCents || 0);

  return db.invoice.create({
    data: {
      ...invoiceData,
      userId,
      subtotalCents,
      taxAmountCents,
      totalCents,
      lineItems: {
        create: items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice,
        })),
      },
    },
    include: {
      lineItems: true,
    },
  });
}

export async function updateInvoiceStatus(id: string, userId: string, status: InvoiceStatus) {
  const invoice = await db.invoice.update({
    where: { id },
    data: { 
      status,
      paidDate: status === "PAID" ? new Date() : null,
    },
  });

  // If marked as PAID, create an IncomeEntry
  if (status === "PAID") {
    const fullInvoice = await db.invoice.findUnique({
      where: { id },
      include: { client: true },
    });

    if (fullInvoice) {
      await db.incomeEntry.upsert({
        where: { invoiceId: id },
        create: {
          userId,
          invoiceId: id,
          source: `Invoice ${fullInvoice.invoiceNumber} – ${fullInvoice.client.name}`,
          amountCents: fullInvoice.totalCents,
          category: "INVOICE",
          date: new Date(),
        },
        update: {
          amountCents: fullInvoice.totalCents,
          date: new Date(),
        }
      });
    }
  }

  return invoice;
}

export async function calculateDashboardStats(userId: string) {
  const invoices = await db.invoice.findMany({
    where: { userId },
    select: {
      totalCents: true,
      status: true,
    },
  });

  const totalEarnedCents = invoices
    .filter((i: { status: InvoiceStatus; totalCents: number }) => i.status === "PAID")
    .reduce((sum: number, i: { totalCents: number }) => sum + i.totalCents, 0);

  const pendingAmountCents = invoices
    .filter((i: { status: InvoiceStatus; totalCents: number }) => i.status === "SENT")
    .reduce((sum: number, i: { totalCents: number }) => sum + i.totalCents, 0);

  const overdueAmountCents = invoices
    .filter((i: { status: InvoiceStatus; totalCents: number }) => i.status === "OVERDUE")
    .reduce((sum: number, i: { totalCents: number }) => sum + i.totalCents, 0);

  const clientCount = await db.client.count({
    where: { userId },
  });

  return {
    totalEarned: totalEarnedCents / 100,
    pendingAmount: pendingAmountCents / 100,
    overdueAmount: overdueAmountCents / 100,
    clientCount,
    totalInvoices: invoices.length,
  };
}
