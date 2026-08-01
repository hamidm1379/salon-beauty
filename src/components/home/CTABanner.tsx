"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, Sparkles } from "lucide-react";

export function CTABanner() {
  return (
    <section className="relative overflow-hidden my-12 sm:my-20 mx-4 sm:mx-6 rounded-3xl">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image src="/ctabg.jpeg" alt="" fill sizes="100vw" className="object-cover" />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Gold corner accents */}
      <svg
        className="absolute top-4 right-4 w-12 h-12 text-[var(--color-gold-accent)]/30"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 44V16C4 9.37 9.37 4 16 4H44"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <svg
        className="absolute bottom-4 left-4 w-12 h-12 text-[var(--color-gold-accent)]/30"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M44 4V32C44 38.63 38.63 44 32 44H4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-10 sm:py-14 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-right"
        >
          <div className="flex items-center gap-2 justify-center md:justify-end mb-4">
            <Sparkles className="w-4 h-4 text-[var(--color-gold-accent)]" />
            <span className="text-[var(--color-gold-accent)] text-xs font-medium tracking-wide">
              ویژه مشتریان عزیز ( به زودی )
            </span>
          </div>
          <h3 className="text-white text-2xl lg:text-3xl font-bold leading-snug">
            وقت آن است که به خودتان اهمیت دهید
          </h3>
          <p className="text-white/70 mt-3 text-sm max-w-md">
            همین حالا نوبت خود را رزرو کنید و زیبایی‌تان را تکمیل کنید. تخفیف ویژه اولین نوبت.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="به زودی فعال می‌شود"
            className="group inline-flex items-center gap-3 rounded-full bg-white/60 text-[var(--color-primary)]/60 px-8 py-4 font-semibold cursor-not-allowed opacity-60 grayscale-[30%]"
          >
            <Calendar className="w-5 h-5" />
            رزرو نوبت
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold-accent)]/50" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
