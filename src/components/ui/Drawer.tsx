"use client";

import { useEffect, useRef, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  side?: "right" | "left";
  className?: string;
}

export function Drawer({
  open,
  onClose,
  children,
  title,
  side = "right",
  className,
}: DrawerProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, handleEscape]);

  const slideFrom = side === "right" ? "100%" : "-100%";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
          aria-modal="true"
          role="dialog"
          aria-label={title}
        >
          <motion.div
            ref={contentRef}
            initial={{ x: slideFrom }}
            animate={{ x: 0 }}
            exit={{ x: slideFrom }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "absolute top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto",
              side === "right" ? "right-0" : "left-0",
              className
            )}
          >
            {title && (
              <div className="flex items-center justify-between p-6 border-b border-[var(--color-ink)]/10">
                <h2 className="text-lg font-semibold text-[var(--color-ink)]">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-[var(--color-bg-soft)] transition"
                  aria-label="بستن"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
