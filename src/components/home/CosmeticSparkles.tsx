// components/home/CosmeticSparkles.tsx
"use client";

import { motion } from "framer-motion";
import { SprayCan, Palette, Brush, Gem, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SparkleConfig = {
  icon: LucideIcon;
  x: number;
  y: number;
  size: number;
  color: string;
  twinkleDuration: number;
  floatDuration: number;
  delay: number;
};

const items: SparkleConfig[] = [
  { icon: SprayCan, x: 90, y: 60, size: 22, color: "var(--color-primary)", twinkleDuration: 2.2, floatDuration: 6, delay: 0 },
  { icon: Palette, x: 150, y: 110, size: 18, color: "var(--color-primary)", twinkleDuration: 2.6, floatDuration: 7, delay: 0.6 },
  { icon: Brush, x: 55, y: 150, size: 16, color: "var(--color-gold-accent, var(--color-primary))", twinkleDuration: 2, floatDuration: 5.5, delay: 1.2 },
  { icon: Gem, x: 190, y: 70, size: 15, color: "var(--color-primary)", twinkleDuration: 2.4, floatDuration: 6.5, delay: 1.8 },
  { icon: Heart, x: 40, y: 90, size: 14, color: "var(--color-primary)", twinkleDuration: 2.1, floatDuration: 5, delay: 2.4 },
];

function SparkleItem({ icon: Icon, x, y, size, color, twinkleDuration, floatDuration, delay }: SparkleConfig) {
  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y }}
      initial={{ opacity: 0 }}
      animate={{
        x: [0, 12, -8, 6, 0],
        y: [0, -10, 8, -6, 0],
      }}
      transition={{ duration: floatDuration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        animate={{ opacity: [0.15, 1, 0.15], scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: twinkleDuration, delay, repeat: Infinity, ease: "easeInOut" }}
      >
        <Icon style={{ width: size, height: size, color }} />
      </motion.div>
    </motion.div>
  );
}

export function CosmeticSparkles() {
  return (
    <div className="pointer-events-none absolute top-0 left-0 w-60 h-60 lg:w-75 lg:h-75" aria-hidden="true">
      {items.map((it, i) => (
        <SparkleItem key={i} {...it} />
      ))}
    </div>
  );
}