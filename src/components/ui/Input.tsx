import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-3 py-2 border rounded-lg transition-all focus:outline-none focus:ring-2 
            ${error 
              ? "border-red-500 focus:ring-red-200" 
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
            }
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-sm text-red-500 mt-0.5">{error}</p>}
        {helperText && !error && <p className="text-sm text-gray-500 mt-0.5">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
