import { TrendingUp, Users, AlertCircle, Clock } from "lucide-react";

interface StatsProps {
  stats: {
    totalEarned: number;
    pendingAmount: number;
    overdueAmount: number;
    clientCount: number;
    totalInvoices: number;
  };
  currencySymbol?: string;
}

export const DashboardStats = ({ stats, currencySymbol = "Rp" }: StatsProps) => {
  const cards = [
    {
      label: "Total Earned",
      value: `${currencySymbol}${stats.totalEarned.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
    },
    {
      label: "Pending Amount",
      value: `${currencySymbol}${stats.pendingAmount.toLocaleString()}`,
      icon: Clock,
      color: "text-blue-700",
      bg: "bg-blue-50",
    },
    {
      label: "Overdue Amount",
      value: `${currencySymbol}${stats.overdueAmount.toLocaleString()}`,
      icon: AlertCircle,
      color: "text-red-700",
      bg: "bg-red-50",
    },
    {
      label: "Total Clients",
      value: stats.clientCount.toString(),
      icon: Users,
      color: "text-violet-700",
      bg: "bg-violet-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="mb-4 flex items-center justify-between">
            <div
              className={`rounded-lg p-2 ${card.bg} ${card.color}`}
            >
              <card.icon className="h-5 w-5" aria-hidden />
            </div>
          </div>
          <p className="text-sm font-medium text-zinc-600">{card.label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-zinc-900">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
};
