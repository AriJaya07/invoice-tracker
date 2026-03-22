import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getClients } from "@/services/client.service";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { NewInvoiceForm } from "@/components/invoices/NewInvoiceForm";
import Link from "next/link";

export default async function NewInvoicePage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const clients = await getClients(session.user.id);

  return (
    <NewInvoiceForm clients={clients} />
  );
}
