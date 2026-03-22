import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getClients } from "@/services/client.service";
import { Button } from "@/components/ui/Button";
import { Plus, UserPlus } from "lucide-react";
import { ClientCard } from "@/components/clients/ClientCard";
import { ClientsHeader } from "@/components/clients/ClientsHeader";

export default async function ClientsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const clients = await getClients(session.user.id);

  return (
    <div className="space-y-8">
      <ClientsHeader />

      {clients.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center">
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <UserPlus className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">No clients yet</h2>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            Get started by adding your first client to start sending invoices.
          </p>
          <Button variant="outline" className="mt-8">Add Your First Client</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}
    </div>
  );
}
