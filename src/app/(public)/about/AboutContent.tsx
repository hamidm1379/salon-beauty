"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Layout";
import LineUnder from "@/components/home/LineUnder";
import { Sparkles, Star, Heart, Gem } from "lucide-react";
// import us1 from "../../../../public/us1.jpeg"
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
    y: [0, -8, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
  },
};

const rotate = {
  animate: {
    rotate: [0, 10, -10, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" as const },
  },
};

const pulse = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.6, 1, 0.6],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
  },
};

/* ─── SVG Accessories ─── */

function Lipstick({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 40 80"
      fill="none"
      className={className}
      variants={rotate}
      animate="animate"
      aria-hidden="true"
    >
      <rect x="12" y="30" width="16" height="45" rx="3" fill="var(--color-primary)" opacity="0.2" />
      <rect x="14" y="32" width="12" height="41" rx="2" fill="var(--color-primary)" opacity="0.35" />
      <path d="M14 32 C14 18 20 8 20 8 C20 8 26 18 26 32" fill="var(--color-primary)" opacity="0.5" />
      <rect x="10" y="72" width="20" height="5" rx="2.5" fill="var(--color-primary)" opacity="0.25" />
    </motion.svg>
  );
}

function MakeupBrush({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 24 90"
      fill="none"
      className={className}
      variants={float}
      animate="animate"
      aria-hidden="true"
    >
      <rect x="10" y="35" width="4" height="50" rx="2" fill="var(--color-primary)" opacity="0.2" />
      <rect x="11" y="36" width="2" height="48" rx="1" fill="var(--color-primary)" opacity="0.35" />
      <ellipse cx="12" cy="22" rx="8" ry="18" fill="var(--color-primary)" opacity="0.18" />
      <ellipse cx="12" cy="22" rx="5" ry="14" fill="var(--color-primary)" opacity="0.3" />
      <ellipse cx="12" cy="18" rx="3" ry="8" fill="var(--color-primary)" opacity="0.4" />
    </motion.svg>
  );
}

function NailPolish({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 36 70"
      fill="none"
      className={className}
      variants={pulse}
      animate="animate"
      aria-hidden="true"
    >
      <rect x="10" y="25" width="16" height="40" rx="5" fill="var(--color-primary)" opacity="0.2" />
      <rect x="12" y="27" width="12" height="36" rx="4" fill="var(--color-primary)" opacity="0.35" />
      <rect x="14" y="15" width="8" height="14" rx="2" fill="var(--color-primary)" opacity="0.25" />
      <rect x="16" y="8" width="4" height="10" rx="2" fill="var(--color-primary)" opacity="0.4" />
      <ellipse cx="18" cy="8" rx="6" ry="3" fill="var(--color-primary)" opacity="0.15" />
    </motion.svg>
  );
}

function Perfume({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 40 80"
      fill="none"
      className={className}
      variants={float}
      animate="animate"
      style={{ animationDelay: "1s" }}
      aria-hidden="true"
    >
      <rect x="12" y="30" width="16" height="45" rx="6" fill="var(--color-primary)" opacity="0.15" />
      <rect x="14" y="32" width="12" height="41" rx="5" fill="var(--color-primary)" opacity="0.28" />
      <rect x="17" y="20" width="6" height="14" rx="2" fill="var(--color-primary)" opacity="0.3" />
      <rect x="15" y="17" width="10" height="5" rx="2" fill="var(--color-primary)" opacity="0.25" />
      <circle cx="20" cy="12" r="3" fill="var(--color-primary)" opacity="0.35" />
    </motion.svg>
  );
}

function Mirror({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 50 80"
      fill="none"
      className={className}
      variants={rotate}
      animate="animate"
      aria-hidden="true"
    >
      <ellipse cx="25" cy="28" rx="20" ry="24" fill="var(--color-primary)" opacity="0.12" />
      <ellipse cx="25" cy="28" rx="17" ry="21" fill="var(--color-primary)" opacity="0.2" />
      <ellipse cx="25" cy="28" rx="13" ry="17" fill="white" opacity="0.15" />
      <rect x="23" y="50" width="4" height="22" rx="2" fill="var(--color-primary)" opacity="0.25" />
      <rect x="17" y="70" width="16" height="4" rx="2" fill="var(--color-primary)" opacity="0.2" />
    </motion.svg>
  );
}

