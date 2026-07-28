"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "ADMIN" | "EDITOR";
  avatar: string | null;
  createdAt: string;
}

interface UsersResponse {
  items: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ListUsersParams {
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}

async function fetchUsers(params: ListUsersParams): Promise<UsersResponse> {
  const { data } = await axiosInstance.get("/users", { params });
  return data.data;
}

async function updateUserRole(id: string, role: string): Promise<User> {
  const { data } = await axiosInstance.patch(`/users/${id}`, { role });
  return data.data;
}

async function deleteUser(id: string): Promise<void> {
  await axiosInstance.delete(`/users/${id}`);
}

export function useAdminUsers(params: ListUsersParams = {}) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => fetchUsers(params),
    staleTime: 30 * 1000,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("نقش کاربر با موفقیت بروزرسانی شد");
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در بروزرسانی نقش کاربر");
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("کاربر با موفقیت حذف شد");
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در حذف کاربر");
    },
  });
}
