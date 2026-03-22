import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getInvoiceById } from "@/services/invoice.service";
import { renderToStream } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/invoices/InvoicePDF";
import { getUserById } from "@/services/user.service";
import React from "react";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const invoice = await getInvoiceById(id, session.user.id);
  if (!invoice) {
    return new NextResponse("Invoice not found", { status: 404 });
  }

  const user = await getUserById(session.user.id);

  try {
    const stream = await renderToStream(
      <InvoicePDF 
        invoice={invoice} 
        userCompany={{
          name: user?.companyName || user?.name || "InvoiceFlow",
          address: user?.address || "",
          email: user?.email || "",
        }} 
      />
    );

    return new NextResponse(stream as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="invoice-${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF Generation error:", error);
    return new NextResponse("Error generating PDF", { status: 500 });
  }
}
