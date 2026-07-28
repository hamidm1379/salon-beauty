import { forwardRef, type HTMLAttributes, type ElementType } from "react";
import { cn } from "@/utils/cn";

export const Container = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("max-w-7xl mx-auto px-6", className)} {...props} />
  )
);
Container.displayName = "Container";

export const Section = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <section ref={ref} className={cn("py-24", className)} {...props} />
  )
);
Section.displayName = "Section";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4;
}

const headingComponents: Record<number, ElementType> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 2, ...props }, ref) => {
    const Tag = headingComponents[level];
    const sizeClasses = {
      1: "text-4xl lg:text-6xl font-bold",
      2: "text-3xl lg:text-4xl font-bold",
      3: "text-2xl font-semibold",
      4: "text-xl font-semibold",
    };
    return (
      <Tag
        ref={ref}
        className={cn(sizeClasses[level], className)}
        {...props}
      />
    );
  }
);
Heading.displayName = "Heading";
