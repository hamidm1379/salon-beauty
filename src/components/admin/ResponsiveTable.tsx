"use client";

import { type ReactNode } from "react";
import { cn } from "@/utils/cn";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface ResponsiveTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export function ResponsiveTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = "داده‌ای یافت نشد",
}: ResponsiveTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--color-ink-muted)]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-[var(--color-bg-soft)]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "text-right px-4 py-3 text-sm font-medium text-[var(--color-ink-muted)]",
                    col.className
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  "border-b last:border-b-0 hover:bg-[var(--color-bg-soft)] transition-colors",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn("px-4 py-3", col.className)}>
                    {col.render
                      ? col.render(item)
                      : String((item as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {data.map((item) => (
          <div
            key={keyExtractor(item)}
            onClick={() => onRowClick?.(item)}
            className={cn(
              "bg-white rounded-2xl border border-[var(--color-ink)]/5 p-4 space-y-3",
              onRowClick && "cursor-pointer active:scale-[0.98] transition-transform"
            )}
          >
            {columns.map((col) => (
              <div key={col.key} className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-ink-muted)]">
                  {col.label}
                </span>
                <span className="text-sm font-medium text-[var(--color-ink)]">
                  {col.render
                    ? col.render(item)
                    : String((item as Record<string, unknown>)[col.key] ?? "")}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
