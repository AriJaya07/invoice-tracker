import { db } from "@/lib/db";
import { Badge } from "@/components/ui/Badge";

interface PaymentHistoryTableProps {
  userId: string;
}

export const PaymentHistoryTable = async ({ userId }: PaymentHistoryTableProps) => {
  const payments = await db.payment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  if (payments.length === 0) {
    return (
      <div className="p-12 text-center text-zinc-500 bg-zinc-50/50 rounded-3xl border border-dashed border-zinc-200">
        <p className="font-medium italic">No payment history found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-zinc-200/80 shadow-sm">
      <table className="w-full text-left border-collapse bg-white">
        <thead>
          <tr className="bg-zinc-50/50">
            <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100">Date</th>
            <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100">Transaction ID</th>
            <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 text-right">Amount</th>
            <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-zinc-50 transition-colors">
              <td className="px-6 py-4 text-sm text-zinc-600">
                {new Date(payment.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm font-mono text-zinc-400">
                {payment.id.slice(0, 8)}...
              </td>
              <td className="px-6 py-4 font-bold text-zinc-900 text-right text-sm">
                Rp{payment.amount.toLocaleString()}
              </td>
              <td className="px-6 py-4">
                <Badge status={payment.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
