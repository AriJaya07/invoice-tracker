import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getClients } from "@/services/client.service";
import { UserPlus } from "lucide-react";
import { ClientCard } from "@/components/clients/ClientCard";
import { ClientsHeader } from "@/components/clients/ClientsHeader";

export default async function ClientsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const clients = await getClients(session.user.id);

  return (
    <div className="space-y-6 sm:space-y-8">
      <ClientsHeader />

      {clients.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-zinc-200 bg-white p-10 text-center sm:p-16">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
            <UserPlus className="h-8 w-8" aria-hidden />
          </div>
          <h2 className="text-xl font-bold text-zinc-900">No clients yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-600">
            Add your first client to start sending invoices.
          </p>
          <p className="mt-6 text-sm text-zinc-500">
            Use <span className="font-semibold text-zinc-700">Add client</span>{" "}
            above to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}
    </div>
  );
}
