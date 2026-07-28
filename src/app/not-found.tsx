"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Home, ArrowLeft } from "lucide-react";
import LineUnder from "@/components/home/LineUnder";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" as const },
  }),
};

const float = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const },
  },
};

const rotate = {
  animate: {
    rotate: [0, 12, -12, 0],
    transition: { duration: 7, repeat: Infinity, ease: "easeInOut" as const },
  },
};

const pulse = {
  animate: {
    scale: [1, 1.15, 1],
    opacity: [0.5, 1, 0.5],
    transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" as const },
  },
};

/* ─── Decorative SVGs ─── */

function ScissorsSvg() {
  return (
    <motion.svg
      viewBox="0 0 50 60"
      fill="none"
      className="w-11 h-14"
      variants={rotate}
      animate="animate"
      aria-hidden="true"
    >
      <circle cx="12" cy="48" r="7" stroke="var(--color-primary)" strokeWidth="2.5" opacity="0.3" fill="none" />
      <circle cx="38" cy="48" r="7" stroke="var(--color-primary)" strokeWidth="2.5" opacity="0.3" fill="none" />
      <line x1="12" y1="41" x2="25" y2="10" stroke="var(--color-primary)" strokeWidth="2.5" opacity="0.35" strokeLinecap="round" />
      <line x1="38" y1="41" x2="25" y2="10" stroke="var(--color-primary)" strokeWidth="2.5" opacity="0.35" strokeLinecap="round" />
    </motion.svg>
  );
}

function DiamondSvg() {
  return (
    <motion.svg
      viewBox="0 0 40 40"
      fill="none"
      className="w-9 h-9"
      variants={pulse}
      animate="animate"
      aria-hidden="true"
    >
      <polygon points="20,2 38,18 20,38 2,18" fill="var(--color-primary)" opacity="0.12" />
      <polygon points="20,6 34,18 20,34 6,18" fill="var(--color-primary)" opacity="0.2" />
      <polygon points="20,10 30,18 20,30 10,18" fill="var(--color-primary)" opacity="0.3" />
    </motion.svg>
  );
}

function StarSvg() {
  return (
    <motion.svg
      viewBox="0 0 40 40"
      fill="none"
      className="w-10 h-10"
      variants={float}
      animate="animate"
      aria-hidden="true"
    >
      <polygon
        points="20,2 24.5,14.5 38,16 28,25 30.5,38 20,32 9.5,38 12,25 2,16 15.5,14.5"
        fill="var(--color-primary)"
        opacity="0.15"
      />
      <polygon
        points="20,8 23,15 30,16.2 25,21.5 26.2,28.5 20,25 13.8,28.5 15,21.5 10,16.2 17,15"
        fill="var(--color-primary)"
        opacity="0.25"
      />
    </motion.svg>
  );
}

function SparkleSvg() {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-6 h-6"
      variants={pulse}
      animate="animate"
      aria-hidden="true"
    >
      <path
        d="M12 2L13.5 9.5L21 12L13.5 14.5L12 22L10.5 14.5L3 12L10.5 9.5L12 2Z"
        fill="var(--color-primary)"
        opacity="0.2"
      />
    </motion.svg>
  );
}

function FlowerSvg() {
  return (
    <motion.svg
      viewBox="0 0 60 60"
      fill="none"
      className="w-14 h-14"
      variants={float}
      animate="animate"
      aria-hidden="true"
    >
      <ellipse cx="30" cy="18" rx="8" ry="14" fill="var(--color-primary)" opacity="0.15" transform="rotate(0 30 30)" />
      <ellipse cx="30" cy="18" rx="8" ry="14" fill="var(--color-primary)" opacity="0.12" transform="rotate(72 30 30)" />
      <ellipse cx="30" cy="18" rx="8" ry="14" fill="var(--color-primary)" opacity="0.1" transform="rotate(144 30 30)" />
      <ellipse cx="30" cy="18" rx="8" ry="14" fill="var(--color-primary)" opacity="0.12" transform="rotate(216 30 30)" />
      <ellipse cx="30" cy="18" rx="8" ry="14" fill="var(--color-primary)" opacity="0.15" transform="rotate(288 30 30)" />
      <circle cx="30" cy="30" r="5" fill="var(--color-primary)" opacity="0.25" />
    </motion.svg>
  );
}

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--color-bg)]">
      {/* Floating decorative icons */}
      <motion.div
        className="absolute top-24 right-[10%] opacity-30 hidden lg:block"
        initial="hidden"
        animate="animate"
        variants={rotate}
      >
        <ScissorsSvg />
      </motion.div>
      <motion.div
        className="absolute top-36 left-[8%] opacity-35 hidden lg:block"
        initial="hidden"
        animate="animate"
        variants={pulse}
      >
        <DiamondSvg />
      </motion.div>
      <motion.div
        className="absolute bottom-32 right-[15%] opacity-25 hidden lg:block"
        initial="hidden"
        animate="animate"
        variants={float}
      >
        <StarSvg />
      </motion.div>
      <motion.div
        className="absolute top-44 left-[25%] opacity-30 hidden lg:block"
        initial="hidden"
        animate="animate"
        variants={pulse}
      >
        <SparkleSvg />
      </motion.div>
      <motion.div
        className="absolute bottom-24 left-[10%] opacity-20 hidden lg:block"
        initial="hidden"
        animate="animate"
        variants={float}
      >
        <FlowerSvg />
      </motion.div>
      <motion.div
        className="absolute bottom-40 right-[30%] opacity-20 hidden lg:block"
        initial="hidden"
        animate="animate"
        variants={rotate}
      >
        <ScissorsSvg />
      </motion.div>

      {/* Background glows */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-[var(--color-primary)]/5 blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full bg-[var(--color-primary)]/[0.08] blur-3xl" />

      {/* Main content */}
      <div className="relative max-w-lg mx-auto px-6 text-center">
        <motion.div initial="hidden" animate="visible">
          {/* 404 Number */}
          <motion.div variants={fadeUp} custom={0} className="relative inline-block mb-6">
            <span className="text-[10rem] lg:text-[14rem] font-bold leading-none text-[var(--color-primary)]/[0.07] select-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 flex items-center justify-center border border-[var(--color-primary)]/10">
                <Sparkles className="w-10 h-10 lg:w-14 lg:h-14 text-[var(--color-primary)]/60" />
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-3xl lg:text-4xl font-bold text-[var(--color-ink)] mb-2"
          >
            صفحه مورد نظر یافت{" "}
            <span className="text-[var(--color-primary)]">نشد</span>
          </motion.h1>

          {/* LineUnder */}
          <motion.div variants={fadeUp} custom={2} className="flex justify-center mt-3 mb-6">
            <LineUnder />
          </motion.div>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            custom={3}
            className="text-[var(--color-ink-muted)] text-lg leading-relaxed max-w-md mx-auto mb-10"
          >
            به نظر می‌رسد این صفحه جابه‌جا شده یا دیگر وجود ندارد.
            <br />
            نگران نباشید، می‌توانید از صفحه اصلی شروع کنید.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeUp} custom={4} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] text-white px-8 py-3.5 font-medium hover:opacity-90 transition-opacity duration-200 shadow-[0_4px_14px_0_rgba(124,58,237,0.39)]"
            >
              <Home className="w-4 h-4" />
              بازگشت به خانه
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-ink)]/15 px-8 py-3.5 font-medium hover:bg-[var(--color-bg-soft)] transition-colors duration-200 text-[var(--color-ink)]"
            >
              مشاهده خدمات
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
