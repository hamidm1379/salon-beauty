"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

interface AccordionContextValue {
  openItems: Set<string>;
  toggle: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion components must be used within <Accordion>");
  return ctx;
}

export interface AccordionProps {
  children: ReactNode;
  className?: string;
  multiple?: boolean;
  defaultOpen?: string[];
}

export function Accordion({
  children,
  className,
  multiple = false,
  defaultOpen = [],
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpen));

  const toggle = useCallback(
    (id: string) => {
      setOpenItems((prev) => {
        const next = new Set(multiple ? prev : []);
        if (prev.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    },
    [multiple]
  );

  return (
    <AccordionContext.Provider value={{ openItems, toggle }}>
      <div className={cn("space-y-2", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function AccordionItem({ children, className }: AccordionItemProps) {
  return <div className={cn("border border-[var(--color-ink)]/10 rounded-2xl", className)}>{children}</div>;
}

export interface AccordionTriggerProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function AccordionTrigger({ id, children, className }: AccordionTriggerProps) {
  const { openItems, toggle } = useAccordion();
  const isOpen = openItems.has(id);

  return (
    <button
      onClick={() => toggle(id)}
      aria-expanded={isOpen}
      className={cn(
        "w-full flex items-center justify-between p-4 text-right font-medium text-[var(--color-ink)] hover:bg-[var(--color-bg-soft)] rounded-2xl transition",
        className
      )}
    >
      {children}
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown className="w-5 h-5 text-[var(--color-ink-muted)]" />
      </motion.div>
    </button>
  );
}

export interface AccordionContentProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function AccordionContent({ id, children, className }: AccordionContentProps) {
  const { openItems } = useAccordion();
  const isOpen = openItems.has(id);

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className={cn("p-4 pt-0 text-[var(--color-ink-muted)]", className)}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
