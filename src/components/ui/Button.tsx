import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type Variant = "primary" | "ghost" | "danger" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-[#6b5ce6]",
  ghost: "bg-surface2 text-text border border-border hover:bg-surface3",
  danger: "bg-danger/10 text-danger hover:bg-danger/20",
  icon: "p-2 text-text-dim hover:bg-surface3 hover:text-text rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
        variant !== "icon" && "px-3.5 py-2",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = "Button";
