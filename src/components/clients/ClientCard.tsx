import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

interface ClientForCard {
  name: string;
  email: string;
  companyName?: string | null;
  phone?: string | null;
  address?: string | null;
  invoices?: { amount: number }[];
}

interface ClientCardProps {
  client: ClientForCard;
}

export const ClientCard = ({ client }: ClientCardProps) => {
  const invoiceCount = client.invoices?.length ?? 0;
  const totalBilled =
    client.invoices?.reduce((sum, inv) => sum + inv.amount, 0) ?? 0;

  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-lg font-bold text-blue-700">
          {client.name[0]}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-bold text-zinc-900">{client.name}</h3>
          <p className="truncate text-sm text-zinc-600">
            {client.companyName || "Individual"}
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          aria-label={`Open details for ${client.name}`}
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="mb-6 flex-1 space-y-3">
        <div className="flex items-center gap-3 text-sm text-zinc-700">
          <Mail className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
          <span className="truncate">{client.email}</span>
        </div>
        {client.phone && (
          <div className="flex items-center gap-3 text-sm text-zinc-700">
            <Phone className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
            <span>{client.phone}</span>
          </div>
        )}
        {client.address && (
          <div className="flex items-start gap-3 text-sm text-zinc-700">
            <MapPin
              className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400"
              aria-hidden
            />
            <span className="line-clamp-2">{client.address}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 pt-6">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Invoices
          </p>
          <p className="font-bold text-zinc-900">{invoiceCount}</p>
        </div>
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Total billed
          </p>
          <p className="font-bold text-emerald-700">
            Rp{totalBilled.toLocaleString()}
          </p>
        </div>
      </div>
    </article>
  );
};
