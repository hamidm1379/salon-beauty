"use client";

import { useEffect, useRef, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { Button } from "./Button";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
  className?: string;
}

export function Dialog({
  open,
  onClose,
  onConfirm,
  children,
  title,
  description,
  confirmText = "تأیید",
  cancelText = "لغو",
  variant = "primary",
  className,
}: DialogProps) {
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
          role="alertdialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "w-full max-w-md bg-white rounded-3xl shadow-2xl p-6",
              className
            )}
          >
            {title && (
              <h2 className="text-lg font-semibold text-[var(--color-ink)]">{title}</h2>
            )}
            {description && (
              <p className="mt-2 text-sm text-[var(--color-ink-muted)]">{description}</p>
            )}
            <div className="mt-4">{children}</div>
            <div className="flex gap-3 mt-6 justify-end">
              <Button variant="ghost" onClick={onClose}>
                {cancelText}
              </Button>
              <Button
                variant={variant === "danger" ? "danger" : "primary"}
                onClick={() => {
                  onConfirm?.();
                  onClose();
                }}
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
