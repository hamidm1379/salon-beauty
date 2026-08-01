"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Newspaper, ArrowLeft } from "lucide-react";
import { Butterflies } from "./Butterflies";
import { LeafPattern } from "./LeafPattern";

export function Hero() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] as const },
    }),
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-[var(--color-gradient-from)] to-[var(--color-gradient-to)] mt-5">
      <LeafPattern />
      <Butterflies />
      {/* Background ambient glow */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-[var(--color-primary)]/[0.04] blur-[120px]" />
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-[var(--color-gold-accent)]/[0.03] blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 py-24 sm:py-32 lg:py-0 w-full">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-20 items-center">
          {/* ── Text Content ── */}
          <motion.div initial="hidden" animate="visible" className="text-center lg:text-right">
            {/* Eyebrow */}
            {/* <motion.div
              variants={fadeUp}
              custom={0}
              className="flex items-center gap-2 justify-center lg:justify-end mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-gold-accent)]/10 border border-[var(--color-gold-accent)]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold-accent)] animate-pulse" />
                <span className="text-[var(--color-gold-accent)] text-xs font-medium tracking-wide">
                  سالن تخصصی زیبایی
                </span>
              </span>
            </motion.div> */}

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.2] tracking-tight"
            >
              <span className="block text-[var(--color-ink)]">هنر زیبایی</span>
              <span className="block mt-2 text-[var(--color-primary)]">در جزئیات نهفته است</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              custom={3}
              className="text-[var(--color-ink-muted)] text-base sm:text-lg max-w-lg lg:ml-0 mx-auto leading-relaxed"
            >
              جایی که تخصص، هنر و ظرافت در هم می‌آمیزد تا زیبایی طبیعی شما را در بالاترین سطح ممکن
              نمایان کند.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              custom={4}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10 justify-center lg:justify-end"
            >
              <Link
                href="/blog"
                className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-primary-soft)] text-white px-6 py-3 sm:px-8 sm:py-4 font-medium text-sm overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(124,58,237,0.4)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  مقالات 
                  <Newspaper className="w-4 h-4" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-l from-[var(--color-primary-soft)] to-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-ink)]/15 px-6 py-3 sm:px-8 sm:py-4 font-medium text-sm text-[var(--color-ink)] hover:bg-[var(--color-bg-soft)] hover:border-[var(--color-gold-accent)]/30 transition-all duration-300"
              >
                مشاهده خدمات
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          {/* ── Visual Side ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="relative"
          >
            <div className="relative w-full max-w-[280px] sm:max-w-md lg:max-w-lg mx-auto">
              {/* Circle border */}
              <div className="absolute inset-0 m-auto w-[90%] h-[90%] rounded-full border-2 border-[var(--color-primary)]/20" />

              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_8px_40px_-12px_rgba(124,58,237,0.15)]">
                <Image
                  src="/hero.png"
                  alt="مدل خدمات زیبایی"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      {/* {!shouldReduce && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-[var(--color-ink-muted)] tracking-widest uppercase">
            اسکرول
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border border-[var(--color-ink)]/20 flex justify-center pt-1.5"
          >
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-1 rounded-full bg-[var(--color-primary)]"
            />
          </motion.div>
        </motion.div>
      )} */}
    </section>
  );
}

export default Hero;
