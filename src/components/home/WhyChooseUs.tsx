"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import why1 from "../../../public/why1.jpeg";
import why2 from "../../../public/why2.jpeg";
import why3 from "../../../public/why3.jpeg";
import why4 from "../../../public/why4.jpeg";
import LineUnder from "./LineUnder";

interface Reason {
  image: typeof why1;
  title: string;
  desc: string;
  number: string;
}

const reasons: Reason[] = [
  {
    image: why1,
    title: "کیفیت بالا",
    desc: "استفاده از بهترین محصولات و تجهیزات روز دنیا",
    number: "۰۱",
  },
  {
    image: why2,
    title: "تضمین رضایت",
    desc: "رضایت ۱۰۰٪ مشتریان ما اولویت اصلی ماست",
    number: "۰۲",
  },
  {
    image: why3,
    title: "تیم متخصص",
    desc: "متخصصین مجرب و آموزش دیده در تمامی خدمات",
    number: "۰۳",
  },
  {
    image: why4,
    title: "محصولات با کیفیت",
    desc: "استفاده از برند های معتبر و با کیفیت",
    number: "۰۴",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.12,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

export function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-24 bg-[var(--color-bg)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-[var(--color-ink)] mb-4">
            چرا{" "}
            <span className="bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-gold-accent)] bg-clip-text text-transparent">
              ما
            </span>{" "}
            را انتخاب می‌کنند
          </h2>
          <div className="flex justify-center">
            <LineUnder />
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              custom={i}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group relative text-center p-5 sm:p-8 rounded-2xl bg-[var(--color-bg-soft)] border border-[var(--color-ink)]/5 hover:border-[var(--color-gold-accent)]/20 transition-all duration-300"
            >
            

              {/* Image */}
              <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto rounded-xl overflow-hidden mb-3 sm:mb-5 ring-2 ring-[var(--color-primary)]/10 group-hover:ring-[var(--color-gold-accent)]/30 transition-all duration-300">
                <Image
                  src={r.image}
                  alt={r.title}
                  width={80}
                  height={80}
                  sizes="(max-width: 640px) 56px, 80px"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <h3 className="font-semibold text-base sm:text-lg text-[var(--color-ink)] group-hover:text-[var(--color-primary)] transition-colors">
                {r.title}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--color-ink-muted)] mt-2 sm:mt-3 leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
