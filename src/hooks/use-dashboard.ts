"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

interface DashboardStats {
  todayAppointments: number;
  pendingAppointments: number;
  totalServices: number;
  unreadMessages: number;
  totalBlogViews: number;
  recentAppointments: {
    id: string;
    customerName: string;
    date: string;
    time: string;
    status: string;
    service: { name: string };
  }[];
  weeklyAppointments: { date: string; count: number }[];
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data } = await axiosInstance.get("/dashboard/stats");
  return data.data;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: fetchDashboardStats,
    staleTime: 60 * 1000,
  });
}
