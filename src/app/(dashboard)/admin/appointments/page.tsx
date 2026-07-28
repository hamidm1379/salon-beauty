"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { useAdminAppointments, useUpdateAppointmentStatus } from "@/hooks/use-admin-appointments";
import Link from "next/link";

const statusOptions = [
  { value: "", label: "همه" },
  { value: "PENDING", label: "در انتظار" },
  { value: "CONFIRMED", label: "تایید شده" },
  { value: "CANCELLED", label: "لغو شده" },
  { value: "COMPLETED", label: "انجام شده" },
];

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" }> = {
  PENDING: { label: "در انتظار", variant: "warning" },
  CONFIRMED: { label: "تایید شده", variant: "success" },
  CANCELLED: { label: "لغو شده", variant: "danger" },
  COMPLETED: { label: "انجام شده", variant: "info" },
};

export default function AdminAppointmentsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useAdminAppointments({
    status: statusFilter || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    page,
    limit: 10,
  });

  const updateStatus = useUpdateAppointmentStatus();

  const appointments = data?.items || [];
  const totalPages = data?.totalPages || 1;

  const filteredAppointments = search
    ? appointments.filter(
        (a) =>
          a.customerName.includes(search) ||
          a.customerEmail.includes(search) ||
          a.service.name.includes(search)
      )
    : appointments;

  const handleConfirm = (id: string) => {
    updateStatus.mutate({ id, status: "CONFIRMED" });
  };

  const handleCancel = (id: string) => {
    updateStatus.mutate({ id, status: "CANCELLED" });
  };

  const handleComplete = (id: string) => {
    updateStatus.mutate({ id, status: "COMPLETED" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--color-ink)]">مدیریت نوبت‌ها</h1>
        <div className="text-sm text-[var(--color-ink-muted)]">
          کل: {data?.total || 0} نوبت
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              label="وضعیت"
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            />
            <Input
              label="از تاریخ"
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
            />
            <Input
              label="تا تاریخ"
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
            />
            <Input
              label="جستجو"
              placeholder="نام، ایمیل یا سرویس..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-[var(--color-ink-muted)]">نوبتی یافت نشد</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-[var(--color-bg-soft)]">
                    <th className="text-right px-4 py-3 text-sm font-medium text-[var(--color-ink-muted)]">
                      مشتری
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-[var(--color-ink-muted)]">
                      سرویس
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-[var(--color-ink-muted)]">
                      تاریخ و ساعت
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-[var(--color-ink-muted)]">
                      وضعیت
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-[var(--color-ink-muted)]">
                      مبلغ
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-[var(--color-ink-muted)]">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appointment, index) => {
                    const status = statusMap[appointment.status] || statusMap.PENDING;
                    return (
                      <motion.tr
                        key={appointment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b last:border-b-0 hover:bg-[var(--color-bg-soft)]"
                      >
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-[var(--color-ink)]">
                              {appointment.customerName}
                            </p>
                            <p className="text-sm text-[var(--color-ink-muted)]">
                              {appointment.customerEmail}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-[var(--color-ink)]">
                            {appointment.service.name}
                          </p>
                          <p className="text-sm text-[var(--color-ink-muted)]">
                            {appointment.service.duration} دقیقه
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-[var(--color-ink)]">{appointment.date}</p>
                          <p className="text-sm text-[var(--color-ink-muted)]">{appointment.time}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-[var(--color-ink)]">
                            {appointment.service.price.toLocaleString("fa-IR")} تومان
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Link href={`/appointment/${appointment.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            {appointment.status === "PENDING" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleConfirm(appointment.id)}
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCancel(appointment.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            {appointment.status === "CONFIRMED" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleComplete(appointment.id)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
