"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  duration: number;
  image: string | null;
  category: { id: string; name: string; slug: string };
}

interface ServicesResponse {
  items: Service[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function fetchServices(): Promise<ServicesResponse> {
  const { data } = await axiosInstance.get("/services", {
    params: { isActive: true, limit: 100 },
  });
  return data.data;
}

export function useServices() {
  return useQuery({
    queryKey: ["services", "active"],
    queryFn: fetchServices,
    staleTime: 5 * 60 * 1000,
  });
}
