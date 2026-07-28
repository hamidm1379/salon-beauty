"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const images = [
  "/gal1.jpeg",
  "/gal2.jpeg",
  "/gal1.jpeg",
  "/gal2.jpeg",
  "/gal1.jpeg",
  "/gal2.jpeg",
  "/gal1.jpeg",
  "/gal2.jpeg",
];

export function GallerySlider() {
  return (
    <section className="py-20 bg-[var(--color-bg-soft)] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-gold-accent)]/10 border border-[var(--color-gold-accent)]/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold-accent)]" />
            <span className="text-[var(--color-gold-accent)] text-xs font-medium tracking-wide">
              نمونه کارها
            </span>
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-[var(--color-ink)]">
            گالری{" "}
            <span className="bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-gold-accent)] bg-clip-text text-transparent">
              زیبایی
            </span>
          </h2>
        </motion.div>

        {/* Slider */}
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          dir="rtl"
          className="gallery-swiper"
        >
          {images.map((src, i) => (
            <SwiperSlide key={`${src}-${i}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
              >
                <Image
                  src={src}
                  alt={`نمونه کار ${i + 1}`}
                  width={300}
                  height={400}
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 inset-x-0 p-4">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
                {/* Gold border on hover */}
                <div className="absolute inset-0 rounded-2xl border-2 border-[var(--color-gold-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Custom swiper styles */}
      <style jsx global>{`
        .gallery-swiper .swiper-button-next,
        .gallery-swiper .swiper-button-prev {
          color: var(--color-gold-accent);
          width: 40px;
          height: 40px;
          background: var(--color-bg);
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .gallery-swiper .swiper-button-next::after,
        .gallery-swiper .swiper-button-prev::after {
          font-size: 16px;
        }
      `}</style>
    </section>
  );
}
