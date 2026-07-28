// components/home/Butterflies.tsx
"use client";

import { motion } from "framer-motion";

type ButterflyConfig = {
  x: number;
  y: number;
  scale: number;
  color: string;
  flapDuration: number;
  floatDuration: number;
  delay: number;
};

const butterflies: ButterflyConfig[] = [
  { x: 90, y: 70, scale: 1, color: "var(--color-primary)", flapDuration: 0.5, floatDuration: 6, delay: 0 },
  { x: 150, y: 40, scale: 0.7, color: "var(--color-primary)", flapDuration: 0.4, floatDuration: 7, delay: 0.8 },
  { x: 60, y: 130, scale: 0.55, color: "var(--color-gold-accent, var(--color-primary))", flapDuration: 0.45, floatDuration: 5.5, delay: 1.6 },
  { x: 200, y: 100, scale: 0.6, color: "var(--color-primary)", flapDuration: 0.55, floatDuration: 6.5, delay: 2.2 },
  { x: 40, y: 200, scale: 0.4, color: "var(--color-primary)", flapDuration: 0.4, floatDuration: 5, delay: 3 },
];

function Butterfly({ x, y, scale, color, flapDuration, floatDuration, delay }: ButterflyConfig) {
  return (
    <motion.g
      initial={{ x, y, opacity: 0 }}
      animate={{
        x: [x, x + 18, x - 10, x + 8, x],
        y: [y, y - 14, y + 10, y - 6, y],
        opacity: [0, 1, 1, 1, 1],
      }}
      transition={{
        duration: floatDuration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <g transform={`scale(${scale})`}>
        {/* بدن */}
        <ellipse cx="0" cy="0" rx="1.2" ry="9" fill={color} opacity="0.85" />

        {/* بال چپ بالا */}
        <motion.path
          d="M-1,-5 C -14,-16 -22,-8 -20,2 C -14,4 -6,0 -1,-3 Z"
          fill={color}
          fillOpacity="0.55"
          style={{ transformOrigin: "-1px -5px" }}
          animate={{ scaleX: [1, 0.35, 1] }}
          transition={{ duration: flapDuration, repeat: Infinity, ease: "easeInOut", delay }}
        />
        {/* بال چپ پایین */}
        <motion.path
          d="M-1,1 C -12,6 -16,14 -9,18 C -4,15 -1,7 -1,2 Z"
          fill={color}
          fillOpacity="0.4"
          style={{ transformOrigin: "-1px 1px" }}
          animate={{ scaleX: [1, 0.35, 1] }}
          transition={{ duration: flapDuration, repeat: Infinity, ease: "easeInOut", delay }}
        />
        {/* بال راست بالا */}
        <motion.path
          d="M1,-5 C 14,-16 22,-8 20,2 C 14,4 6,0 1,-3 Z"
          fill={color}
          fillOpacity="0.55"
          style={{ transformOrigin: "1px -5px" }}
          animate={{ scaleX: [1, 0.35, 1] }}
          transition={{ duration: flapDuration, repeat: Infinity, ease: "easeInOut", delay }}
        />
        {/* بال راست پایین */}
        <motion.path
          d="M1,1 C 12,6 16,14 9,18 C 4,15 1,7 1,2 Z"
          fill={color}
          fillOpacity="0.4"
          style={{ transformOrigin: "1px 1px" }}
          animate={{ scaleX: [1, 0.35, 1] }}
          transition={{ duration: flapDuration, repeat: Infinity, ease: "easeInOut", delay }}
        />

        {/* شاخک‌ها */}
        <path d="M-1,-9 C -3,-13 -5,-14 -6,-16" stroke={color} strokeWidth="0.5" opacity="0.6" fill="none" />
        <path d="M1,-9 C 3,-13 5,-14 6,-16" stroke={color} strokeWidth="0.5" opacity="0.6" fill="none" />
      </g>
    </motion.g>
  );
}

export function Butterflies() {
  return (
    <svg
      className="pointer-events-none absolute top-0 left-0 w-[280px] h-[280px] lg:w-[340px] lg:h-[340px]"
      viewBox="0 0 280 280"
      fill="none"
      aria-hidden="true"
    >
      {butterflies.map((b, i) => (
        <Butterfly key={i} {...b} />
      ))}
    </svg>
  );
}