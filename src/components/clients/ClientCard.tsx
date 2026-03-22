import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

interface ClientCardProps {
  client: any;
}

export const ClientCard = ({ client }: ClientCardProps) => {
  const invoiceCount = client.invoices?.length || 0;
  const totalBilled = client.invoices?.reduce((sum: number, inv: any) => sum + inv.amount, 0) || 0;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group relative flex flex-col h-full">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
          {client.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 truncate">{client.name}</h3>
          <p className="text-sm text-gray-500 truncate">{client.companyName || "Individual"}</p>
        </div>
        <button className="text-gray-400 hover:text-blue-600 transition-colors p-1">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 mb-6 flex-1">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="truncate">{client.email}</span>
        </div>
        {client.phone && (
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>{client.phone}</span>
          </div>
        )}
        {client.address && (
          <div className="flex items-start gap-3 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
            <span className="line-clamp-2">{client.address}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Invoices</p>
          <p className="font-bold text-gray-900">{invoiceCount}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Billed</p>
          <p className="font-bold text-green-600">Rp{totalBilled.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};
