import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getClients } from "@/services/client.service";
import { getUserById } from "@/services/user.service";
import { NewInvoiceForm } from "@/components/invoices/NewInvoiceForm";

export default async function NewInvoicePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [clients, user] = await Promise.all([
    getClients(session.user.id),
    getUserById(session.user.id)
  ]);

  return <NewInvoiceForm clients={clients} user={user as any} />;
}
