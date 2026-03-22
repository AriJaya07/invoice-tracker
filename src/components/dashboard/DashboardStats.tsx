import { 
  TrendingUp, 
  FileText, 
  Users, 
  AlertCircle 
} from "lucide-react";

interface StatsProps {
  stats: {
    totalEarned: number;
    pendingAmount: number;
    overdueAmount: number;
    clientCount: number;
    totalInvoices: number;
  };
}

export const DashboardStats = ({ stats }: StatsProps) => {
  const cards = [
    {
      label: "Total Earned",
      value: `Rp${stats.totalEarned.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Pending Amount",
      value: `Rp${stats.pendingAmount.toLocaleString()}`,
      icon: ClockIcon,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Overdue Amount",
      value: `Rp${stats.overdueAmount.toLocaleString()}`,
      icon: AlertCircle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Total Clients",
      value: stats.clientCount.toString(),
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div key={card.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
             <div className={`p-2 ${card.bg} ${card.color} rounded-lg`}>
               <card.icon className="w-5 h-5" />
             </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">{card.label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

// Simple Clock icon since I missed it in import
const ClockIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
