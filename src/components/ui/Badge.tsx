import { InvoiceStatus } from "@prisma/client";
import { cn } from "@/lib/cn";

interface BadgeProps {
  status: InvoiceStatus | string;
}

export const Badge = ({ status }: BadgeProps) => {
  const styles: Record<string, string> = {
    PAID:
      "border-emerald-300 bg-emerald-100 text-emerald-900",
    PENDING:
      "border-amber-300 bg-amber-100 text-amber-950",
    SENT:
      "border-blue-300 bg-blue-100 text-blue-900",
    OVERDUE:
      "border-red-300 bg-red-100 text-red-900",
    DRAFT:
      "border-zinc-300 bg-zinc-100 text-zinc-800",
  };

  const currentStyle = styles[status as string] || styles.DRAFT;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        currentStyle
      )}
    >
      {status}
    </span>
  );
};
