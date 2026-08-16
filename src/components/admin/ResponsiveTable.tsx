"use client";

import { type ReactNode } from "react";
import Image from "next/image";
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
  getMobileImage?: (item: T) => string | null | undefined;
}

export function ResponsiveTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = "داده‌ای یافت نشد",
  getMobileImage,
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
        {data.map((item) => {
          const mobileImage = getMobileImage?.(item);
          const visibleColumns = columns.filter((col) => col.key !== "actions");

          return (
            <div
              key={keyExtractor(item)}
              onClick={() => onRowClick?.(item)}
              className={cn(
                "bg-white rounded-2xl border border-[var(--color-ink)]/5 p-3",
                onRowClick && "cursor-pointer active:scale-[0.98] transition-transform"
              )}
            >
              <div className="flex gap-3">
                {mobileImage && (
                  <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-[var(--color-bg-soft)]">
                    <Image
                      src={mobileImage}
                      alt=""
                      width={64}
                      height={64}
                      sizes="64px"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0 space-y-1.5">
                  {visibleColumns.map((col) => (
                    <div key={col.key} className="flex items-center justify-between gap-2">
                      <span className="text-xs text-[var(--color-ink-muted)]">
                        {col.label}
                      </span>
                      <span className="text-xs font-medium text-[var(--color-ink)] truncate">
                        {col.render
                          ? col.render(item)
                          : String((item as Record<string, unknown>)[col.key] ?? "")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {columns.find((c) => c.key === "actions") && (
                <div className="mt-2 pt-2 border-t border-[var(--color-ink)]/5 flex justify-end">
                  {columns.find((c) => c.key === "actions")!.render?.(item)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
