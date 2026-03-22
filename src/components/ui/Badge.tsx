import React from "react";
import { InvoiceStatus } from "@prisma/client";

interface BadgeProps {
  status: InvoiceStatus | string;
}

export const Badge = ({ status }: BadgeProps) => {
  const styles: Record<string, string> = {
    PAID: "bg-green-100 text-green-700 border-green-200",
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
    SENT: "bg-blue-100 text-blue-700 border-blue-200",
    OVERDUE: "bg-red-100 text-red-700 border-red-200",
    DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const currentStyle = styles[status as string] || styles.DRAFT;

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${currentStyle} uppercase`}>
      {status}
    </span>
  );
};
