"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import LineUnder from "./LineUnder";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

interface ServicesGridProps {
  categories: Category[];
}

const accents = [
  "from-rose-400/20 to-pink-500/20",
  "from-purple-400/20 to-violet-500/20",
  "from-amber-400/20 to-orange-500/20",
  "from-emerald-400/20 to-teal-500/20",
  "from-[var(--color-gold-accent)]/20 to-amber-500/20",
];

function ServiceCard({
  category,
  accent,
}: {
  category: { name: string; slug: string; description: string | null; image: string | null };
  accent: string;
}) {
  return (
    <div className="group relative bg-[var(--color-bg)] rounded-2xl overflow-hidden shadow-[0_4px_20px_-8px_rgba(124,58,237,0.08)] hover:shadow-[0_20px_40px_-12px_rgba(124,58,237,0.15)] transition-shadow duration-300 h-full">
      {/* Image */}
      <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            width={300}
            height={300}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-gold-accent)]/10 flex items-center justify-center">
            <span className="text-4xl font-bold text-[var(--color-primary)]/20">
              {category.name.charAt(0)}
            </span>
          </div>
        )}
        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5">
        <h3 className="font-semibold text-sm sm:text-base text-[var(--color-ink)] group-hover:text-[var(--color-primary)] transition-colors">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-[11px] sm:text-xs text-[var(--color-ink-muted)] mt-1.5 sm:mt-2 leading-relaxed line-clamp-2">
            {category.description}
          </p>
        )}
        <div className="flex justify-end mt-2 sm:mt-3">
          <Link
            href={`/services?category=${category.slug}`}
            className="inline-flex items-center gap-1 text-[var(--color-primary)] text-[11px] sm:text-xs font-medium group/link"
          >
            <span className="group-hover/link:gap-2 transition-all">مشاهده</span>
            <ArrowLeft className="w-3 h-3 group-hover/link:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Gold accent line on hover */}
      <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-l from-[var(--color-gold-accent)] to-[var(--color-primary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right" />
    </div>
  );
}

export function ServicesGrid({ categories }: ServicesGridProps) {
  const [mounted] = useState(() => { if (typeof window !== "undefined") return true; return false; });

  return (
    <section className="py-16 sm:py-24 bg-[var(--color-bg-soft)] relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[var(--color-primary)]/[0.03] blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[var(--color-gold-accent)]/[0.02] blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-[var(--color-ink)]">
            خدمات{" "}
            <span className="bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-gold-accent)] bg-clip-text text-transparent">
              تخصصی
            </span>{" "}
            ما
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-ink-muted)] mt-3 sm:mt-4 max-w-lg mx-auto mb-3 sm:mb-4">
            مجموعه‌ای کامل از خدمات زیبایی با بالاترین کیفیت و استانداردهای بین‌المللی
          </p>
          <div className="flex justify-center">
            <LineUnder />
          </div>
        </motion.div>

        {categories.length > 0 && (
          <>
            {/* Mobile: Slider */}
            {mounted && (
              <div className="sm:hidden">
                <Swiper
                  modules={[Navigation, Autoplay]}
                  navigation
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  spaceBetween={12}
                  slidesPerView={2}
                  dir="rtl"
                  className="services-swiper"
                >
                  {categories.map((cat, i) => (
                    <SwiperSlide key={cat.id}>
                      <ServiceCard
                        category={cat}
                        accent={accents[i % accents.length]}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}

            {/* Desktop: Grid */}
            {mounted && (
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                {categories.map((cat, i) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  >
                    <ServiceCard
                      category={cat}
                      accent={accents[i % accents.length]}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Custom swiper styles */}
      <style jsx global>{`
        .services-swiper .swiper-button-next,
        .services-swiper .swiper-button-prev {
          color: var(--color-gold-accent);
          width: 24px;
          height: 24px;
          background: transparent;
          box-shadow: none;
        }
        .services-swiper .swiper-button-next::after,
        .services-swiper .swiper-button-prev::after {
          font-size: 10px;
        }
      `}</style>
    </section>
  );
}
