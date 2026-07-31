"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

interface DashboardStats {
  todayAppointments: number;
  pendingAppointments: number;
  totalServices: number;
  totalUsers: number;
  totalBlogPosts: number;
  unreadMessages: number;
  recentAppointments: {
    id: string;
    customerName: string;
    date: string;
    time: string;
    status: string;
    service: { name: string };
  }[];
  weeklyAppointments: { date: string; count: number }[];
  monthlyAppointments: { month: string; count: number }[];
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data } = await axiosInstance.get("/dashboard");
  return data.data;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: fetchDashboardStats,
    staleTime: 60 * 1000,
  });
}
