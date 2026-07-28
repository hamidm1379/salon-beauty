"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image: { id: string; url: string; alt: string | null } | null;
}

interface GalleryGridProps {
  items: GalleryItem[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function GalleryGrid({ items }: GalleryGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selected = selectedIndex !== null ? items[selectedIndex] : null;

  const goNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev !== null ? (prev + 1) % items.length : null
    );
  }, [selectedIndex, items.length]);

  const goPrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev !== null ? (prev - 1 + items.length) % items.length : null
    );
  }, [selectedIndex, items.length]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goPrev();
      if (e.key === "ArrowLeft") goNext();
      if (e.key === "Escape") setSelectedIndex(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, goNext, goPrev]);

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {items.map((galleryItem, index) => (
          <motion.article
            key={galleryItem.id}
            variants={item}
            onClick={() => setSelectedIndex(index)}
            className="group cursor-pointer aspect-[3/4] rounded-3xl overflow-hidden bg-[var(--color-bg-soft)] relative focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:ring-offset-2"
            role="button"
            tabIndex={0}
            aria-label={`مشاهده تصویر: ${galleryItem.title}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedIndex(index);
              }
            }}
          >
            {galleryItem.image ? (
              <Image
                src={galleryItem.image.url}
                alt={galleryItem.image.alt || galleryItem.title}
                width={400}
                height={533}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading={index < 6 ? "eager" : "lazy"}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--color-ink-muted)]">
                بدون تصویر
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <div>
                <h3 className="text-white font-semibold text-lg">
                  {galleryItem.title}
                </h3>
                {galleryItem.description && (
                  <p className="text-white/80 text-sm mt-1 line-clamp-2">
                    {galleryItem.description}
                  </p>
                )}
              </div>
            </div>

            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="bg-[var(--color-primary)]/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                مشاهده
              </span>
            </div>
          </motion.article>
        ))}
      </motion.div>

      <AnimatePresence>
        {selected && (
          <Modal
            open={!!selected}
            onClose={() => setSelectedIndex(null)}
          >
            <div className="relative" role="dialog" aria-label={selected.title}>
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="absolute -top-12 left-0 w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition backdrop-blur-sm z-10"
                aria-label="بستن"
              >
                <X className="w-5 h-5" />
              </button>

              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute top-1/2 -right-14 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition backdrop-blur-sm z-10"
                    aria-label="تصویر بعدی"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute top-1/2 -left-14 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition backdrop-blur-sm z-10"
                    aria-label="تصویر قبلی"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </>
              )}

              {selected.image && (
                <Image
                  src={selected.image.url}
                  alt={selected.description || selected.title}
                  width={800}
                  height={600}
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="w-full max-h-[70vh] object-contain rounded-2xl"
                  priority
                />
              )}

              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold text-[var(--color-ink)]">
                  {selected.title}
                </h3>
                {selected.description && (
                  <p className="text-[var(--color-ink-muted)] mt-1">
                    {selected.description}
                  </p>
                )}
                <p className="text-[var(--color-ink-muted)]/60 text-sm mt-2">
                  {selectedIndex !== null && `${selectedIndex + 1} از ${items.length}`}
                </p>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
