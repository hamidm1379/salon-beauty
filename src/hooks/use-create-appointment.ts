"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

interface CreateAppointmentInput {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  serviceId: string;
  date: string;
  time: string;
  notes?: string;
}

interface AppointmentResponse {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  date: string;
  time: string;
  notes: string | null;
  status: string;
  service: { id: string; name: string; price: number; duration: number };
}

async function createAppointment(input: CreateAppointmentInput): Promise<AppointmentResponse> {
  const { data } = await axiosInstance.post("/appointments", input);
  return data.data;
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("نوبت با موفقیت رزرو شد");
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در رزرو نوبت");
    },
  });
}
