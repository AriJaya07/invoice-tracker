import { cn } from "@/lib/cn";

type AlertVariant = "error" | "success" | "info";

const variants: Record<
  AlertVariant,
  { root: string; title?: string }
> = {
  error: {
    root: "border-red-200 bg-red-50 text-red-900",
  },
  success: {
    root: "border-emerald-200 bg-emerald-50 text-emerald-900",
  },
  info: {
    root: "border-blue-200 bg-blue-50 text-blue-900",
  },
};

interface AlertProps extends React.ComponentPropsWithoutRef<"div"> {
  variant?: AlertVariant;
  title?: string;
}

export function Alert({
  variant = "info",
  title,
  className,
  children,
  role = "alert",
  ...props
}: AlertProps) {
  const v = variants[variant];
  return (
    <div
      role={role}
      className={cn(
        "rounded-lg border px-4 py-3 text-sm leading-relaxed",
        v.root,
        className
      )}
      {...props}
    >
      {title ? <p className="font-semibold">{title}</p> : null}
      <div className={title ? "mt-1" : undefined}>{children}</div>
    </div>
  );
}
