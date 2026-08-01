"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  _count?: { services: number };
  createdAt: string;
}

interface CategoriesResponse {
  items: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function fetchCategories(): Promise<CategoriesResponse> {
  const { data } = await axiosInstance.get("/categories", {
    params: { limit: 100 },
  });
  return data.data;
}

async function createCategory(category: {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  sortOrder?: number;
  isActive?: boolean;
}): Promise<Category> {
  const { data } = await axiosInstance.post("/categories", category);
  return data.data;
}

async function updateCategory(
  id: string,
  category: Partial<Category>
): Promise<Category> {
  const { data } = await axiosInstance.put(`/categories/${id}`, category);
  return data.data;
}

async function deleteCategory(id: string): Promise<void> {
  await axiosInstance.delete(`/categories/${id}`);
}

export function useAdminCategories() {
  return useQuery({
    queryKey: ["admin", "categories"],
    queryFn: fetchCategories,
    staleTime: 30 * 1000,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast.success("دسته‌بندی با موفقیت ایجاد شد");
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در ایجاد دسته‌بندی");
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast.success("دسته‌بندی با موفقیت بروزرسانی شد");
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در بروزرسانی دسته‌بندی");
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast.success("دسته‌بندی با موفقیت حذف شد");
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در حذف دسته‌بندی");
    },
  });
}
