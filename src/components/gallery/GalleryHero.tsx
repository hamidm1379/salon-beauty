"use client";

import { motion } from "framer-motion";
import LineUnder from "@/components/home/LineUnder";
import { Images } from "lucide-react";

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

function CameraSvg({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      variants={rotate}
      animate="animate"
      aria-hidden="true"
    >
      <rect x="4" y="12" width="40" height="28" rx="4" fill="var(--color-primary)" opacity="0.12" />
      <rect x="6" y="14" width="36" height="24" rx="3" fill="var(--color-primary)" opacity="0.2" />
      <circle cx="24" cy="26" r="8" fill="var(--color-primary)" opacity="0.15" />
      <circle cx="24" cy="26" r="5" fill="var(--color-primary)" opacity="0.3" />
      <circle cx="24" cy="26" r="2" fill="var(--color-primary)" opacity="0.5" />
      <rect x="18" y="8" width="12" height="6" rx="2" fill="var(--color-primary)" opacity="0.18" />
    </motion.svg>
  );
}

function FrameSvg({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 44 44"
      fill="none"
      className={className}
      variants={pulse}
      animate="animate"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="36" height="36" rx="3" stroke="var(--color-primary)" strokeWidth="2.5" opacity="0.2" fill="none" />
      <rect x="8" y="8" width="28" height="28" rx="2" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0.3" fill="none" />
      <polygon points="8,32 18,20 24,26 32,16 36,32" fill="var(--color-primary)" opacity="0.15" />
      <circle cx="14" cy="16" r="3" fill="var(--color-primary)" opacity="0.25" />
    </motion.svg>
  );
}

function GalleryIconSvg({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      variants={float}
      animate="animate"
      aria-hidden="true"
    >
      <rect x="2" y="6" width="24" height="20" rx="3" fill="var(--color-primary)" opacity="0.15" />
      <rect x="14" y="14" width="24" height="20" rx="3" fill="var(--color-primary)" opacity="0.2" />
      <circle cx="10" cy="14" r="3" fill="var(--color-primary)" opacity="0.3" />
      <path d="M4 22L10 16L16 22L22 14L26 20" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0.25" fill="none" strokeLinecap="round" />
    </motion.svg>
  );
}

function SparkleSvg({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
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

function DiamondSvg({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
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

export function GalleryHero() {
  return (
    <section className="relative pt-32 pb-16 overflow-hidden">
      <CameraSvg className="absolute top-28 right-[8%] w-12 h-12 opacity-30 hidden lg:block" />
      <FrameSvg className="absolute top-40 left-[6%] w-10 h-10 opacity-35 hidden lg:block" />
      <GalleryIconSvg className="absolute bottom-16 right-[18%] w-11 h-11 opacity-25 hidden lg:block" />
      <SparkleSvg className="absolute top-36 left-[22%] w-6 h-6 opacity-40 hidden lg:block" />
      <DiamondSvg className="absolute bottom-24 left-[12%] w-8 h-8 opacity-20 hidden lg:block" />
      <FrameSvg className="absolute top-52 right-[28%] w-9 h-9 opacity-25 hidden lg:block" />

      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[var(--color-primary)]/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[var(--color-primary)]/[0.08] blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} custom={0} className="flex items-center justify-center gap-2 mb-4">
            <Images className="w-5 h-5 text-[var(--color-primary)]" />
            <span className="text-[var(--color-primary)] text-sm font-medium">
              نمونه کارهای ما
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-4xl lg:text-6xl font-bold leading-[1.3] text-[var(--color-ink)]"
          >
            گالری{" "}
            <span className="text-[var(--color-primary)]">زیبایی</span>
          </motion.h1>

          <motion.div variants={fadeUp} custom={2} className="flex justify-center mt-4">
            <LineUnder />
          </motion.div>

          <motion.p
            variants={fadeUp}
            custom={3}
            className="text-[var(--color-ink-muted)] mt-6 max-w-xl mx-auto leading-relaxed text-lg"
          >
            نمونه کارهای حرفه‌ای ما را در بخش‌های مختلف زیبایی مشاهده کنید
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
