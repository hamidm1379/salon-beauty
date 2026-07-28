"use client";

import { useState } from "react";
import {
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { ResponsiveTable } from "@/components/admin/ResponsiveTable";
import {
  useAdminUsers,
  useUpdateUserRole,
  useDeleteUser,
} from "@/hooks/use-admin-users";

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");

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

  const handleDelete = (id: string) => {
    if (confirm("آیا از حذف این کاربر اطمینان دارید؟")) {
      deleteUser.mutate(id);
    }
  };

  const columns = [
    {
      key: "name",
      label: "نام",
      render: (user: typeof users[0]) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
            <span className="text-[var(--color-primary)] font-medium">
              {user.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-[var(--color-ink)]">{user.name}</p>
            <p className="text-xs text-[var(--color-ink-muted)]">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "نقش",
      render: (user: typeof users[0]) => (
        <div className="flex items-center gap-2">
          <select
            value={user.role}
            onChange={(e) => handleRoleChange(user.id, e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="ADMIN">مدیر</option>
            <option value="EDITOR">ویرایشگر</option>
          </select>
        </div>
      ),
    },
    {
      key: "phone",
      label: "تلفن",
      render: (user: typeof users[0]) => (
        <span className="text-[var(--color-ink-muted)]">
          {user.phone || "-"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "تاریخ عضویت",
      render: (user: typeof users[0]) => (
        <span className="text-[var(--color-ink-muted)]">
          {new Date(user.createdAt).toLocaleDateString("fa-IR")}
        </span>
      ),
    },
    {
      key: "actions",
      label: "عملیات",
      render: (user: typeof users[0]) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(user.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--color-ink)]">مدیریت کاربران</h1>
        <div className="text-sm text-[var(--color-ink-muted)]">
          کل: {usersData?.total || 0} کاربر
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="جستجو در کاربران..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setRoleFilter("");
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  !roleFilter
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-bg-soft)] text-[var(--color-ink)] hover:bg-[var(--color-primary)]/10"
                }`}
              >
                همه
              </button>
              <button
                onClick={() => {
                  setRoleFilter("ADMIN");
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  roleFilter === "ADMIN"
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-bg-soft)] text-[var(--color-ink)] hover:bg-[var(--color-primary)]/10"
                }`}
              >
                مدیران
              </button>
              <button
                onClick={() => {
                  setRoleFilter("EDITOR");
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  roleFilter === "EDITOR"
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-bg-soft)] text-[var(--color-ink)] hover:bg-[var(--color-primary)]/10"
                }`}
              >
                ویرایشگران
              </button>
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
    </div>
  );
}
