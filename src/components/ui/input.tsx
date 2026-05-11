import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-[10px] font-bold tracking-[1.5px] uppercase text-[var(--color-ink-mute)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            "h-12 w-full rounded-[var(--radius-button)] px-4 text-sm font-medium",
            "bg-white border-2 border-[var(--color-ink)]",
            "text-[var(--color-ink)] placeholder:text-[var(--color-ink-mute)]",
            "outline-none transition-shadow duration-150",
            "focus:[box-shadow:3px_3px_0_var(--color-ink)]",
            error && "border-[var(--color-danger)]",
            className
          )}
          {...props}
        />
        {error && (
          <p
            className="text-xs font-bold text-[var(--color-danger)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
