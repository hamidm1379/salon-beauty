import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

const buttonVariants = {
  primary:
    "bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-primary-soft)] text-white hover:opacity-90 shadow-[0_4px_14px_0_rgba(124,58,237,0.39)]",
  secondary:
    "border-2 border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent hover:bg-[var(--color-primary)]/10",
  ghost:
    "text-[var(--color-ink)] hover:bg-[var(--color-bg-soft)]",
  danger:
    "bg-red-500 text-white hover:bg-red-600",
};

const buttonSizes = {
  sm: "px-4 py-2 text-sm rounded-xl",
  md: "px-6 py-2.5 text-sm rounded-2xl",
  lg: "px-8 py-3 text-base rounded-2xl",
};

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
