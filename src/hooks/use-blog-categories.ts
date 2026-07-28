"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

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

export function useBlogCategories() {
  return useQuery({
    queryKey: ["blog", "categories"],
    queryFn: fetchBlogCategories,
    staleTime: 5 * 60 * 1000,
  });
}
