"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import ser1 from "../../../public/ser1.jpeg";
import ser2 from "../../../public/ser2.jpeg";
import ser3 from "../../../public/ser3.jpeg";
import ser4 from "../../../public/ser4.jpeg";
import ser5 from "../../../public/ser5.jpeg";
import LineUnder from "./LineUnder";

interface Service {
  image: typeof ser1;
  title: string;
  desc: string;
  accent: string;
}

const services: Service[] = [
  {
    image: ser1,
    title: "پوست و زیبایی",
    desc: "پاکسازی، فیشیال و جوان‌سازی پوست با بهترین متدها",
    accent: "from-rose-400/20 to-pink-500/20",
  },
  {
    image: ser2,
    title: "خدمات ناخن",
    desc: "مانیکور، پدیکور، طراحی و کاشت ناخن حرفه‌ای",
    accent: "from-purple-400/20 to-violet-500/20",
  },
  {
    image: ser3,
    title: "خدمات مو",
    desc: "رنگ، مش، کراتین و کوتاهی با جدیدترین تکنیک‌ها",
    accent: "from-amber-400/20 to-orange-500/20",
  },
  {
    image: ser4,
    title: "ابرو و مژه",
    desc: "طراحی، ابرو، میکروبلیدینگ، لیفت و لمینت تخصصی",
    accent: "from-emerald-400/20 to-teal-500/20",
  },
  {
    image: ser5,
    title: "میکاپ حرفه‌ای",
    desc: "میکاپ روز، شب و عروس با بهترین مواد آرایشی",
    accent: "from-[var(--color-gold-accent)]/20 to-amber-500/20",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

export function ServicesGrid() {
  return (
    <section className="py-24 bg-[var(--color-bg-soft)] relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[var(--color-primary)]/[0.03] blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[var(--color-gold-accent)]/[0.02] blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold text-[var(--color-ink)]">
            خدمات{" "}
            <span className="bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-gold-accent)] bg-clip-text text-transparent">
              تخصصی
            </span>{" "}
            ما
          </h2>
          <p className="text-[var(--color-ink-muted)] mt-4 max-w-lg mx-auto mb-4">
            مجموعه‌ای کامل از خدمات زیبایی با بالاترین کیفیت و استانداردهای بین‌المللی
          </p>
          <div className="flex justify-center">
            <LineUnder />
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              custom={i}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative bg-[var(--color-bg)] rounded-2xl overflow-hidden shadow-[0_4px_20px_-8px_rgba(124,58,237,0.08)] hover:shadow-[0_20px_40px_-12px_rgba(124,58,237,0.15)] transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.title}
                  width={300}
                  height={300}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${s.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-primary)] transition-colors">
                  {s.title}
                </h3>
                <p className="text-xs text-[var(--color-ink-muted)] mt-2 leading-relaxed line-clamp-2">
                  {s.desc}
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1 text-[var(--color-primary)] text-xs font-medium mt-3 group/link"
                >
                  <span className="group-hover/link:gap-2 transition-all">مشاهده</span>
                  <ArrowLeft className="w-3 h-3 group-hover/link:-translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Gold accent line on hover */}
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-l from-[var(--color-gold-accent)] to-[var(--color-primary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
