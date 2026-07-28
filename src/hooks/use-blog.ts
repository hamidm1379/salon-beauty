"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

interface BlogImage {
  id: string;
  url: string;
  alt: string | null;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  published: boolean;
  publishedAt: string | null;
  blogCategoryId: string;
  blogCategory: BlogCategory;
  image: BlogImage | null;
  createdAt: string;
  updatedAt: string;
}

interface BlogPostsResponse {
  items: BlogPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ListBlogParams {
  published?: boolean;
  blogCategoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

async function fetchBlogPosts(params: ListBlogParams): Promise<BlogPostsResponse> {
  const { data } = await axiosInstance.get("/blog", { params });
  return data.data;
}

async function fetchBlogPostBySlug(slug: string): Promise<BlogPost> {
  const { data } = await axiosInstance.get(`/blog/slug/${slug}`);
  return data.data;
}

async function fetchRelatedPosts(id: string): Promise<BlogPost[]> {
  const { data } = await axiosInstance.get(`/blog/${id}/related`);
  return data.data;
}

async function createBlogPost(post: Partial<BlogPost>): Promise<BlogPost> {
  const { data } = await axiosInstance.post("/blog", post);
  return data.data;
}

async function updateBlogPost(id: string, post: Partial<BlogPost>): Promise<BlogPost> {
  const { data } = await axiosInstance.put(`/blog/${id}`, post);
  return data.data;
}

async function deleteBlogPost(id: string): Promise<void> {
  await axiosInstance.delete(`/blog/${id}`);
}

export function useBlogPosts(params: ListBlogParams = {}) {
  return useQuery({
    queryKey: ["blog", "posts", params],
    queryFn: () => fetchBlogPosts(params),
    staleTime: 30 * 1000,
  });
}

export function useBlogPost(slug: string | null) {
  return useQuery({
    queryKey: ["blog", "post", slug],
    queryFn: () => fetchBlogPostBySlug(slug!),
    enabled: !!slug,
  });
}

export function useRelatedPosts(id: string | null) {
  return useQuery({
    queryKey: ["blog", "related", id],
    queryFn: () => fetchRelatedPosts(id!),
    enabled: !!id,
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
      toast.success("پست با موفقیت ایجاد شد");
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در ایجاد پست");
    },
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BlogPost> }) =>
      updateBlogPost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
      toast.success("پست با موفقیت بروزرسانی شد");
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در بروزرسانی پست");
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
      toast.success("پست با موفقیت حذف شد");
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در حذف پست");
    },
  });
}
