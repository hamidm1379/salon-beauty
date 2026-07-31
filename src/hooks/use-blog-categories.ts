"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count?: {
    posts: number;
  };
}

interface BlogCategoriesResponse {
  items: BlogCategory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function fetchBlogCategories(): Promise<BlogCategoriesResponse> {
  const { data } = await axiosInstance.get("/blog-categories", {
    params: { limit: 100 },
  });
  return data.data;
}

async function createBlogCategory(category: { name: string; description?: string }): Promise<BlogCategory> {
  const { data } = await axiosInstance.post("/blog-categories", category);
  return data.data;
}

export function useBlogCategories() {
  return useQuery({
    queryKey: ["blog", "categories"],
    queryFn: fetchBlogCategories,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBlogCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog", "categories"] });
      toast.success("دسته‌بندی با موفقیت ایجاد شد");
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در ایجاد دسته‌بندی");
    },
  });
}
