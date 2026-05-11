import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "due" | "overdue" | "done" | "accent";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    default: "bg-white text-[var(--color-ink-soft)] border-[var(--color-ink)]",
    due:     "bg-[var(--color-okay)] text-[var(--color-ink)] border-[var(--color-ink)]",
    overdue: "bg-[var(--color-danger)] text-white border-[var(--color-ink)]",
    done:    "bg-[var(--color-easy)] text-white border-[var(--color-ink)]",
    accent:  "bg-[var(--color-accent)] text-white border-[var(--color-ink)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold border tracking-wide",
        variants[variant],
        className
      )}
      style={{ fontFamily: "var(--font-mono)" }}
      {...props}
    />
  );
}
