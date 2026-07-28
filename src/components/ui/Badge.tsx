import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

const badgeVariants = {
  default: "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  outline: "border border-[var(--color-ink)]/20 text-[var(--color-ink)]",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeVariants;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  )
);

Badge.displayName = "Badge";
