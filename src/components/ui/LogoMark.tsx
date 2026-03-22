import Link from "next/link";
import { cn } from "@/lib/cn";

interface LogoMarkProps {
  href?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-9 w-9 rounded-lg text-lg",
  md: "h-12 w-12 rounded-xl text-xl",
  lg: "h-14 w-14 rounded-2xl text-2xl",
};

export function LogoMark({
  href = "/",
  size = "md",
  className,
}: LogoMarkProps) {
  const inner = (
    <div
      className={cn(
        "flex items-center justify-center bg-blue-600 font-black text-white shadow-md shadow-blue-600/25 transition-transform duration-200",
        "group-hover:scale-105",
        sizes[size],
        className
      )}
    >
      IF
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-flex" aria-label="InvoiceFlow home">
        {inner}
      </Link>
    );
  }

  return inner;
}
