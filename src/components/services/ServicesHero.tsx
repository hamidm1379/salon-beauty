"use client";

import { motion } from "framer-motion";
import LineUnder from "@/components/home/LineUnder";
import { Sparkles } from "lucide-react";

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

function ScissorsSvg({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 50 60"
      fill="none"
      className={className}
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

function StarSvg({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
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

function NailPolishSvg({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 36 70"
      fill="none"
      className={className}
      variants={float}
      animate="animate"
      aria-hidden="true"
    >
      <rect x="10" y="25" width="16" height="40" rx="5" fill="var(--color-primary)" opacity="0.2" />
      <rect x="12" y="27" width="12" height="36" rx="4" fill="var(--color-primary)" opacity="0.35" />
      <rect x="14" y="15" width="8" height="14" rx="2" fill="var(--color-primary)" opacity="0.25" />
      <rect x="16" y="8" width="4" height="10" rx="2" fill="var(--color-primary)" opacity="0.4" />
    </motion.svg>
  );
}

export function ServicesHero() {
  return (
    <section className="relative pt-32 pb-16 overflow-hidden">
      <ScissorsSvg className="absolute top-28 right-[8%] w-11 h-14 opacity-30 hidden lg:block" />
      <DiamondSvg className="absolute top-40 left-[6%] w-9 h-9 opacity-35 hidden lg:block" />
      <StarSvg className="absolute bottom-16 right-[18%] w-10 h-10 opacity-25 hidden lg:block" />
      <SparkleSvg className="absolute top-36 left-[22%] w-6 h-6 opacity-40 hidden lg:block" />
      <NailPolishSvg className="absolute bottom-24 left-[12%] w-8 h-16 opacity-20 hidden lg:block" />
      <DiamondSvg className="absolute top-52 right-[28%] w-7 h-7 opacity-25 hidden lg:block" />

      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[var(--color-primary)]/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[var(--color-primary)]/[0.08] blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} custom={0} className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
            <span className="text-[var(--color-primary)] text-sm font-medium">
              خدمات تخصصی ما
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-4xl lg:text-6xl font-bold leading-[1.3] text-[var(--color-ink)]"
          >
            زیبایی خود را به ما{" "}
            <span className="text-[var(--color-primary)]">بسپارید</span>
          </motion.h1>

          <motion.div variants={fadeUp} custom={2} className="flex justify-center mt-4">
            <LineUnder />
          </motion.div>

          <motion.p
            variants={fadeUp}
            custom={3}
            className="text-[var(--color-ink-muted)] mt-6 max-w-xl mx-auto leading-relaxed text-lg"
          >
            با بهترین متدهای روز دنیا و محصولات باکیفیت، زیبایی طبیعی خود را
            نمایان کنید
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
