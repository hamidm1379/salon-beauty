"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  Settings,
  Users,
  FileText,
  Mail,
  Loader2,
  ArrowLeft,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useDashboardStats } from "@/hooks/use-dashboard";

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" }> = {
  PENDING: { label: "در انتظار", variant: "warning" },
  CONFIRMED: { label: "تایید شده", variant: "success" },
  CANCELLED: { label: "لغو شده", variant: "danger" },
  COMPLETED: { label: "انجام شده", variant: "info" },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  const statCards = [
    {
      title: "نوبت‌های امروز",
      value: stats?.todayAppointments || 0,
      icon: CalendarDays,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      href: "/admin/appointments",
    },
    {
      title: "نوبت‌های در انتظار",
      value: stats?.pendingAppointments || 0,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      href: "/admin/appointments",
    },
    {
      title: "کاربران",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      href: "/admin/users",
    },
    {
      title: "سرویس‌های فعال",
      value: stats?.totalServices || 0,
      icon: Settings,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      href: "/admin/services",
    },
    {
      title: "مقالات بلاگ",
      value: stats?.totalBlogPosts || 0,
      icon: FileText,
      color: "text-pink-500",
      bg: "bg-pink-500/10",
      href: "/admin/blog",
    },
    {
      title: "پیام‌های خوانده‌نشده",
      value: stats?.unreadMessages || 0,
      icon: Mail,
      color: "text-red-500",
      bg: "bg-red-500/10",
      href: "/admin/contacts",
    },
  ];

  const maxWeekly = Math.max(...(stats?.weeklyAppointments.map((d) => d.count) || [1]), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-ink)]">داشبورد</h1>
        <p className="text-sm text-[var(--color-ink-muted)] mt-1">
          خلاصه‌ای از وضعیت کلی سالن زیبایی
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Link href={card.href}>
                <Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer h-full">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${card.color}`} />
                      </div>
                      <ArrowLeft className="w-4 h-4 text-[var(--color-ink-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-2xl font-bold text-[var(--color-ink)]">
                      {card.value.toLocaleString("fa-IR")}
                    </p>
                    <p className="text-xs text-[var(--color-ink-muted)] mt-1">
                      {card.title}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[var(--color-ink)] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--color-primary)]" />
                نوبت‌های هفته اخیر
              </h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-52 gap-3 px-2">
              {stats?.weeklyAppointments.map((day, index) => {
                const height = maxWeekly > 0 ? (day.count / maxWeekly) * 100 : 0;
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-2.5">
                    <span className="text-xs font-medium text-[var(--color-ink)]">
                      {day.count}
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(height, 4)}%` }}
                      transition={{ delay: 0.4 + index * 0.08, duration: 0.5, ease: "easeOut" }}
                      className="w-full bg-gradient-to-t from-[var(--color-primary)] to-[var(--color-primary-soft)] rounded-t-lg"
                    />
                    <span className="text-[11px] text-[var(--color-ink-muted)]">
                      {day.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Appointments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[var(--color-ink)]">
                آخرین نوبت‌ها
              </h3>
              <Link
                href="/admin/appointments"
                className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1"
              >
                مشاهده همه
                <ArrowLeft className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.recentAppointments.length === 0 ? (
                <p className="text-center text-[var(--color-ink-muted)] py-8 text-sm">
                  نوبتی ثبت نشده است
                </p>
              ) : (
                stats?.recentAppointments.map((appointment, index) => {
                  const status = statusMap[appointment.status] || statusMap.PENDING;
                  return (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.08 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-bg-soft)] hover:bg-[var(--color-primary)]/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                          <span className="text-[var(--color-primary)] font-medium text-sm">
                            {appointment.customerName.charAt(0)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[var(--color-ink)] text-sm truncate">
                            {appointment.customerName}
                          </p>
                          <p className="text-[11px] text-[var(--color-ink-muted)] truncate">
                            {appointment.service.name} &middot; {appointment.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-[var(--color-ink-muted)] hidden sm:block">
                          {appointment.date}
                        </span>
                        <Badge variant={status.variant} className="text-[10px]">
                          {status.label}
                        </Badge>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
