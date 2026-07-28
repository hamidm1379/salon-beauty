"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock,
  Settings,
  Mail,
  Loader2,
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

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
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
    },
    {
      title: "نوبت‌های در انتظار",
      value: stats?.pendingAppointments || 0,
      icon: Clock,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      title: "سرویس‌های فعال",
      value: stats?.totalServices || 0,
      icon: Settings,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "پیام‌های خوانده‌نشده",
      value: stats?.unreadMessages || 0,
      icon: Mail,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-[var(--color-ink)]">داشبورد</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[var(--color-ink-muted)]">
                        {card.title}
                      </p>
                      <p className="text-3xl font-bold text-[var(--color-ink)] mt-1">
                        {card.value.toLocaleString("fa-IR")}
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Chart */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-[var(--color-ink)]">
              نوبت‌های هفته اخیر
            </h3>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-48 gap-2">
              {stats?.weeklyAppointments.map((day, index) => {
                const maxCount = Math.max(
                  ...(stats?.weeklyAppointments.map((d) => d.count) || [1])
                );
                const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs text-[var(--color-ink-muted)]">
                      {day.count}
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                      className="w-full bg-gradient-to-t from-[var(--color-primary)] to-[var(--color-primary-soft)] rounded-t-lg min-h-[4px]"
                    />
                    <span className="text-xs text-[var(--color-ink-muted)]">
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
            <h3 className="text-lg font-semibold text-[var(--color-ink)]">
              آخرین نوبت‌ها
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentAppointments.length === 0 ? (
                <p className="text-center text-[var(--color-ink-muted)] py-8">
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
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-bg-soft)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                          <span className="text-[var(--color-primary)] font-medium">
                            {appointment.customerName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-[var(--color-ink)]">
                            {appointment.customerName}
                          </p>
                          <p className="text-xs text-[var(--color-ink-muted)]">
                            {appointment.service.name} • {appointment.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--color-ink-muted)]">
                          {appointment.date}
                        </span>
                        <Badge variant={status.variant}>{status.label}</Badge>
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
