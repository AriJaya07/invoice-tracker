import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getClients } from "@/services/client.service";
import { NewInvoiceForm } from "@/components/invoices/NewInvoiceForm";

export default async function NewInvoicePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const clients = await getClients(session.user.id);

  return <NewInvoiceForm clients={clients} />;
}
