"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { ResponsiveTable } from "@/components/admin/ResponsiveTable";
import { FileUpload } from "@/components/admin/FileUpload";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
import {
  useAdminGallery,
  useCreateGalleryItem,
  useUpdateGalleryItem,
  useDeleteGalleryItem,
} from "@/hooks/use-admin-gallery";

const gallerySchema = z.object({
  title: z.string().min(1, "عنوان الزامی است"),
  description: z.string().optional(),
  imageId: z.string().optional(),
  sortOrder: z.number().min(0),
  isActive: z.boolean(),
});

type GalleryFormData = z.infer<typeof gallerySchema>;

interface UploadedFile {
  id: string;
  url: string;
  type: string;
}

export default function AdminGalleryPage() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const originalImageIdRef = useRef<string | null>(null);

  const { data: galleryData, isLoading } = useAdminGallery({
    page,
    limit: 12,
  });

  const createItem = useCreateGalleryItem();
  const updateItem = useUpdateGalleryItem();
  const deleteItem = useDeleteGalleryItem();

  const items = galleryData?.items || [];
  const totalPages = galleryData?.totalPages || 1;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<GalleryFormData>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      isActive: true,
      sortOrder: 0,
      title: "",
    },
  });

  const openModal = (item?: (typeof items)[0]) => {
    if (item) {
      setEditingId(item.id);
      setValue("title", item.title);
      setValue("description", item.description || "");
      setValue("imageId", item.image?.id || "");
      setValue("sortOrder", item.sortOrder);
      setValue("isActive", item.isActive);
      originalImageIdRef.current = item.image?.id || null;
      if (item.image) {
        setUploadedFile({
          id: item.image.id,
          url: item.image.url,
          type: item.image.type || "image",
        });
      }
    } else {
      setEditingId(null);
      setUploadedFile(null);
      originalImageIdRef.current = null;
      reset();
    }
    setModalOpen(true);
  };

  const deleteFileById = async (id: string) => {
    try {
      await axiosInstance.delete(`/upload/${id}`);
    } catch {
      toast.error("خطا در حذف فایل قبلی");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setUploadedFile(null);
    originalImageIdRef.current = null;
    reset();
  };

  const handleFileChange = (file: UploadedFile | null) => {
    const oldId = originalImageIdRef.current;
    const currentId = uploadedFile?.id;

    if (oldId && currentId && oldId === currentId && file && file.id !== oldId) {
      deleteFileById(oldId);
    }

    setUploadedFile(file);
    setValue("imageId", file?.id || "");
  };

  const handleFileRemove = () => {
    const oldId = originalImageIdRef.current;
    const currentId = uploadedFile?.id;
    if (oldId && currentId && oldId === currentId) {
      deleteFileById(oldId);
      originalImageIdRef.current = null;
    }
    setUploadedFile(null);
    setValue("imageId", "");
  };

  const onSubmit = (data: GalleryFormData) => {
    if (editingId) {
      updateItem.mutate(
        { id: editingId, data },
        { onSuccess: closeModal }
      );
    } else {
      createItem.mutate(data, { onSuccess: closeModal });
    }
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (!deleteId) return;

    const item = items.find((i) => i.id === deleteId);
    deleteItem.mutate(deleteId, {
      onSuccess: () => {
        if (item?.image?.id) {
          deleteFileById(item.image.id);
        }
      },
    });
    setDeleteId(null);
  };

  const columns = [
    {
      key: "media",
      label: "رسانه",
      render: (item: (typeof items)[0]) => {
        const mediaType = item.image?.type || "image";
        return (
          <div className="w-12 h-12 rounded-lg bg-bg-soft flex items-center justify-center overflow-hidden">
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
              <ImageIcon className="w-6 h-6 text-ink-muted" />
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
          <p className="font-medium text-foreground">{item.title}</p>
          {item.description && (
            <p className="text-xs text-ink-muted line-clamp-1">
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
          <Button variant="ghost" size="sm" onClick={() => openModal(item)}>
            <Edit className="w-4 h-4" />
          </Button>
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
        <h1 className="text-2xl font-bold text-foreground">مدیریت گالری</h1>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4 ml-2" />
          آیتم جدید
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
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

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingId ? "ویرایش آیتم" : "آیتم جدید"}
        className="max-w-xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="عنوان"
            error={errors.title?.message}
            {...register("title")}
          />
          <Textarea
            label="توضیحات (اختیاری)"
            error={errors.description?.message}
            {...register("description")}
          />

          <FileUpload
            value={uploadedFile}
            onChange={handleFileChange}
            onRemove={handleFileRemove}
            label="تصویر یا ویدیو"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="ترتیب نمایش"
              type="number"
              {...register("sortOrder", { valueAsNumber: true })}
            />
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isActive"
                {...register("isActive")}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-foreground">
                فعال
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={closeModal}>
              انصراف
            </Button>
            <Button type="submit" isLoading={createItem.isPending || updateItem.isPending}>
              {editingId ? "بروزرسانی" : "ایجاد"}
            </Button>
          </div>
        </form>
      </Modal>

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
