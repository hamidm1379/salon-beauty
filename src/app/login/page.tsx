"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles, Loader2, Mail, Lock, User, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { LeafPattern } from "@/components/home/LeafPattern";
import { CosmeticSparkles } from "@/components/home/CosmeticSparkles";

const loginSchema = z.object({
  email: z.string().email("آدرس ایمیل نامعتبر است"),
  password: z.string().min(1, "رمز عبور الزامی است"),
});

const registerSchema = z.object({
  name: z.string().min(2, "نام حداقل ۲ کاراکتر باشد"),
  email: z.string().email("آدرس ایمیل نامعتبر است"),
  phone: z.string().min(10, "شماره تلفن نامعتبر است"),
  password: z.string().min(6, "رمز عبور حداقل ۶ کاراکتر باشد"),
});

type LoginInput = z.infer<typeof loginSchema>;
type RegisterInput = z.infer<typeof registerSchema>;

function FormField({
  id,
  label,
  icon: Icon,
  error,
  ...props
}: {
  id: string;
  label: string;
  icon: React.ElementType;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[var(--color-ink)] mb-2">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-ink-muted)]" />
        <input
          id={id}
          {...props}
          className="w-full pr-11 pl-4 py-3 rounded-xl border border-[var(--color-ink)]/10 bg-white/70 backdrop-blur-sm text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default function CustomerLoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onLogin = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      await axiosInstance.post("/auth/customer/login", data);
      toast.success("ورود موفقیت‌آمیز بود");
      window.location.href = "/";
    } catch {
      toast.error("ایمیل یا رمز عبور اشتباه است");
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      await axiosInstance.post("/auth/customer/register", data);
      toast.success("ثبت‌نام موفقیت‌آمیز بود. اکنون وارد شوید.");
      setMode("login");
      registerForm.reset();
    } catch {
      toast.error("ثبت‌نام ناموفق بود");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[var(--color-gradient-from)] via-white to-white px-4 py-16"
    >
      {/* شاخه/برگ سمت چپ (نسخه‌ی اصلی) */}
      <LeafPattern />
      {/* شاخه/برگ سمت راست — همون الگو، آینه‌ی افقی */}
      <div className="absolute inset-0 scale-x-[-1]">
        <LeafPattern />
      </div>

      {/* لوازم آرایشی چشمک‌زن، گوشه‌ی بالا-چپ */}
      <CosmeticSparkles />

      <div className="absolute top-1/3 -left-32 w-[480px] h-[480px] rounded-full bg-[var(--color-primary)]/10 blur-3xl -z-10" />
      <div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full bg-[var(--color-primary)]/5 blur-3xl -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="w-8 h-8 text-[var(--color-primary)]" />
            <span className="text-2xl font-bold text-[var(--color-ink)]">Salon</span>
          </Link>
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="text-2xl font-bold text-[var(--color-ink)]">
                {mode === "login" ? "ورود به حساب کاربری" : "ایجاد حساب جدید"}
              </h1>
              <p className="text-[var(--color-ink-muted)] mt-2">
                {mode === "login"
                  ? "برای رزرو نوبت و مدیریت حساب وارد شوید"
                  : "با ثبت‌نام، رزرو نوبت و پیگیری خدمات را آسان کنید"}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(124,58,237,0.25)] border border-white/60 p-8">
          {/*
            Tabs — نسخه‌ی نهایی و مطمئن:
            به‌جای محاسبه‌ی دستی موقعیت (که با ترکیب عدد ساده و calc() درست
            تیین نمی‌شد)، از layoutId فریمر موشن استفاده می‌کنیم. با این روش
            خود کتابخونه موقعیت واقعی دکمه‌ی فعال رو از DOM اندازه می‌گیره
            (getBoundingClientRect) و انیمیشن رو بین دو موقعیت واقعی می‌سازه —
            کاملاً مستقل از RTL/LTR و بدون نیاز به حدس زدن right/left.
          */}
          <div className="relative flex mb-6 bg-[var(--color-bg-soft)] rounded-2xl p-1 gap-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className="relative flex-1 py-2.5 text-sm font-medium rounded-xl"
            >
              {mode === "login" && (
                <motion.div
                  layoutId="auth-tab-indicator"
                  className="absolute inset-0 rounded-xl bg-white shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span
                className={`relative z-10 transition-colors ${
                  mode === "login" ? "text-[var(--color-primary)]" : "text-[var(--color-ink-muted)]"
                }`}
              >
                ورود
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMode("register")}
              className="relative flex-1 py-2.5 text-sm font-medium rounded-xl"
            >
              {mode === "register" && (
                <motion.div
                  layoutId="auth-tab-indicator"
                  className="absolute inset-0 rounded-xl bg-white shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span
                className={`relative z-10 transition-colors ${
                  mode === "register" ? "text-[var(--color-primary)]" : "text-[var(--color-ink-muted)]"
                }`}
              >
                ثبت‌نام
              </span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                onSubmit={loginForm.handleSubmit(onLogin)}
                className="space-y-5"
              >
                <FormField
                  id="login-email"
                  label="ایمیل"
                  icon={Mail}
                  type="email"
                  dir="ltr"
                  placeholder="example@email.com"
                  error={loginForm.formState.errors.email?.message}
                  {...loginForm.register("email")}
                />
                <FormField
                  id="login-password"
                  label="رمز عبور"
                  icon={Lock}
                  type="password"
                  dir="ltr"
                  placeholder="رمز عبور"
                  error={loginForm.formState.errors.password?.message}
                  {...loginForm.register("password")}
                />

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-primary-soft)] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[var(--color-primary)]/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  ورود
                </motion.button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.25 }}
                onSubmit={registerForm.handleSubmit(onRegister)}
                className="space-y-5"
              >
                <FormField
                  id="reg-name"
                  label="نام کامل"
                  icon={User}
                  type="text"
                  placeholder="نام و نام خانوادگی"
                  error={registerForm.formState.errors.name?.message}
                  {...registerForm.register("name")}
                />
                <FormField
                  id="reg-email"
                  label="ایمیل"
                  icon={Mail}
                  type="email"
                  dir="ltr"
                  placeholder="example@email.com"
                  error={registerForm.formState.errors.email?.message}
                  {...registerForm.register("email")}
                />
                <FormField
                  id="reg-phone"
                  label="شماره تلفن"
                  icon={Phone}
                  type="tel"
                  dir="ltr"
                  placeholder="09123456789"
                  error={registerForm.formState.errors.phone?.message}
                  {...registerForm.register("phone")}
                />
                <FormField
                  id="reg-password"
                  label="رمز عبور"
                  icon={Lock}
                  type="password"
                  dir="ltr"
                  placeholder="حداقل ۶ کاراکتر"
                  error={registerForm.formState.errors.password?.message}
                  {...registerForm.register("password")}
                />

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-primary-soft)] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[var(--color-primary)]/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  ثبت‌نام
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center mt-6 text-sm text-[var(--color-ink-muted)]">
          <Link href="/" className="text-[var(--color-primary)] hover:underline">
            بازگشت به صفحه اصلی
          </Link>
        </p>
      </motion.div>
    </div>
  );
}