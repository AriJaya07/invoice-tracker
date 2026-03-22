import { User, Mail, Building2, Phone, MapPin, Receipt, ExternalLink } from "lucide-react";
import Link from "next/link";

interface ClientForCard {
  id: string;
  name: string;
  email: string;
  companyName?: string | null;
  phone?: string | null;
  address?: string | null;
  invoices?: { totalCents: number }[];
}

interface ClientCardProps {
  client: ClientForCard;
}

export const ClientCard = ({ client }: ClientCardProps) => {
  const invoiceCount = client.invoices?.length ?? 0;
  const totalCents =
    client.invoices?.reduce((sum, inv) => sum + inv.totalCents, 0) ?? 0;

  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
          <User className="h-6 w-6" aria-hidden />
        </div>
        <Link
          href={`/dashboard/clients/${client.id}`}
          className="rounded-lg p-2 text-zinc-400 opacity-0 transition-all hover:bg-zinc-100 hover:text-zinc-900 group-hover:opacity-100 focus-visible:opacity-100"
          aria-label="View client details"
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-4 space-y-1">
        <h3 className="text-lg font-bold text-zinc-900 line-clamp-1">
          {client.name}
        </h3>
        {client.companyName && (
          <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-500">
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">{client.companyName}</span>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3 border-t border-zinc-100 pt-6">
        <div className="flex items-start gap-2.5 text-xs text-zinc-600">
          <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400" />
          <span className="break-all">{client.email}</span>
        </div>
        {client.phone && (
          <div className="flex items-center gap-2.5 text-xs text-zinc-600">
            <Phone className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
            <span>{client.phone}</span>
          </div>
        )}
      </div>

      <div className="mt-auto pt-8">
        <div className="flex items-center justify-between rounded-xl bg-zinc-50 p-4">
          <div className="space-y-1">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              <Receipt className="h-3 w-3" />
              Invoices
            </p>
            <p className="text-xl font-bold text-zinc-900">{invoiceCount}</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Total billed
            </p>
            <p className="font-bold text-emerald-700">
              Rp{(totalCents / 100).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};
