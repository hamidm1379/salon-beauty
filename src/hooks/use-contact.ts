"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface ContactMessagesResponse {
  items: ContactMessage[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ListContactParams {
  isRead?: boolean;
  page?: number;
  limit?: number;
}

async function fetchContactMessages(params: ListContactParams): Promise<ContactMessagesResponse> {
  const { data } = await axiosInstance.get("/contact", { params });
  return data.data;
}

async function createContactMessage(message: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}): Promise<ContactMessage> {
  const { data } = await axiosInstance.post("/contact", message);
  return data.data;
}

async function markAsRead(id: string): Promise<ContactMessage> {
  const { data } = await axiosInstance.patch(`/contact/${id}`, { isRead: true });
  return data.data;
}

async function deleteContactMessage(id: string): Promise<void> {
  await axiosInstance.delete(`/contact/${id}`);
}

export function useContactMessages(params: ListContactParams = {}) {
  return useQuery({
    queryKey: ["contact", "messages", params],
    queryFn: () => fetchContactMessages(params),
    staleTime: 30 * 1000,
  });
}

export function useCreateContactMessage() {
  return useMutation({
    mutationFn: createContactMessage,
    onSuccess: () => {
      toast.success("پیام شما با موفقیت ارسال شد");
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در ارسال پیام");
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact"] });
      toast.success("پیام به عنوان خوانده شده علامت گذاری شد");
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در بروزرسانی پیام");
    },
  });
}

export function useDeleteContactMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContactMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact"] });
      toast.success("پیام با موفقیت حذف شد");
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در حذف پیام");
    },
  });
}
