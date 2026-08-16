"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  image: {
    id: string;
    url: string;
    type: string;
    alt: string | null;
    width: number | null;
    height: number | null;
  } | null;
  createdAt: string;
}

interface GalleryResponse {
  items: GalleryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function fetchGallery(limit: number): Promise<GalleryResponse> {
  const { data } = await axiosInstance.get("/gallery", {
    params: { isActive: true, limit, sortBy: "createdAt", sortOrder: "desc" },
  });
  return data.data;
}

export function useGallery(limit = 10) {
  return useQuery({
    queryKey: ["gallery", "active", limit],
    queryFn: () => fetchGallery(limit),
    staleTime: 5 * 60 * 1000,
  });
}
