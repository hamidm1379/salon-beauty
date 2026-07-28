"use client";

import { motion } from "framer-motion";
import LineUnder from "@/components/home/LineUnder";
import { BookOpen } from "lucide-react";

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

function QuillSvg() {
  return (
    <motion.svg
      viewBox="0 0 40 60"
      fill="none"
      className="w-10 h-16"
      variants={rotate}
      animate="animate"
      aria-hidden="true"
    >
      <path
        d="M20 4C20 4 8 18 8 32C8 42 13 52 20 56C27 52 32 42 32 32C32 18 20 4 20 4Z"
        fill="var(--color-primary)"
        opacity="0.12"
      />
      <path
        d="M20 8C20 8 12 20 12 30C12 38 15 46 20 50C25 46 28 38 28 30C28 20 20 8 20 8Z"
        fill="var(--color-primary)"
        opacity="0.2"
      />
      <line x1="20" y1="4" x2="20" y2="56" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0.3" />
    </motion.svg>
  );
}

function BookSvg() {
  return (
    <motion.svg
      viewBox="0 0 50 40"
      fill="none"
      className="w-12 h-10"
      variants={float}
      animate="animate"
      aria-hidden="true"
    >
      <rect x="4" y="6" width="18" height="28" rx="2" fill="var(--color-primary)" opacity="0.15" />
      <rect x="6" y="8" width="14" height="24" rx="1" fill="var(--color-primary)" opacity="0.25" />
      <rect x="28" y="6" width="18" height="28" rx="2" fill="var(--color-primary)" opacity="0.15" />
      <rect x="30" y="8" width="14" height="24" rx="1" fill="var(--color-primary)" opacity="0.25" />
      <line x1="25" y1="4" x2="25" y2="36" stroke="var(--color-primary)" strokeWidth="2" opacity="0.2" />
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

export function BlogHero() {
  return (
    <section className="relative pt-32 pb-16 overflow-hidden">
      <motion.div className="absolute top-28 right-[8%] opacity-30 hidden lg:block" variants={rotate} animate="animate">
        <QuillSvg />
      </motion.div>
      <motion.div className="absolute top-36 left-[7%] opacity-25 hidden lg:block" variants={float} animate="animate">
        <BookSvg />
      </motion.div>
      <motion.div className="absolute bottom-20 right-[16%] opacity-30 hidden lg:block" variants={pulse} animate="animate">
        <DiamondSvg />
      </motion.div>
      <motion.div className="absolute top-44 left-[24%] opacity-35 hidden lg:block" variants={pulse} animate="animate">
        <SparkleSvg />
      </motion.div>
      <motion.div className="absolute bottom-16 left-[10%] opacity-20 hidden lg:block" variants={float} animate="animate">
        <StarSvg />
      </motion.div>
      <motion.div className="absolute top-52 right-[30%] opacity-20 hidden lg:block" variants={rotate} animate="animate">
        <QuillSvg />
      </motion.div>

      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[var(--color-primary)]/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[var(--color-primary)]/[0.08] blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} custom={0} className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-[var(--color-primary)]" />
            <span className="text-[var(--color-primary)] text-sm font-medium">
              مجله زیبایی
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-4xl lg:text-6xl font-bold leading-[1.3] text-[var(--color-ink)]"
          >
            خواندنی‌های{" "}
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
            مقالات و نکات مفید درباره زیبایی، مراقبت از پوست و مو، و آخرین
            ترندهای دنیای آرایش
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
