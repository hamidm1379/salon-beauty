"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

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

async function fetchAppointment(id: string): Promise<Appointment> {
  const { data } = await axiosInstance.get(`/appointments/${id}`);
  return data.data;
}

export function useAppointment(id: string | null) {
  return useQuery({
    queryKey: ["appointments", id],
    queryFn: () => fetchAppointment(id!),
    enabled: !!id,
  });
}