function Scissors({ className }: { className?: string }) {
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

function Diamond({ className }: { className?: string }) {
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

/* ─── Values data ─── */

const values = [
  {
    icon: Sparkles,
    title: "کیفیت بی‌نظیر",
    desc: "استفاده از بهترین محصولات و تجهیزات روز دنیا برای ارائه خدمات در بالاترین سطح",
    image: "/us1.jpeg",
  },
  {
    icon: Heart,
    title: "رعایت اصول بهداشتی",
    desc: "رعایت کامل پروتکل‌های بهداشتی و استفاده از تجهیزات استریل‌شده",
    image: "/us4.jpeg",
  },
  {
    icon: Star,
    title: "تیم حرفه‌ای",
    desc: "متخصصان مجرب و آموزش‌دیده که با عشق و علاقه کار می‌کنند",
    image: "/us3.jpeg",
  },
  {
    icon: Gem,
    title: "تجربه منحصربه‌فرد",
    desc: "محیطی آرام و لوکس برای تجربه‌ای متفاوت از زیبایی",
    image: "/us2.jpeg",
  },
];

/* ─── Main Component ─── */

export function AboutContent() {
  return (
    <div className="relative overflow-hidden">
      {/* ── Hero Section ── */}
      <section className="relative pt-32 pb-20">
        {/* Floating accessories */}
        <Lipstick className="absolute top-24 right-[8%] w-10 h-20 opacity-40 hidden lg:block" />
        <MakeupBrush className="absolute top-40 left-[6%] w-6 h-24 opacity-35 hidden lg:block" />
        <NailPolish className="absolute bottom-20 right-[15%] w-8 h-16 opacity-30 hidden lg:block" />
        <Perfume className="absolute top-32 left-[20%] w-9 h-18 opacity-30 hidden lg:block" />
        <Mirror className="absolute bottom-10 left-[10%] w-11 h-18 opacity-25 hidden lg:block" />
        <Scissors className="absolute top-60 right-[25%] w-11 h-14 opacity-25 hidden lg:block" />
        <Diamond className="absolute bottom-32 right-[5%] w-9 h-9 opacity-30 hidden lg:block" />

        {/* Background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[var(--color-primary)]/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[var(--color-primary)]/8 blur-3xl" />

        <Container className="relative">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial="hidden"
            animate="visible"
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="text-[var(--color-primary)] text-sm font-medium"
            >
              آشنایی با ما
            </motion.span>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl lg:text-6xl font-bold mt-4 leading-[1.3] text-[var(--color-ink)]"
            >
              زیبایی را با ما
              <span className="text-[var(--color-primary)]"> تجربه کنید</span>
            </motion.h1>
            <motion.div variants={fadeUp} custom={2} className="flex justify-center mt-4">
              <LineUnder />
            </motion.div>
            <motion.p
              variants={fadeUp}
              custom={3}
              className="text-[var(--color-ink-muted)] mt-6 max-w-xl mx-auto leading-relaxed text-lg"
            >
              سالن زیبایی ما با بیش از یک دهه تجربه، جایی‌ست که هنر و زیبایی
              در کنار هم می‌درخشند
            </motion.p>
          </motion.div>
        </Container>
      </section>

      {/* ── Story Section ── */}
      <section className="py-20 relative">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Decorative card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 rounded-3xl p-10 border border-[var(--color-primary)]/10">
                {/* Floating makeup icons inside card */}
                <Lipstick className="absolute -top-4 -right-2 w-8 h-16 opacity-50" />
                <NailPolish className="absolute -bottom-3 -left-2 w-7 h-14 opacity-45" />
                <Diamond className="absolute top-1/2 -right-4 w-8 h-8 opacity-40" />

                <div className="space-y-6 text-[var(--color-ink-muted)] leading-relaxed relative z-10">
                  <p>
                    سالن زیبایی ما در سال ۱۳۹۳ با هدف ارائه خدمات تخصصی زیبایی
                    تاسیس شد. ما از همان ابتدا باور داشتیم که زیبایی حق هر
                    انسانی است و هر فردی شایسته بهترین خدمات است.
                  </p>
                  <p>
                    تیم ما متشکل از متخصصان مجرب و آموزش‌دیده در زمینه‌های
                    مختلف زیبایی از جمله مراقبت از پوست، مو، ناخن و میکاپ
                    است. ما با استفاده از جدیدترین تکنیک‌ها و محصولات باکیفیت،
                    زیبایی طبیعی شما را نمایان می‌کنیم.
                  </p>
                  <p>
                    رضایت مشتریان اولویت اصلی ماست و همواره تلاش
                    می‌کنیم تا تجربه‌ای خاص و لذت‌بخش را برای شما رقم بزنیم.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Text side */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <span className="text-[var(--color-primary)] text-sm font-medium">
                داستان ما
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold mt-3 text-[var(--color-ink)] leading-snug">
                از یک رویا تا سالنی
                <span className="text-[var(--color-primary)]"> متفاوت</span>
              </h2>
              <div className="mt-4">
                <LineUnder />
              </div>
              <p className="text-[var(--color-ink-muted)] mt-6 leading-relaxed">
                ما باور داریم که زیبایی فقط ظاهر نیست، بلکه حسی‌ست که از درون
                می‌آید. وقتی احساس خوبی نسبت به خودتان دارید، درخشش شما
                غیرقابل انکار خواهد بود.
              </p>
              <p className="text-[var(--color-ink-muted)] mt-4 leading-relaxed">
                در سالن زیبایی ما، هر جزئیات با دقت و عشق طراحی شده تا
                شما تجربه‌ای بی‌نظیر از زیبایی داشته باشید.
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── Values Section ── */}
      <section className="py-20 bg-[var(--color-bg-soft)] relative">
        {/* Background accessories */}
        <MakeupBrush className="absolute top-10 right-[5%] w-6 h-20 opacity-20 hidden lg:block" />
        <Perfume className="absolute bottom-10 left-[8%] w-8 h-16 opacity-20 hidden lg:block" />

        <Container className="relative">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[var(--color-primary)] text-sm font-medium">
              ارزش‌های ما
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 text-[var(--color-ink)]">
              چه چیزی ما را متفاوت می‌کند
            </h2>
            <div className="flex justify-center mt-3">
              <LineUnder />
            </div>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 lg:gap-8">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  custom={i}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="bg-background rounded-2xl lg:rounded-3xl p-3 lg:p-8 border border-(--color-ink)/5 shadow-[0_8px_30px_-12px_rgba(124,58,237,0.08)] text-center"
                >
                  {v.image ? (
                    <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-xl lg:rounded-2xl overflow-hidden mx-auto mb-1 lg:mb-5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={v.image}
                        alt={v.title}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-xl lg:rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-3 lg:mb-5">
                      <Icon className="w-7 h-7 lg:w-10 lg:h-10 text-[var(--color-primary)]" />
                    </div>
                  )}
                  <h3 className="font-semibold text-sm lg:text-lg text-foreground leading-snug">
                    {v.title}
                  </h3>
                  <p className="text-[10px] lg:text-sm text-ink-muted mt-0.5 lg:mt-3 leading-relaxed">
                    {v.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── CTA Section ── */}
      {/* <section className="py-20 relative">
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-soft)] rounded-3xl p-12 text-center text-white overflow-hidden"
          >
            
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <Lipstick className="absolute top-6 right-12 w-6 h-12 opacity-20 hidden sm:block" />
            <NailPolish className="absolute bottom-6 left-12 w-5 h-10 opacity-20 hidden sm:block" />

            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                آماده‌اید زیبایی را تجربه کنید؟
              </h2>
              <p className="text-white/80 max-w-lg mx-auto mb-8">
                همین الان نوبت خود را رزرو کنید و تجربه‌ای متفاوت از زیبایی
                داشته باشید
              </p>
              <Link
                href="/appointment"
                className="inline-flex items-center gap-2 rounded-full bg-white text-[var(--color-primary)] px-8 py-3.5 font-semibold hover:scale-105 transition-transform"
              >
                رزرو نوبت
              </Link>
            </div>
          </motion.div>
        </Container>
      </section> */}
    </div>
  );
}
