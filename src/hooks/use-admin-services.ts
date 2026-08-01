"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  duration: number;
  image: string | null;
  video: string | null;
  isActive: boolean;
  sortOrder: number;
  category: { id: string; name: string; slug: string };
  createdAt: string;
}

interface ServicesResponse {
  items: Service[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ListServicesParams {
  categoryId?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

async function fetchServices(params: ListServicesParams): Promise<ServicesResponse> {
  const { data } = await axiosInstance.get("/services", { params });
  return data.data;
}

async function createService(service: Partial<Service> & { categoryId: string }): Promise<Service> {
  const { data } = await axiosInstance.post("/services", service);
  return data.data;
}

async function updateService(id: string, service: Partial<Service>): Promise<Service> {
  const { data } = await axiosInstance.put(`/services/${id}`, service);
  return data.data;
}

async function deleteService(id: string): Promise<void> {
  await axiosInstance.delete(`/services/${id}`);
}

export function useAdminServices(params: ListServicesParams = {}) {
  return useQuery({
    queryKey: ["admin", "services", params],
    queryFn: () => fetchServices(params),
    staleTime: 30 * 1000,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
      toast.success("سرویس با موفقیت ایجاد شد");
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در ایجاد سرویس");
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Service> }) =>
      updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
      toast.success("سرویس با موفقیت بروزرسانی شد");
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در بروزرسانی سرویس");
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
      toast.success("سرویس با موفقیت حذف شد");
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در حذف سرویس");
    },
  });
}
