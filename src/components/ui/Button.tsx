import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  isLoading = false,
  type = "button",
  ...props
}: ButtonProps) => {
  const baseStyles = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50",
    "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
  );

  const variants = {
    primary:
      "bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md",
    secondary:
      "bg-zinc-100 text-zinc-900 shadow-sm hover:bg-zinc-200",
    outline:
      "border border-zinc-300 bg-white text-zinc-900 shadow-sm hover:border-zinc-400 hover:bg-zinc-50",
    ghost: "text-zinc-700 hover:bg-zinc-100",
    danger:
      "bg-red-600 text-white shadow-sm hover:bg-red-700",
  };

  const sizes = {
    sm: "min-h-9 px-3 py-2 text-sm",
    md: "min-h-11 px-4 py-2.5 text-sm",
    lg: "min-h-12 px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? (
        <svg
          className="-ml-0.5 h-4 w-4 shrink-0 animate-spin text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : null}
      {children}
    </button>
  );
};
