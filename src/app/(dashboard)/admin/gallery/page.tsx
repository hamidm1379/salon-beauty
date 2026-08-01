"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Film,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { ResponsiveTable } from "@/components/admin/ResponsiveTable";
import {
  useAdminGallery,
  useDeleteGalleryItem,
} from "@/hooks/use-admin-gallery";

export default function AdminGalleryPage() {
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: galleryData, isLoading } = useAdminGallery({
    page,
    limit: 12,
  });

  const deleteItem = useDeleteGalleryItem();

  const items = galleryData?.items || [];
  const totalPages = galleryData?.totalPages || 1;

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    deleteItem.mutate(deleteId);
    setDeleteId(null);
  };

  const columns = [
    {
      key: "media",
      label: "رسانه",
      render: (item: (typeof items)[0]) => {
        const mediaType = item.image?.type || "image";
        return (
          <div className="w-12 h-12 rounded-lg bg-[var(--color-bg-soft)] flex items-center justify-center overflow-hidden">
            {item.image ? (
              mediaType === "video" ? (
                <div className="relative w-full h-full">
                  <video
                    src={item.image.url}
                    className="w-full h-full object-cover"
                    muted
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Film className="w-4 h-4 text-white" />
                  </div>
                </div>
              ) : (
                <Image
                  src={item.image.url}
                  alt={item.image.alt || item.title}
                  width={48}
                  height={48}
                  sizes="48px"
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <ImageIcon className="w-6 h-6 text-[var(--color-ink-muted)]" />
            )}
          </div>
        );
      },
    },
    {
      key: "title",
      label: "عنوان",
      render: (item: (typeof items)[0]) => (
        <div>
          <p className="font-medium text-[var(--color-ink)]">{item.title}</p>
          {item.description && (
            <p className="text-xs text-[var(--color-ink-muted)] line-clamp-1">
              {item.description}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "type",
      label: "نوع",
      render: (item: (typeof items)[0]) => {
        const mediaType = item.image?.type || "image";
        return (
          <Badge variant={mediaType === "video" ? "info" : "default"}>
            {mediaType === "video" ? "ویدیو" : "تصویر"}
          </Badge>
        );
      },
    },
    {
      key: "sortOrder",
      label: "ترتیب",
    },
    {
      key: "isActive",
      label: "وضعیت",
      render: (item: (typeof items)[0]) => (
        <Badge variant={item.isActive ? "success" : "warning"}>
          {item.isActive ? "فعال" : "غیرفعال"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "عملیات",
      render: (item: (typeof items)[0]) => (
        <div className="flex items-center gap-2">
          <Link href={`/admin/gallery/edit/${item.id}`}>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(item.id)}
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
        <h1 className="text-2xl font-bold text-[var(--color-ink)]">مدیریت گالری</h1>
        <Link href="/admin/gallery/new">
          <Button>
            <Plus className="w-4 h-4 ml-2" />
            آیتم جدید
          </Button>
        </Link>
      </div>

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
              data={items}
              keyExtractor={(item) => item.id}
              emptyMessage="آیتمی یافت نشد"
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

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="تایید حذف"
        className="max-w-sm"
      >
        <p className="text-[var(--color-ink-muted)] mb-6">
          آیا از حذف این آیتم اطمینان دارید؟ این عمل غیرقابل بازگشت است.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>
            انصراف
          </Button>
          <Button
            variant="danger"
            onClick={confirmDelete}
            isLoading={deleteItem.isPending}
          >
            حذف
          </Button>
        </div>
      </Modal>
    </div>
  );
}
