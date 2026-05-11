import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: string;
  shadow?: number;
}

export function Card({ className, accent, shadow = 3, style, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] bg-white",
        "border-2 border-[var(--color-ink)]",
        "overflow-hidden",
        className
      )}
      style={{
        boxShadow: `${shadow}px ${shadow}px 0 #1C1917`,
        ...(accent ? { borderLeft: `4px solid ${accent}` } : {}),
        ...style,
      }}
      {...props}
    />
  );
}
