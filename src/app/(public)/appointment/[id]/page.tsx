"use client";

import { use } from "react";
import { Container, Heading } from "@/components/ui/Layout";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAppointment } from "@/hooks/use-appointment";
import { Loader2, CheckCircle2, XCircle, Clock, CalendarDays, User, Mail, Phone } from "lucide-react";

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" }> = {
  PENDING: { label: "در انتظار تایید", variant: "warning" },
  CONFIRMED: { label: "تایید شده", variant: "success" },
  CANCELLED: { label: "لغو شده", variant: "danger" },
  COMPLETED: { label: "انجام شده", variant: "info" },
};

export default function AppointmentConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: appointment, isLoading, error } = useAppointment(id);

  if (isLoading) {
    return (
      <Container className="py-24">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
        </div>
      </Container>
    );
  }

  if (error || !appointment) {
    return (
      <Container className="py-24">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <Heading level={2}>نوبت یافت نشد</Heading>
          <p className="text-[var(--color-ink-muted)] mt-2">
            نوبت مورد نظر وجود ندارد یا حذف شده است.
          </p>
          <Button className="mt-6" onClick={() => window.location.href = "/appointment"}>
            رزرو نوبت جدید
          </Button>
        </div>
      </Container>
    );
  }

  const status = statusMap[appointment.status] || statusMap.PENDING;

  return (
    <Container className="py-24">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <Heading level={1}>جزئیات نوبت</Heading>
          <p className="text-[var(--color-ink-muted)] mt-2">
            کد پیگیری: <span className="font-mono font-bold">{appointment.id}</span>
          </p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-ink-muted)]">وضعیت:</span>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center gap-3">
                <CalendarDays className="w-5 h-5 text-[var(--color-primary)]" />
                <div>
                  <p className="text-sm text-[var(--color-ink-muted)]">تاریخ و ساعت</p>
                  <p className="font-medium">{appointment.date} - {appointment.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[var(--color-primary)]" />
                <div>
                  <p className="text-sm text-[var(--color-ink-muted)]">سرویس</p>
                  <p className="font-medium">{appointment.service.name}</p>
                  <p className="text-sm text-[var(--color-ink-muted)]">
                    {appointment.service.duration} دقیقه
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-[var(--color-primary)]" />
                <div>
                  <p className="text-sm text-[var(--color-ink-muted)]">نام</p>
                  <p className="font-medium">{appointment.customerName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[var(--color-primary)]" />
                <div>
                  <p className="text-sm text-[var(--color-ink-muted)]">ایمیل</p>
                  <p className="font-medium">{appointment.customerEmail}</p>
                </div>
              </div>

              {appointment.customerPhone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[var(--color-primary)]" />
                  <div>
                    <p className="text-sm text-[var(--color-ink-muted)]">تلفن</p>
                    <p className="font-medium">{appointment.customerPhone}</p>
                  </div>
                </div>
              )}

              {appointment.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-[var(--color-ink-muted)]">یادداشت</p>
                  <p className="mt-1">{appointment.notes}</p>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-[var(--color-ink-muted)]">مبلغ قابل پرداخت:</span>
                <span className="text-xl font-bold text-[var(--color-primary)]">
                  {appointment.service.price.toLocaleString("fa-IR")} تومان
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button variant="secondary" onClick={() => window.location.href = "/appointment"}>
            رزرو نوبت جدید
          </Button>
        </div>
      </div>
    </Container>
  );
}
