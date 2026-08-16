"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Loader2,
  Upload,
  X,
  Image as ImageIcon,
  Globe,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Card, CardContent } from "@/components/ui/Card";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import {
  useCreateBlogPost,
  useUpdateBlogPost,
  type BlogPost,
} from "@/hooks/use-blog";
import { useBlogCategories } from "@/hooks/use-blog-categories";
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

interface BlogFormProps {
  mode: "create" | "edit";
  initialData?: BlogPost;
  postId?: string;
}

export function BlogForm({ mode, initialData, postId }: BlogFormProps) {
  const router = useRouter();
  const { data: categoriesData } = useBlogCategories();
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = categoriesData?.items || [];

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [blogCategoryId, setBlogCategoryId] = useState(initialData?.blogCategoryId || "");
  const [published, setPublished] = useState(initialData?.published || false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [secondaryKeyword, setSecondaryKeyword] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const displaySlug = slugManuallyEdited ? slug : (title ? slugify(title) : slug);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", title || "blog cover");

      const { data } = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success && data.data?.url) {
        setCoverImage(data.data.url);
      } else {
        setUploadError(data.message || "خطا در آپلود تصویر");
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "خطا در آپلود تصویر");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      title,
      slug,
      excerpt: excerpt || undefined,
      content,
      coverImage: coverImage || undefined,
      blogCategoryId,
      published,
      primaryKeyword: primaryKeyword || undefined,
      secondaryKeyword: secondaryKeyword || undefined,
    };

    if (mode === "create") {
      createPost.mutate(data as Parameters<typeof createPost.mutate>[0], {
        onSuccess: () => {
          router.push("/admin/blog");
        },
      });
    } else if (postId) {
      updatePost.mutate(
        { id: postId, data },
        {
          onSuccess: () => {
            router.push("/admin/blog");
          },
        }
      );
    }
  };

  const isSubmitting = createPost.isPending || updatePost.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/blog">
            <Button variant="ghost" size="sm">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-[var(--color-ink)] max-sm:text-[10px]">
            {mode === "create" ? "پست جدید" : "ویرایش پست"}
          </h1>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 ml-2 animate-spin" />
          ) : null}
          {mode === "create" ? "ایجاد پست" : "ذخیره تغییرات"}
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
                placeholder="عنوان پست را وارد کنید"
                required
              />
              <Input
                label="slug"
                value={displaySlug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugManuallyEdited(true);
                }}
                placeholder="url-slug"
                dir="ltr"
                required
              />
              <Textarea
                label="خلاصه"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="خلاصه‌ای کوتاه از پست (اختیاری)"
                rows={3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="max-sm:p-0">
              <label className="block text-sm font-medium text-[var(--color-ink)] mb-2">
                محتوا
              </label>
              <RichTextEditor
                
                value={content}
                onChange={setContent}
                placeholder="محتوای پست را بنویسید..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Status */}
          <Card>
            <CardContent className="space-y-4">
              <Select
                label="دسته‌بندی"
                value={blogCategoryId}
                onChange={(e) => setBlogCategoryId(e.target.value)}
                options={categories.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                }))}
                placeholder="انتخاب دسته‌بندی"
                required
              />

              <div>
                <label className="block text-sm font-medium text-[var(--color-ink)] mb-3">
                  وضعیت انتشار
                </label>
                <button
                  type="button"
                  onClick={() => setPublished(!published)}
                  className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                    published
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                      published ? "bg-emerald-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                        published ? "right-0.5" : "right-[calc(100%-1.375rem)]"
                      }`}
                    />
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-sm font-semibold">
                      {published ? "منتشر شده" : "پیش‌نویس"}
                    </p>
                    <p className="text-xs opacity-70">
                      {published
                        ? "این پست برای همه قابل مشاهده است"
                        : "این پست فقط برای شما قابل مشاهده است"}
                    </p>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      published ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Cover Image */}
          <Card>
            <CardContent className="space-y-4">
              <label className="block text-sm font-medium text-[var(--color-ink)]">
                عکس کاور
              </label>

              {/* Upload Area */}
              <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
                  coverImage
                    ? "border-[var(--color-primary)]/30"
                    : "border-gray-300 hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/5"
                } ${uploading ? "pointer-events-none opacity-60" : ""}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleUpload}
                  className="hidden"
                />

                {coverImage ? (
                  <div className="relative aspect-video">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coverImage}
                      alt="پیش‌نمایش کاور"
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay */}
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
                            setCoverImage("");
                          }}
                          className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                    {/* Upload indicator */}
                    {uploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    {uploading ? (
                      <Loader2 className="w-10 h-10 mx-auto text-[var(--color-primary)] animate-spin mb-3" />
                    ) : (
                      <ImageIcon className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                    )}
                    <p className="text-sm text-[var(--color-ink-muted)]">
                      {uploading ? "در حال آپلود..." : "کلیک کنید یا تصویر را بکشید"}
                    </p>
                    <p className="text-xs text-[var(--color-ink-muted)] mt-1">
                      PNG, JPG, WebP (حداکثر ۱۰ مگابایت)
                    </p>
                  </div>
                )}
              </div>

              {uploadError && (
                <p className="text-xs text-red-500 mt-2">{uploadError}</p>
              )}

              {/* URL Input */}
              <Input
                label="یا آدرس تصویر را وارد کنید"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                dir="ltr"
              />
            </CardContent>
          </Card>

          {/* SEO Keywords */}
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-[var(--color-primary)]" />
                <label className="text-sm font-medium text-[var(--color-ink)]">
                  کلمات کلیدی SEO
                </label>
              </div>

              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-ink-muted)]" />
                <Input
                  label="کلمه کلیدی اصلی"
                  value={primaryKeyword}
                  onChange={(e) => setPrimaryKeyword(e.target.value)}
                  placeholder="مثلاً: آرایشگاه زنانه"
                  className="pr-10"
                />
              </div>

              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-ink-muted)]" />
                <Input
                  label="کلمه کلیدی فرعی"
                  value={secondaryKeyword}
                  onChange={(e) => setSecondaryKeyword(e.target.value)}
                  placeholder="مثلاً: خدمات زیبایی تهران"
                  className="pr-10"
                />
              </div>

              <p className="text-xs text-[var(--color-ink-muted)]">
                کلمات کلیدی به بهینه‌سازی موتورهای جستجو (SEO) کمک می‌کنند
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
