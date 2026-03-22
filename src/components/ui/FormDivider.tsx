import { cn } from "@/lib/cn";

interface FormDividerProps {
  label: string;
  className?: string;
}

export function FormDivider({ label, className }: FormDividerProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-0 flex items-center" aria-hidden>
        <span className="w-full border-t border-zinc-200" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-white px-3 font-medium text-zinc-500">{label}</span>
      </div>
    </div>
  );
}
