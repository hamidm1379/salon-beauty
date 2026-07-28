"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

interface GalleryItem {
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

interface ListGalleryParams {
  isActive?: boolean;
  page?: number;
  limit?: number;
}

async function fetchGallery(params: ListGalleryParams): Promise<GalleryResponse> {
  const { data } = await axiosInstance.get("/gallery", { params });
  return data.data;
}

async function createGalleryItem(item: Partial<GalleryItem>): Promise<GalleryItem> {
  const { data } = await axiosInstance.post("/gallery", item);
  return data.data;
}

async function updateGalleryItem(id: string, item: Partial<GalleryItem>): Promise<GalleryItem> {
  const { data } = await axiosInstance.put(`/gallery/${id}`, item);
  return data.data;
}

async function deleteGalleryItem(id: string): Promise<void> {
  await axiosInstance.delete(`/gallery/${id}`);
}

export function useAdminGallery(params: ListGalleryParams = {}) {
  return useQuery({
    queryKey: ["admin", "gallery", params],
    queryFn: () => fetchGallery(params),
    staleTime: 30 * 1000,
  });
}

export function useCreateGalleryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGalleryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
      toast.success("آیتم با موفقیت ایجاد شد");
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در ایجاد آیتم");
    },
  });
}

export function useUpdateGalleryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<GalleryItem> }) =>
      updateGalleryItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
      toast.success("آیتم با موفقیت بروزرسانی شد");
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در بروزرسانی آیتم");
    },
  });
}

export function useDeleteGalleryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGalleryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
      toast.success("آیتم با موفقیت حذف شد");
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در حذف آیتم");
    },
  });
}
