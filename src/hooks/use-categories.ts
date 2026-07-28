"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
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
    params: { isActive: true, limit: 100, sortBy: "sortOrder", sortOrder: "asc" },
  });
  return data.data;
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories", "active"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });
}
