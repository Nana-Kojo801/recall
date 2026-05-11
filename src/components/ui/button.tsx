import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-bold transition-all duration-150 select-none cursor-pointer disabled:opacity-40 disabled:pointer-events-none active:translate-x-[1px] active:translate-y-[1px]",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-ink)] text-white border-2 border-[var(--color-ink)] [box-shadow:3px_3px_0_var(--color-ink)] active:[box-shadow:1px_1px_0_var(--color-ink)]",
        accent:
          "bg-[var(--color-accent)] text-white border-2 border-[var(--color-ink)] [box-shadow:3px_3px_0_var(--color-ink)] active:[box-shadow:1px_1px_0_var(--color-ink)]",
        secondary:
          "bg-white text-[var(--color-ink)] border-2 border-[var(--color-ink)] [box-shadow:3px_3px_0_var(--color-ink)] active:[box-shadow:1px_1px_0_var(--color-ink)]",
        ghost:
          "bg-transparent text-[var(--color-ink-soft)] border-2 border-transparent hover:border-[var(--color-ink)] hover:bg-white",
        danger:
          "bg-[var(--color-danger)] text-white border-2 border-[var(--color-ink)] [box-shadow:3px_3px_0_var(--color-ink)] active:[box-shadow:1px_1px_0_var(--color-ink)]",
        hard:
          "bg-[var(--color-hard)] text-white border-2 border-[var(--color-ink)] [box-shadow:4px_4px_0_var(--color-ink)] active:[box-shadow:1px_1px_0_var(--color-ink)]",
        okay:
          "bg-[var(--color-okay)] text-[var(--color-ink)] border-2 border-[var(--color-ink)] [box-shadow:4px_4px_0_var(--color-ink)] active:[box-shadow:1px_1px_0_var(--color-ink)]",
        easy:
          "bg-[var(--color-easy)] text-white border-2 border-[var(--color-ink)] [box-shadow:4px_4px_0_var(--color-ink)] active:[box-shadow:1px_1px_0_var(--color-ink)]",
      },
      size: {
        sm:   "h-8 px-3 text-sm rounded-[8px]",
        md:   "h-11 px-5 text-sm rounded-[var(--radius-button)]",
        lg:   "h-13 px-6 text-base rounded-[var(--radius-button)]",
        icon: "h-10 w-10 rounded-[var(--radius-button)]",
        pill: "h-10 px-5 text-sm rounded-[var(--radius-pill)]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
