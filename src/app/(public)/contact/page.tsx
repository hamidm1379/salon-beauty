"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Scissors,
  ArrowLeft,
  Sparkles,
  Heart,
  Star,
  Droplets,
  PhoneCall,
  Sun,
} from "lucide-react";
import { Container } from "@/components/ui/Layout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useCreateContactMessage } from "@/hooks/use-contact";
import { useSettings } from "@/hooks/use-settings";

const LeafletMap = dynamic(() => import("@/components/map/LeafletMap").then((m) => m.LeafletMap), {
  ssr: false,
});

const contactSchema = z.object({
  name: z.string().min(2, "نام حداقل ۲ کاراکتر باشد"),
  email: z.string().email("ایمیل نامعتبر است"),
  phone: z.string().min(10, "شماره تلفن نامعتبر است").optional(),
  subject: z.string().max(200, "حداکثر ۲۰۰ کاراکتر").optional(),
  message: z.string().min(10, "پیام حداقل ۱۰ کاراکتر باشد").max(2000, "حداکثر ۲۰۰۰ کاراکتر"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const floatingIcons = [
  { Icon: Scissors, delay: 0, x: "10%", y: "20%", size: 28, duration: 7 },
  { Icon: Sparkles, delay: 1.5, x: "85%", y: "15%", size: 24, duration: 8 },
  { Icon: Heart, delay: 0.8, x: "25%", y: "70%", size: 22, duration: 6 },
  { Icon: Star, delay: 2, x: "75%", y: "65%", size: 20, duration: 9 },
  { Icon: Droplets, delay: 1, x: "50%", y: "10%", size: 26, duration: 7.5 },
  { Icon: Sun, delay: 0.5, x: "15%", y: "50%", size: 18, duration: 8.5 },
  { Icon: Scissors, delay: 2.5, x: "90%", y: "45%", size: 20, duration: 6.5 },
  { Icon: Sparkles, delay: 1.8, x: "40%", y: "80%", size: 22, duration: 7.2 },
];

const accentColors = [
  "from-violet-500 to-purple-600",
  "from-fuchsia-500 to-pink-500",
  "from-purple-500 to-indigo-500",
  "from-amber-400 to-orange-500",
];

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const createMessage = useCreateContactMessage();
  const { data: settings } = useSettings();

  const formSectionRef = useRef<HTMLDivElement>(null);
  const infoSectionRef = useRef<HTMLDivElement>(null);
  const mapSectionRef = useRef<HTMLDivElement>(null);

  const formInView = useInView(formSectionRef, { once: true, margin: "-80px" });
  const infoInView = useInView(infoSectionRef, { once: true, margin: "-80px" });
  const mapInView = useInView(mapSectionRef, { once: true, margin: "-80px" });

  const contactInfo = [
    {
      icon: Phone,
      title: "تلفن",
      value: settings?.salonPhone ?? "۰۲۱-۱۲۳۴۵۶۷۸",
      href: `tel:${settings?.salonPhone?.replace(/[^0-9+]/g, "") ?? "+02112345678"}`,
      accent: accentColors[0],
    },
    {
      icon: Mail,
      title: "ایمیل",
      value: settings?.salonEmail ?? "info@beautysalon.com",
      href: `mailto:${settings?.salonEmail ?? "info@beautysalon.com"}`,
      accent: accentColors[1],
    },
    {
      icon: MapPin,
      title: "آدرس",
      value: settings?.salonAddress ?? "تهران، خیابان ولیعصر، پلاک ۱۲۳",
      href: "#map",
      accent: accentColors[2],
    },
    {
      icon: Clock,
      title: "ساعات کاری",
      value: settings?.workingHours ?? "شنبه تا پنجشنبه ۹ الی ۲۱",
      href: null,
      accent: accentColors[3],
    },
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    createMessage.mutate(data, {
      onSuccess: () => {
        setIsSubmitted(true);
        reset();
        setTimeout(() => setIsSubmitted(false), 5000);
      },
    });
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-bg-soft py-20 lg:py-28">
        {/* Floating animated beauty icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingIcons.map((item, i) => (
            <motion.div
              key={i}
              style={{ left: item.x, top: item.y, position: "absolute" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.15, 0.08, 0.15, 0],
                scale: [0.5, 1, 0.9, 1, 0.5],
                y: [0, -30, 10, -20, 0],
                x: [0, 15, -10, 5, 0],
                rotate: [0, 20, -15, 10, 0],
              }}
              transition={{
                duration: item.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: item.delay,
              }}
              className="text-primary"
            >
              <item.Icon size={item.size} strokeWidth={1.5} />
            </motion.div>
          ))}

          {/* Background glow blobs */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.07, 0.04] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.1, 0.06] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary blur-3xl"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full border border-dashed border-primary/10"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 rounded-full border border-primary/8"
          />
        </div>

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
            >
              <motion.div
                animate={{ rotate: [0, -15, 15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <PhoneCall className="w-4 h-4" />
              </motion.div>
              <span>ارتباط با ما</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-4xl lg:text-6xl font-bold text-foreground mb-6"
            >
              ما اینجاییم{" "}
              <span className="relative inline-block">
                <span className="bg-linear-to-l from-primary to-primary-soft bg-clip-text text-transparent">
                  برای شما
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
                  className="absolute -bottom-2 right-0 w-full h-0.75 rounded-full bg-linear-to-l from-primary to-primary-soft origin-right"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-ink-muted leading-relaxed max-w-xl mx-auto"
            >
              سوالی دارید؟ می‌خواهید وقت رزرو کنید؟ یا فقط می‌خواهید با ما صحبت کنید؟ ما منتظر شنیدن
              صدای شما هستیم.
            </motion.p>

            {/* Animated scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-12 flex flex-col items-center gap-2"
            >
              <span className="text-xs text-ink-muted">پایین اسکرول کنید</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-6 h-10 rounded-full border-2 border-primary/30 flex justify-center pt-2"
              >
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                />
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <Container className="py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Form - Left Side (takes 2 cols) */}
          <div ref={formSectionRef} className="lg:col-span-2 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="sticky top-28"
            >
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={formInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-2xl font-bold text-foreground mb-2"
              >
                پیام بفرستید
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={formInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-ink-muted mb-8"
              >
                فرم زیر را پر کنید، در سریع‌ترین زمان پاسخ خواهیم داد.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={formInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="border-0 shadow-[0_8px_40px_-12px_rgba(124,58,237,0.12)]">
                  <CardContent className="p-6 lg:p-8">
                    {isSubmitted ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          type: "spring",
                          bounce: 0.5,
                          duration: 0.6,
                        }}
                        className="text-center py-12"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            bounce: 0.6,
                            delay: 0.1,
                          }}
                          className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6"
                        >
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                              type: "spring",
                              bounce: 0.6,
                              delay: 0.3,
                            }}
                          >
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                          </motion.div>
                        </motion.div>
                        <h3 className="text-xl font-bold text-foreground mb-2">
                          پیام شما ارسال شد!
                        </h3>
                        <p className="text-ink-muted">به زودی با شما تماس خواهیم گرفت.</p>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {[
                          {
                            key: "name",
                            node: (
                              <Input
                                label="نام کامل"
                                placeholder="نام و نام خانوادگی"
                                error={errors.name?.message}
                                {...register("name")}
                              />
                            ),
                          },
                          {
                            key: "email",
                            node: (
                              <Input
                                label="ایمیل"
                                type="email"
                                placeholder="example@email.com"
                                error={errors.email?.message}
                                {...register("email")}
                              />
                            ),
                          },
                          {
                            key: "phone-subject",
                            node: (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <Input
                                  label="شماره تلفن"
                                  type="tel"
                                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                                  error={errors.phone?.message}
                                  {...register("phone")}
                                />
                                <Input
                                  label="موضوع"
                                  placeholder="موضوع پیام"
                                  error={errors.subject?.message}
                                  {...register("subject")}
                                />
                              </div>
                            ),
                          },
                          {
                            key: "message",
                            node: (
                              <Textarea
                                label="پیام شما"
                                placeholder="پیام خود را اینجا بنویسید..."
                                rows={5}
                                error={errors.message?.message}
                                {...register("message")}
                              />
                            ),
                          },
                        ].map((field, i) => (
                          <motion.div
                            key={field.key}
                            initial={{ opacity: 0, y: 15 }}
                            animate={formInView ? { opacity: 1, y: 0 } : {}}
                            transition={{
                              duration: 0.4,
                              delay: 0.4 + i * 0.1,
                            }}
                          >
                            {field.node}
                          </motion.div>
                        ))}
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={formInView ? { opacity: 1, y: 0 } : {}}
                          transition={{ duration: 0.4, delay: 0.8 }}
                        >
                          <Button
                            type="submit"
                            isLoading={createMessage.isPending}
                            className="w-full group"
                          >
                            <span className="flex items-center gap-2">
                              ارسال پیام
                              <motion.span
                                animate={{ x: [0, -3, 0] }}
                                transition={{
                                  duration: 1.2,
                                  repeat: Infinity,
                                  repeatDelay: 2,
                                }}
                              >
                                <ArrowLeft className="w-4 h-4" />
                              </motion.span>
                            </span>
                          </Button>
                        </motion.div>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>

          {/* Info + Map - Right Side (takes 3 cols) */}
          <div ref={infoSectionRef} className="lg:col-span-3 order-1 lg:order-2 space-y-8">
            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((info, i) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={infoInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {info.href ? (
                    <a href={info.href} className="block h-full">
                      <InfoCard info={info} index={i} inView={infoInView} />
                    </a>
                  ) : (
                    <InfoCard info={info} index={i} inView={infoInView} />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Map */}
            <div ref={mapSectionRef}>
              <motion.div
                id="map"
                initial={{ opacity: 0, y: 40, scale: 0.97 }}
                animate={mapInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{
                  duration: 0.7,
                  delay: 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <Card className="overflow-hidden border-0 shadow-[0_8px_40px_-12px_rgba(124,58,237,0.12)]">
                  <div className="aspect-[4/3] sm:aspect-video w-full relative">
                    <LeafletMap
                      lat={35.6892}
                      lng={51.389}
                      zoom={16}
                      title="salon location"
                      className="w-full h-full"
                    />
                    <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-white/60 to-transparent pointer-events-none z-[400]" />
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={mapInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="p-4 bg-[var(--color-bg-soft)] flex items-center gap-3"
                  >
                    <motion.div
                      animate={mapInView ? { scale: [0, 1.2, 1] } : {}}
                      transition={{ duration: 0.5, delay: 0.8 }}
                      className="relative"
                    >
                      <motion.div
                        animate={{
                          boxShadow: [
                            "0 0 0 0px rgba(124,58,237,0)",
                            "0 0 0 5px rgba(124,58,237,0.3)",
                            "0 0 0 0px rgba(124,58,237,0)",
                          ],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1.2,
                        }}
                        className="absolute inset-0 rounded-xl"
                      />
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                        <motion.div
                          animate={{ opacity: [1, 0.25, 1] }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1.2,
                          }}
                        >
                          <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                        </motion.div>
                      </div>
                    </motion.div>
                    <div>
                      <p className="font-medium text-[var(--color-ink)] text-sm">
                        {settings?.salonAddress ?? "تهران، خیابان ولیعصر، پلاک ۱۲۳"}
                      </p>
                      <p className="text-xs text-[var(--color-ink-muted)]">
                        نزدیک ایستگاه مترو ولیعصر
                      </p>
                    </div>
                  </motion.div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

function InfoCard({
  info,
  index,
  inView,
}: {
  info: {
    icon: typeof Phone;
    title: string;
    value: string;
    accent: string;
  };
  index: number;
  inView: boolean;
}) {
  return (
    <Card className="h-full group hover:shadow-[0_8px_30px_-8px_rgba(124,58,237,0.15)] transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-5 flex items-start gap-4">
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={inView ? { scale: 1, rotate: 0 } : {}}
          transition={{
            type: "spring",
            bounce: 0.5,
            delay: 0.3 + index * 0.1,
          }}
          className="relative"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 0 0px rgba(124,58,237,0)",
                "0 0 0 6px rgba(124,58,237,0.25)",
                "0 0 0 0px rgba(124,58,237,0)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.5,
            }}
            className="absolute inset-0 rounded-2xl"
          />
          <div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${info.accent} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.5,
              }}
            >
              <info.icon className="w-5 h-5 text-white" />
            </motion.div>
          </div>
        </motion.div>
        <div className="min-w-0">
          <motion.p
            initial={{ opacity: 0, x: 10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            className="text-xs text-[var(--color-ink-muted)] uppercase tracking-wider mb-1"
          >
            {info.title}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: 10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
            className="font-semibold text-[var(--color-ink)] text-sm truncate"
          >
            {info.value}
          </motion.p>
        </div>
      </CardContent>
    </Card>
  );
}
