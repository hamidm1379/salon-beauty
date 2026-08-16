"use client";

import { useState } from "react";
import {
  Trash2,
  Loader2,
  Search,
  Users,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { ResponsiveTable } from "@/components/admin/ResponsiveTable";
import { useAuth } from "@/hooks/use-auth";
import {
  useAdminUsers,
  useUpdateUserRole,
  useDeleteUser,
} from "@/hooks/use-admin-users";

const roleOptions = [
  { value: "", label: "همه نقش‌ها" },
  { value: "ADMIN", label: "مدیر" },
  { value: "EDITOR", label: "ویرایشگر" },
];

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "ADMIN";

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    userId: string | null;
    userName: string;
  }>({ open: false, userId: null, userName: "" });

  const { data: usersData, isLoading } = useAdminUsers({
    role: roleFilter || undefined,
    search: search || undefined,
    page,
    limit: 10,
  });

  const updateRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();

  const users = usersData?.items || [];
  const totalPages = usersData?.totalPages || 1;

  const handleRoleChange = (id: string, newRole: string) => {
    updateRole.mutate({ id, role: newRole });
  };

  const handleDelete = (id: string, name: string) => {
    setConfirmModal({ open: true, userId: id, userName: name });
  };

  const confirmDelete = () => {
    if (!confirmModal.userId) return;
    deleteUser.mutate(confirmModal.userId);
    setConfirmModal({ open: false, userId: null, userName: "" });
  };

  const columns = [
    {
      key: "name",
      label: "نام",
      render: (user: (typeof users)[0]) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
            <span className="text-[var(--color-primary)] font-medium">
              {user.name.charAt(0)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-medium text-[var(--color-ink)] truncate">{user.name}</p>
            <p className="text-xs text-[var(--color-ink-muted)] truncate">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "نقش",
      render: (user: (typeof users)[0]) => (
        isAdmin ? (
          <select
            value={user.role}
            onChange={(e) => handleRoleChange(user.id, e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
          >
            <option value="ADMIN">مدیر</option>
            <option value="EDITOR">ویرایشگر</option>
          </select>
        ) : (
          <Badge variant={user.role === "ADMIN" ? "success" : "default"}>
            {user.role === "ADMIN" ? "مدیر" : "ویرایشگر"}
          </Badge>
        )
      ),
    },
    {
      key: "phone",
      label: "تلفن",
      render: (user: (typeof users)[0]) => (
        <span className="text-sm text-[var(--color-ink-muted)]">
          {user.phone || "-"}
        </span>
      ),
    },
    {
      key: "status",
      label: "وضعیت",
      render: (user: (typeof users)[0]) => (
        <Badge variant={user.role === "ADMIN" ? "success" : "default"}>
          {user.role === "ADMIN" ? "مدیر" : "ویرایشگر"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "تاریخ عضویت",
      render: (user: (typeof users)[0]) => (
        <span className="text-sm text-[var(--color-ink-muted)]">
          {new Date(user.createdAt).toLocaleDateString("fa-IR")}
        </span>
      ),
    },
    {
      key: "actions",
      label: "عملیات",
      render: (user: (typeof users)[0]) => (
        isAdmin ? (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(user.id, user.name)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ) : null
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-[var(--color-primary)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-ink)]">مدیریت کاربران</h1>
            <p className="text-sm text-[var(--color-ink-muted)]">
              کل: {usersData?.total || 0} کاربر
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-ink-muted)]" />
              <Input
                placeholder="جستجو در نام یا ایمیل..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pr-10"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
                options={roleOptions}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
            </div>
          ) : (
            <ResponsiveTable
              columns={columns}
              data={users}
              keyExtractor={(user) => user.id}
              emptyMessage="کاربری یافت نشد"
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Confirm Delete Modal */}
      <Modal
        open={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, userId: null, userName: "" })}
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-[var(--color-ink)] mb-2">
            حذف کاربر
          </h3>
          <p className="text-sm text-[var(--color-ink-muted)] mb-6 leading-relaxed">
            آیا از حذف کاربر «{confirmModal.userName}» اطمینان دارید؟ این عمل قابل بازگشت نیست.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="ghost"
              onClick={() => setConfirmModal({ open: false, userId: null, userName: "" })}
            >
              انصراف
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={confirmDelete}
              isLoading={deleteUser.isPending}
            >
              <Trash2 className="w-4 h-4 ml-1.5" />
              حذف
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
