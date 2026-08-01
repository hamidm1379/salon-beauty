"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

export interface CommentReply {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  parentId: string | null;
}

export interface Comment {
  id: string;
  name: string;
  phone: string;
  content: string;
  isApproved: boolean;
  createdAt: string;
  service: { id: string; name: string; slug: string };
  replies: CommentReply[];
}

interface CommentsResponse {
  items: Comment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ListCommentsParams {
  serviceId?: string;
  isApproved?: boolean;
  page?: number;
  limit?: number;
}

async function fetchComments(params: ListCommentsParams): Promise<CommentsResponse> {
  const { data } = await axiosInstance.get("/comments", { params });
  return data.data;
}

async function createComment(comment: { name: string; phone: string; content: string; serviceId: string; parentId?: string }): Promise<Comment> {
  const { data } = await axiosInstance.post("/comments", comment);
  return data.data;
}

async function replyToComment(args: { id: string; content: string; serviceId: string }): Promise<Comment> {
  const { data } = await axiosInstance.put(`/comments/${args.id}`, {
    action: "reply",
    content: args.content,
    serviceId: args.serviceId,
  });
  return data.data;
}

async function approveComment(id: string): Promise<Comment> {
  const { data } = await axiosInstance.put(`/comments/${id}`, { action: "approve" });
  return data.data;
}

async function rejectComment(id: string): Promise<Comment> {
  const { data } = await axiosInstance.put(`/comments/${id}`, { action: "reject" });
  return data.data;
}

async function deleteComment(id: string): Promise<void> {
  await axiosInstance.delete(`/comments/${id}`);
}

export function useComments(params: ListCommentsParams = {}) {
  return useQuery({
    queryKey: ["comments", params],
    queryFn: () => fetchComments(params),
    staleTime: 30 * 1000,
  });
}

export function useServiceComments(serviceId: string) {
  return useQuery({
    queryKey: ["comments", "service", serviceId],
    queryFn: () => fetchComments({ serviceId, isApproved: true, limit: 100 }),
    staleTime: 30 * 1000,
    enabled: !!serviceId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast.success("نظر شما با موفقیت ارسال شد و پس از تایید نمایش داده خواهد شد");
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در ارسال نظر");
    },
  });
}

export function useReplyToComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: replyToComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast.success("پاسخ ثبت شد");
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در ارسال پاسخ");
    },
  });
}

export function useApproveComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast.success("نظر تایید شد");
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در تایید نظر");
    },
  });
}

export function useRejectComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast.success("نظر رد شد");
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در رد نظر");
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast.success("نظر حذف شد");
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در حذف نظر");
    },
  });
}
