"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

interface Settings {
  [key: string]: string;
}

async function fetchSettings(): Promise<Settings> {
  const { data } = await axiosInstance.get("/settings");
  return data.data;
}

async function updateSettings(settings: Settings): Promise<Settings> {
  const { data } = await axiosInstance.put("/settings", settings);
  return data.data;
}

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در بروزرسانی تنظیمات");
    },
  });
}
