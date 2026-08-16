"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { Loader2, Shield, RefreshCw, Calculator } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import Link from "next/link";

function generateCaptcha() {
  const ops = ["+", "-", "×"] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number;
  let b: number;
  if (op === "-") {
    a = Math.floor(Math.random() * 15) + 6;
    b = Math.floor(Math.random() * a) + 1;
  } else if (op === "×") {
    a = Math.floor(Math.random() * 9) + 2;
    b = Math.floor(Math.random() * 9) + 2;
  } else {
    a = Math.floor(Math.random() * 20) + 1;
    b = Math.floor(Math.random() * 20) + 1;
  }
  const answer = op === "+" ? a + b : op === "-" ? a - b : a * b;
  return { a, op, b, answer };
}

const loginSchema = z.object({
  username: z.string().min(1, "نام کاربری الزامی است"),
  password: z.string().min(1, "رمز عبور الزامی است"),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [captcha, setCaptcha] = useState<ReturnType<typeof generateCaptcha>>(generateCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
    setCaptchaError("");
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    const answer = parseInt(captchaInput, 10);
    if (isNaN(answer) || !captcha || answer !== captcha.answer) {
      setCaptchaError("پاسخ سوال صحیح نیست");
      return;
    }
    setCaptchaError("");

    setIsLoading(true);
    try {
      await axiosInstance.post("/auth/login", data);
      toast.success("ورود موفقیت‌آمیز بود");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "نام کاربری یا رمز عبور اشتباه است";
      toast.error(message);
      refreshCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-soft)] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-soft)] flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-ink)]">ورود مدیریت</h1>
          <p className="text-[var(--color-ink-muted)] mt-2">
            پنل مدیریت سالن زیبایی
          </p>
        </div>

        <div className="bg-[var(--color-bg)] rounded-3xl shadow-[0_20px_60px_-15px_rgba(124,58,237,0.15)] p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-[var(--color-ink)] mb-2"
              >
                نام کاربری
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                {...register("username")}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-ink)]/10 bg-[var(--color-bg)] text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
                placeholder="نام کاربری خود را وارد کنید"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--color-ink)] mb-2"
              >
                رمز عبور
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-ink)]/10 bg-[var(--color-bg)] text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
                placeholder="رمز عبور"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Math CAPTCHA */}
            <div className="bg-[var(--color-bg-soft)] rounded-xl p-4 border border-[var(--color-ink)]/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-ink)]">
                  <Calculator className="w-4 h-4 text-[var(--color-primary)]" />
                  <span>تصویر امنیتی</span>
                </div>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="p-1.5 rounded-lg hover:bg-[var(--color-bg)] transition-colors text-[var(--color-ink-muted)] hover:text-[var(--color-primary)]"
                  aria-label="captcha refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 text-center bg-[var(--color-bg)] rounded-xl py-3 border border-[var(--color-ink)]/8 select-none">
                  <span className="text-lg font-bold text-[var(--color-ink)] tracking-wider">
                    {captcha ? `${captcha.a} ${captcha.op} ${captcha.b} = ?` : "\u00A0"}
                  </span>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  value={captchaInput}
                  onChange={(e) => {
                    setCaptchaInput(e.target.value.replace(/[^0-9\-]/g, ""));
                    setCaptchaError("");
                  }}
                  className="w-20 text-center px-3 py-3 rounded-xl border border-[var(--color-ink)]/10 bg-[var(--color-bg)] text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition text-sm font-bold"
                  placeholder="پاسخ"
                  autoComplete="off"
                />
              </div>
              {captchaError && (
                <p className="mt-2 text-sm text-red-500">{captchaError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-primary-soft)] text-white font-semibold rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              ورود
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-[var(--color-ink-muted)]">
          <Link href="/" className="text-[var(--color-primary)] hover:underline">
            بازگشت به سایت
          </Link>
        </p>
      </div>
    </div>
  );
}
