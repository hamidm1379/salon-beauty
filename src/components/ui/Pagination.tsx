"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/utils/cn";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav
      className={cn("flex items-center justify-center gap-2", className)}
      aria-label="صفحه‌بندی"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl hover:bg-[var(--color-bg-soft)] disabled:opacity-30 disabled:cursor-not-allowed transition"
        aria-label="صفحه قبل"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-[var(--color-ink-muted)]">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "w-10 h-10 rounded-xl text-sm font-medium transition",
              page === currentPage
                ? "bg-[var(--color-primary)] text-white"
                : "hover:bg-[var(--color-bg-soft)] text-[var(--color-ink)]"
            )}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl hover:bg-[var(--color-bg-soft)] disabled:opacity-30 disabled:cursor-not-allowed transition"
        aria-label="صفحه بعد"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    </nav>
  );
}
