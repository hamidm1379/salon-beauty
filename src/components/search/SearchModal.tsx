"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2, BookOpen, Scissors } from "lucide-react";
import { useSearch } from "@/hooks/use-search";
import type { SearchResultService, SearchResultBlog } from "@/hooks/use-search";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

function ServiceResult({ item, onClose }: { item: SearchResultService; onClose: () => void }) {
  return (
    <Link
      href={`/services/${item.slug}`}
      onClick={onClose}
      className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--color-primary)]/5 transition-colors group"
    >
      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[var(--color-bg-soft)] shrink-0">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Scissors className="w-5 h-5 text-[var(--color-primary)]/30" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-primary)] transition-colors truncate">
          {item.name}
        </p>
        <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">
          {item.category.name}
        </p>
      </div>
    </Link>
  );
}

function BlogResult({ item, onClose }: { item: SearchResultBlog; onClose: () => void }) {
  return (
    <Link
      href={`/blog/${item.slug}`}
      onClick={onClose}
      className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--color-primary)]/5 transition-colors group"
    >
      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[var(--color-bg-soft)] shrink-0">
        {item.coverImage ? (
          <Image
            src={item.coverImage}
            alt={item.title}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[var(--color-primary)]/30" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-primary)] transition-colors truncate">
          {item.title}
        </p>
        <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">
          {item.blogCategory.name}
        </p>
      </div>
    </Link>
  );
}

function SearchContent({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { services, blog, isLoading, isInitial, noResults } = useSearch(query);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const hasResults = services.length > 0 || blog.length > 0;

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 sm:pt-16 h-full flex flex-col">
      {/* Search Input */}
      <div className="relative shrink-0">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-ink-muted)]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو در خدمات و مقالات..."
          dir="rtl"
          className="w-full pr-12 pl-12 py-4 rounded-2xl border border-[var(--color-ink)]/10 bg-[var(--color-bg)] text-[var(--color-ink)] text-lg placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]/40 shadow-[0_8px_30px_-8px_rgba(124,58,237,0.12)]"
        />
        <button
          onClick={onClose}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl hover:bg-[var(--color-bg-soft)] transition"
          aria-label="بستن"
        >
          <X className="w-5 h-5 text-[var(--color-ink-muted)]" />
        </button>
      </div>

      {/* Results */}
      <div className="mt-6 overflow-y-auto flex-1 overscroll-contain pb-8">
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
          </div>
        )}

        {isInitial && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 mx-auto text-[var(--color-ink-muted)]/20 mb-4" />
            <p className="text-[var(--color-ink-muted)] text-sm">
              حداقل ۲ حرف تایپ کنید
            </p>
          </div>
        )}

        {noResults && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 mx-auto text-[var(--color-ink-muted)]/20 mb-4" />
            <p className="text-[var(--color-ink-muted)] text-sm">
              نتیجه‌ای برای &laquo;{query}&raquo; یافت نشد
            </p>
          </div>
        )}

        {hasResults && (
          <div className="space-y-6">
            {services.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider mb-2 px-3">
                  خدمات ({services.length})
                </h3>
                <div className="space-y-1">
                        {services.map((item) => (
                          <ServiceResult key={item.id} item={item} onClose={onClose} />
                        ))}
                </div>
              </div>
            )}

            {blog.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider mb-2 px-3">
                  مقالات ({blog.length})
                </h3>
                <div className="space-y-1">
                        {blog.map((item) => (
                          <BlogResult key={item.id} item={item} onClose={onClose} />
                        ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 bg-[var(--color-bg)]/95 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <SearchContent onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
