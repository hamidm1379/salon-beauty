"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent } from "@/components/ui/Card";
import { FileUpload } from "@/components/admin/FileUpload";
import {
  useCreateGalleryItem,
  useUpdateGalleryItem,
  type GalleryItem,
} from "@/hooks/use-admin-gallery";
import axiosInstance from "@/lib/axios";

interface GalleryFormProps {
  mode: "create" | "edit";
  initialData?: GalleryItem;
  itemId?: string;
}

export function GalleryForm({ mode, initialData, itemId }: GalleryFormProps) {
  const router = useRouter();
  const createItem = useCreateGalleryItem();
  const updateItem = useUpdateGalleryItem();
  const originalImageIdRef = useRef<string | null>(initialData?.image?.id || null);

  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder || 0);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [uploadedFile, setUploadedFile] = useState<{
    id: string;
    url: string;
    type: string;
  } | null>(
    initialData?.image
      ? {
          id: initialData.image.id,
          url: initialData.image.url,
          type: initialData.image.type || "image",
        }
      : null
  );

  const deleteFileById = async (id: string) => {
    try {
      await axiosInstance.delete(`/upload/${id}`);
    } catch {
      // File might not exist
    }
  };

  const handleFileChange = (file: { id: string; url: string; type: string } | null) => {
    const oldId = originalImageIdRef.current;
    const currentId = uploadedFile?.id;

    if (oldId && currentId && oldId === currentId && file && file.id !== oldId) {
      deleteFileById(oldId);
    }

    setUploadedFile(file);
  };

  const handleFileRemove = () => {
    const oldId = originalImageIdRef.current;
    const currentId = uploadedFile?.id;
    if (oldId && currentId && oldId === currentId) {
      deleteFileById(oldId);
      originalImageIdRef.current = null;
    }
    setUploadedFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      title,
      description: description || undefined,
      imageId: uploadedFile?.id || undefined,
      sortOrder,
      isActive,
    };

    if (mode === "edit" && itemId) {
      updateItem.mutate(
        { id: itemId, data },
        { onSuccess: () => router.push("/admin/gallery") }
      );
    } else {
      createItem.mutate(data, {
        onSuccess: () => router.push("/admin/gallery"),
      });
    }
  };

  const isSubmitting = createItem.isPending || updateItem.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/gallery">
            <Button variant="ghost" size="sm">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-[var(--color-ink)]">
            {mode === "create" ? "آیتم جدید" : "ویرایش آیتم"}
          </h1>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 ml-2 animate-spin" />
          ) : null}
          {mode === "create" ? "ایجاد آیتم" : "ذخیره تغییرات"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="space-y-4">
              <Input
                label="عنوان"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="عنوان آیتم را وارد کنید"
                required
              />
              <Textarea
                label="توضیحات (اختیاری)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیحات آیتم را وارد کنید"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardContent className="space-y-4">
              <Input
                label="ترتیب نمایش"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
              />

              <div>
                <label className="block text-sm font-medium text-[var(--color-ink)] mb-3">
                  وضعیت
                </label>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                    isActive
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                      isActive ? "bg-emerald-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                        isActive ? "right-0.5" : "right-[calc(100%-1.375rem)]"
                      }`}
                    />
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-sm font-semibold">
                      {isActive ? "فعال" : "غیرفعال"}
                    </p>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Media Upload */}
          <Card>
            <CardContent className="space-y-4">
              <FileUpload
                value={uploadedFile}
                onChange={handleFileChange}
                onRemove={handleFileRemove}
                label="تصویر یا ویدیو"
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/ogg,video/quicktime"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
