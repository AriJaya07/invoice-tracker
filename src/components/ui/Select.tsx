import React from "react";
import { cn } from "@/lib/cn";
import { fieldBase, fieldErrorText, fieldHint, fieldLabel } from "./field-classes";
import { ChevronDown } from "lucide-react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, className = "", children, id, ...props }, ref) => {
    const autoId = React.useId();
    const fieldId = id ?? autoId;
    const errorId = `${fieldId}-error`;
    const hintId = `${fieldId}-hint`;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label ? (
          <label htmlFor={fieldId} className={fieldLabel}>
            {label}
            {props.required ? (
              <span className="ml-0.5 text-red-600" aria-hidden>
                *
              </span>
            ) : null}
          </label>
        ) : null}
        <div className="relative">
          <select
            ref={ref}
            id={fieldId}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              [error ? errorId : null, helperText && !error ? hintId : null]
                .filter(Boolean)
                .join(" ") || undefined
            }
            className={cn(
              fieldBase,
              "cursor-pointer appearance-none pr-10",
              error && "border-red-600",
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            aria-hidden
          />
        </div>
        {error ? (
          <p id={errorId} className={fieldErrorText} role="alert">
            {error}
          </p>
        ) : null}
        {helperText && !error ? (
          <p id={hintId} className={fieldHint}>
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
