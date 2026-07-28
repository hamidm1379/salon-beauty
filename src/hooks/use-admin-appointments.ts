"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

interface Appointment {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  date: string;
  time: string;
  notes: string | null;
  status: string;
  service: {
    id: string;
    name: string;
    slug: string;
    price: number;
    duration: number;
  };
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
}

interface AppointmentsResponse {
  items: Appointment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ListAppointmentsParams {
  status?: string;
  serviceId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

async function fetchAppointments(params: ListAppointmentsParams): Promise<AppointmentsResponse> {
  const { data } = await axiosInstance.get("/appointments", { params });
  return data.data;
}

async function updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
  const { data } = await axiosInstance.patch(`/appointments/${id}`, { status });
  return data.data;
}

export function useAdminAppointments(params: ListAppointmentsParams = {}) {
  return useQuery({
    queryKey: ["admin", "appointments", params],
    queryFn: () => fetchAppointments(params),
    staleTime: 30 * 1000,
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateAppointmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "appointments"] });
      toast.success("وضعیت نوبت با موفقیت بروزرسانی شد");
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در بروزرسانی وضعیت نوبت");
    },
  });
}
