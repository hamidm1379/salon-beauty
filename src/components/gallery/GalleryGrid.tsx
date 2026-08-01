"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import ReactPlayer from "react-player";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, Film } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

interface GalleryImage {
  id: string;
  url: string;
  type: string | null;
  alt: string | null;
}

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image: GalleryImage | null;
}

interface GalleryGridProps {
  items: GalleryItem[];
}

type TabType = "photos" | "videos";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const gridItem = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function GalleryGrid({ items }: GalleryGridProps) {
  const [activeTab, setActiveTab] = useState<TabType>("photos");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const photos = items.filter((i) => i.image?.type !== "video");
  const videos = items.filter((i) => i.image?.type === "video");

  const activeItems = activeTab === "photos" ? photos : videos;
  const selected = selectedIndex !== null ? activeItems[selectedIndex] : null;

  const goNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev !== null ? (prev + 1) % activeItems.length : null
    );
  }, [selectedIndex, activeItems.length]);

  const goPrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev !== null ? (prev - 1 + activeItems.length) % activeItems.length : null
    );
  }, [selectedIndex, activeItems.length]);

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

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSelectedIndex(null);
  };

  return (
    <>
      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 mb-10">
        <button
          onClick={() => handleTabChange("photos")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
            activeTab === "photos"
              ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/25"
              : "bg-[var(--color-bg)] text-[var(--color-ink-muted)] hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-ink)]"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          تصاویر
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
            activeTab === "photos" ? "bg-white/20" : "bg-[var(--color-ink)]/5"
          }`}>
            {photos.length}
          </span>
        </button>
        <button
          onClick={() => handleTabChange("videos")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
            activeTab === "videos"
              ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/25"
              : "bg-[var(--color-bg)] text-[var(--color-ink-muted)] hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-ink)]"
          }`}
        >
          <Film className="w-4 h-4" />
          ویدیوها
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
            activeTab === "videos" ? "bg-white/20" : "bg-[var(--color-ink)]/5"
          }`}>
            {videos.length}
          </span>
        </button>
      </div>

      {/* Grid */}
      {activeItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[var(--color-ink-muted)] text-lg">
            {activeTab === "photos" ? "هنوز تصویری اضافه نشده است" : "هنوز ویدیویی اضافه نشده است"}
          </p>
        </div>
      ) : (
        <motion.div
          key={activeTab}
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {activeItems.map((galleryItem, index) => (
            <motion.article
              key={galleryItem.id}
              variants={gridItem}
              onClick={() => setSelectedIndex(index)}
              className="group cursor-pointer aspect-[4/3] rounded-2xl overflow-hidden bg-[var(--color-bg-soft)] relative focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:ring-offset-2"
              role="button"
              tabIndex={0}
              aria-label={`مشاهده: ${galleryItem.title}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedIndex(index);
                }
              }}
            >
              {galleryItem.image ? (
                galleryItem.image.type === "video" ? (
                  <div className="relative w-full h-full">
                    <video
                      src={galleryItem.image.url}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      muted
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[12px] border-l-[var(--color-primary)] ml-[3.5px]" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <Image
                    src={galleryItem.image.url}
                    alt={galleryItem.image.alt || galleryItem.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading={index < 6 ? "eager" : "lazy"}
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--color-ink-muted)]">
                  بدون تصویر
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 sm:p-6">
                <div>
                  <h3 className="text-white font-semibold text-base sm:text-lg">
                    {galleryItem.title}
                  </h3>
                  {galleryItem.description && (
                    <p className="text-white/80 text-xs sm:text-sm mt-1 line-clamp-2">
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
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selected && (
          <Modal
            open={!!selected}
            onClose={() => setSelectedIndex(null)}
            className="max-w-4xl"
          >
            <div className="relative -m-6 rounded-2xl overflow-hidden">
              {/* Close button */}
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="absolute top-3 left-3 z-20 w-9 h-9 rounded-full bg-black/10 text-[var(--color-ink)] flex items-center justify-center hover:bg-black/20 transition"
                aria-label="بستن"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Navigation */}
              {activeItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute top-1/2 right-2 sm:right-3 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/10 text-[var(--color-ink)] flex items-center justify-center hover:bg-black/20 transition"
                    aria-label="قبلی"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute top-1/2 left-2 sm:left-3 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/10 text-[var(--color-ink)] flex items-center justify-center hover:bg-black/20 transition"
                    aria-label="بعدی"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Media content */}
              <div className="flex items-center justify-center min-h-[200px] sm:min-h-[300px] max-h-[65vh] bg-[var(--color-bg-soft)]">
                {selected.image?.type === "video" ? (
                  <ReactPlayer
                    src={selected.image.url}
                    controls
                    playing
                    width="100%"
                    height="100%"
                    className="max-h-[65vh]"
                  />
                ) : selected.image ? (
                  <Image
                    src={selected.image.url}
                    alt={selected.description || selected.title}
                    width={1200}
                    height={800}
                    sizes="(max-width: 768px) 100vw, 80vw"
                    className="w-full h-full object-contain"
                    priority
                  />
                ) : null}
              </div>

              {/* Info */}
              <div className="p-4 sm:p-5 text-center">
                <h3 className="text-[var(--color-ink)] font-semibold text-base sm:text-lg">
                  {selected.title}
                </h3>
                {selected.description && (
                  <p className="text-[var(--color-ink-muted)] text-sm mt-1">
                    {selected.description}
                  </p>
                )}
                <p className="text-[var(--color-ink-muted)]/60 text-xs mt-2">
                  {selectedIndex !== null && `${selectedIndex + 1} از ${activeItems.length}`}
                </p>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
