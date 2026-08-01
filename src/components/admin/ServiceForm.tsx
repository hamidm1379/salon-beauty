"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Loader2,
  Upload,
  X,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardContent } from "@/components/ui/Card";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import {
  useCreateService,
  useUpdateService,
  type Service,
} from "@/hooks/use-admin-services";
import { useAdminCategories } from "@/hooks/use-admin-categories";
import axiosInstance from "@/lib/axios";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

interface ServiceFormProps {
  mode: "create" | "edit";
  initialData?: Service;
  serviceId?: string;
}

export function ServiceForm({ mode, initialData, serviceId }: ServiceFormProps) {
  const router = useRouter();
  const { data: categoriesData } = useAdminCategories();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const categories = categoriesData?.items || [];

  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price || 0);
  const [duration, setDuration] = useState(initialData?.duration || 0);
  const [categoryId, setCategoryId] = useState(initialData?.category?.id || "");
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder || 0);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [image, setImage] = useState(initialData?.image || "");
  const [video, setVideo] = useState(initialData?.video || "");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", name || "service image");

      const { data } = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success && data.data?.url) {
        setImage(data.data.url);
      } else {
        setUploadError(data.message || "خطا در آپلود تصویر");
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "خطا در آپلود تصویر");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", name || "service video");

      const { data } = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success && data.data?.url) {
        setVideo(data.data.url);
      } else {
        setUploadError(data.message || "خطا در آپلود ویدیو");
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "خطا در آپلود ویدیو");
    } finally {
      setUploadingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name,
      slug: slug || undefined,
      description: description || undefined,
      price,
      duration,
      categoryId,
      sortOrder,
      isActive,
      image: image || undefined,
      video: video || undefined,
    };

    if (mode === "edit" && serviceId) {
      updateService.mutate(
        { id: serviceId, data },
        { onSuccess: () => router.push("/admin/services") }
      );
    } else {
      createService.mutate(data as Parameters<typeof createService.mutate>[0], {
        onSuccess: () => router.push("/admin/services"),
      });
    }
  };

  const isSubmitting = createService.isPending || updateService.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/services">
            <Button variant="ghost" size="sm">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-[var(--color-ink)]">
            {mode === "create" ? "سرویس جدید" : "ویرایش سرویس"}
          </h1>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 ml-2 animate-spin" />
          ) : null}
          {mode === "create" ? "ایجاد سرویس" : "ذخیره تغییرات"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="space-y-4">
              <Input
                label="نام سرویس"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slugManuallyEdited) setSlug(slugify(e.target.value));
                }}
                placeholder="نام سرویس را وارد کنید"
                required
              />
              <Input
                label="slug"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugManuallyEdited(true);
                }}
                placeholder="url-slug"
                dir="ltr"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="قیمت (تومان)"
                  type="number"
                  value={price || ""}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                />
                <Input
                  label="مدت زمان (دقیقه)"
                  type="number"
                  value={duration || ""}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <label className="block text-sm font-medium text-[var(--color-ink)] mb-2">
                توضیحات
              </label>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="توضیحات سرویس را بنویسید..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardContent className="space-y-4">
              <Select
                label="دسته‌بندی"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                options={categories.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                }))}
                placeholder="انتخاب دسته‌بندی"
                required
              />

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

          {/* Image Upload */}
          <Card>
            <CardContent className="space-y-4">
              <label className="block text-sm font-medium text-[var(--color-ink)]">
                تصویر سرویس
              </label>

              <div
                onClick={() => !uploadingImage && fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
                  image
                    ? "border-[var(--color-primary)]/30"
                    : "border-gray-300 hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/5"
                } ${uploadingImage ? "pointer-events-none opacity-60" : ""}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {image ? (
                  <div className="relative aspect-video">
                    <Image
                      src={image}
                      alt="پیش‌نمایش"
                      fill
                      sizes="100%"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition"
                        >
                          <Upload className="w-4 h-4 text-[var(--color-ink)]" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImage("");
                          }}
                          className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    {uploadingImage ? (
                      <Loader2 className="w-10 h-10 mx-auto text-[var(--color-primary)] animate-spin mb-3" />
                    ) : (
                      <ImageIcon className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                    )}
                    <p className="text-sm text-[var(--color-ink-muted)]">
                      {uploadingImage ? "در حال آپلود..." : "کلیک کنید یا تصویر را بکشید"}
                    </p>
                    <p className="text-xs text-[var(--color-ink-muted)] mt-1">
                      PNG, JPG, WebP (حداکثر ۱۰ مگابایت)
                    </p>
                  </div>
                )}
              </div>

              <Input
                label="یا آدرس تصویر را وارد کنید"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                dir="ltr"
              />
            </CardContent>
          </Card>

          {/* Video Upload */}
          <Card>
            <CardContent className="space-y-4">
              <label className="block text-sm font-medium text-[var(--color-ink)]">
                ویدیو سرویس (اختیاری)
              </label>

              <div
                onClick={() => !uploadingVideo && videoInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
                  video
                    ? "border-[var(--color-primary)]/30"
                    : "border-gray-300 hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/5"
                } ${uploadingVideo ? "pointer-events-none opacity-60" : ""}`}
              >
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime"
                  onChange={handleVideoUpload}
                  className="hidden"
                />

                {video ? (
                  <div className="relative aspect-video">
                    <video
                      src={video}
                      className="w-full h-full object-cover"
                      controls
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            videoInputRef.current?.click();
                          }}
                          className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition"
                        >
                          <Upload className="w-4 h-4 text-[var(--color-ink)]" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setVideo("");
                          }}
                          className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                    {uploadingVideo && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    {uploadingVideo ? (
                      <Loader2 className="w-10 h-10 mx-auto text-[var(--color-primary)] animate-spin mb-3" />
                    ) : (
                      <Video className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                    )}
                    <p className="text-sm text-[var(--color-ink-muted)]">
                      {uploadingVideo ? "در حال آپلود..." : "کلیک کنید یا ویدیو را بکشید"}
                    </p>
                    <p className="text-xs text-[var(--color-ink-muted)] mt-1">
                      MP4, WebM, OGG (حداکثر ۵۰ مگابایت)
                    </p>
                  </div>
                )}
              </div>

              <Input
                label="یا آدرس ویدیو را وارد کنید"
                value={video}
                onChange={(e) => setVideo(e.target.value)}
                placeholder="https://example.com/video.mp4"
                dir="ltr"
              />
            </CardContent>
          </Card>

          {uploadError && (
            <p className="text-sm text-red-500">{uploadError}</p>
          )}
        </div>
      </div>
    </form>
  );
}
