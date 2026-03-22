import { cn } from "@/lib/cn";

/** Shared primitives for text-like form controls (inputs, selects, textareas). */
export const fieldBase = cn(
  "w-full min-h-11 rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-base text-zinc-900 shadow-sm",
  "placeholder:text-zinc-400",
  "transition-[color,box-shadow,border-color] duration-150",
  "hover:border-zinc-400",
  "focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25",
  "disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500 disabled:opacity-80",
  "aria-invalid:border-red-600 aria-invalid:focus-visible:border-red-600 aria-invalid:focus-visible:ring-red-600/25"
);

export const fieldLabel = "text-sm font-medium text-zinc-800";

export const fieldHint = "text-sm text-zinc-500";

export const fieldErrorText = "text-sm font-medium text-red-700";
