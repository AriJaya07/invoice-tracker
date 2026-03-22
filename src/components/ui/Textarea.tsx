import React from "react";
import { cn } from "@/lib/cn";
import { fieldBase, fieldErrorText, fieldHint, fieldLabel } from "./field-classes";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
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
        <textarea
          ref={ref}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [error ? errorId : null, helperText && !error ? hintId : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={cn(fieldBase, "min-h-[120px] resize-y py-3", error && "border-red-600", className)}
          {...props}
        />
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

Textarea.displayName = "Textarea";
