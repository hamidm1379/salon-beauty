"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

interface Slot {
  time: string;
  available: boolean;
}

async function fetchAvailableSlots(date: string, serviceId: string): Promise<Slot[]> {
  const { data } = await axiosInstance.get("/appointments/availability", {
    params: { date, serviceId },
  });
  return data.data;
}

export function useAvailableSlots(date: string | null, serviceId: string | null) {
  return useQuery({
    queryKey: ["appointments", "availability", date, serviceId],
    queryFn: () => fetchAvailableSlots(date!, serviceId!),
    enabled: !!date && !!serviceId,
    staleTime: 30 * 1000,
  });
}
