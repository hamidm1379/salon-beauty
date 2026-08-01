"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Search,
  FolderPlus,
  X,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import { ResponsiveTable } from "@/components/admin/ResponsiveTable";
import { useAdminServices, useDeleteService } from "@/hooks/use-admin-services";
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/use-admin-categories";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  image: string;
  sortOrder: number;
  isActive: boolean;
}

export default function AdminServicesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    data: CategoryFormData;
  } | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryFormData>({
    name: "",
    slug: "",
    description: "",
    image: "",
    sortOrder: 0,
    isActive: true,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: servicesData, isLoading } = useAdminServices({
    search: search || undefined,
    categoryId: categoryFilter || undefined,
    page,
    limit: 10,
  });

  const { data: categoriesData } = useAdminCategories();
  const deleteService = useDeleteService();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const services = servicesData?.items || [];
  const totalPages = servicesData?.totalPages || 1;
  const categories = categoriesData?.items || [];

  const handleDeleteService = (id: string) => {
    if (confirm("آیا از حذف این سرویس اطمینان دارید؟")) {
      deleteService.mutate(id);
    }
  };

  const handleDeleteCategory = (id: string, name: string, serviceCount: number) => {
    if (serviceCount > 0) {
      toast.error(`دسته‌بندی "${name}" دارای ${serviceCount} سرویس است و قابل حذف نیست`);
      return;
    }
    if (confirm(`آیا از حذف دسته‌بندی "${name}" اطمینان دارید؟`)) {
      deleteCategory.mutate(id);
    }
  };

  const openCategoryModal = (category?: (typeof categories)[0]) => {
    if (category) {
      setEditingCategory({
        id: category.id,
        data: {
          name: category.name,
          slug: category.slug,
          description: category.description || "",
          image: category.image || "",
          sortOrder: category.sortOrder,
          isActive: category.isActive,
        },
      });
      setCategoryForm({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        image: category.image || "",
        sortOrder: category.sortOrder,
        isActive: category.isActive,
      });
      setSlugManuallyEdited(true);
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: "",
        slug: "",
        description: "",
        image: "",
        sortOrder: 0,
        isActive: true,
      });
      setSlugManuallyEdited(false);
    }
    setCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setCategoryModalOpen(false);
    setEditingCategory(null);
    setCategoryForm({
      name: "",
      slug: "",
      description: "",
      image: "",
      sortOrder: 0,
      isActive: true,
    });
  };

  const handleCategoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", categoryForm.name || "category");

      const { data } = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success && data.data?.url) {
        setCategoryForm((prev) => ({ ...prev, image: data.data.url }));
      }
    } catch {
      // Error handled silently
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmitCategory = () => {
    if (!categoryForm.name.trim()) return;

    const data = {
      name: categoryForm.name.trim(),
      slug: categoryForm.slug || undefined,
      description: categoryForm.description || undefined,
      image: categoryForm.image || undefined,
      sortOrder: categoryForm.sortOrder,
      isActive: categoryForm.isActive,
    };

    if (editingCategory) {
      updateCategory.mutate({ id: editingCategory.id, data }, { onSuccess: closeCategoryModal });
    } else {
      createCategory.mutate(data, { onSuccess: closeCategoryModal });
    }
  };

  const serviceColumns = [
    {
      key: "name",
      label: "نام",
      render: (service: (typeof services)[0]) => (
        <div className="flex items-center gap-3">
          {service.image ? (
            <Image
              src={service.image}
              alt={service.name}
              width={48}
              height={48}
              sizes="48px"
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-soft)] flex items-center justify-center">
              <span className="text-xs text-[var(--color-ink-muted)]">بدون عکس</span>
            </div>
          )}
          <div>
            <p className="font-medium text-[var(--color-ink)]">{service.name}</p>
            <p className="text-xs text-[var(--color-ink-muted)]">/{service.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "دسته‌بندی",
      render: (service: (typeof services)[0]) => (
        <Badge variant="default">{service.category.name}</Badge>
      ),
    },
    {
      key: "price",
      label: "قیمت",
      render: (service: (typeof services)[0]) => (
        <span className="font-medium">{service.price.toLocaleString("fa-IR")} تومان</span>
      ),
    },
    {
      key: "duration",
      label: "مدت زمان",
      render: (service: (typeof services)[0]) => <span>{service.duration} دقیقه</span>,
    },
    {
      key: "isActive",
      label: "وضعیت",
      render: (service: (typeof services)[0]) => (
        <Badge variant={service.isActive ? "success" : "warning"}>
          {service.isActive ? "فعال" : "غیرفعال"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "عملیات",
      render: (service: (typeof services)[0]) => (
        <div className="flex items-center gap-2">
          <Link href={`/admin/services/edit/${service.id}`}>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteService(service.id)}
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--color-ink)]">مدیریت سرویس‌ها</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="gap-2" onClick={() => openCategoryModal()}>
            <FolderPlus className="w-4 h-4" />
            دسته‌بندی جدید
          </Button>
          <Link href="/admin/services/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              سرویس جدید
            </Button>
          </Link>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[var(--color-ink)]">دسته‌بندی‌ها</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-2 bg-[var(--color-bg-soft)] rounded-xl px-3 py-2"
                >
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      width={24}
                      height={24}
                      sizes="24px"
                      className="w-6 h-6 rounded object-cover"
                    />
                  ) : null}
                  <span className="text-sm font-medium text-[var(--color-ink)]">{cat.name}</span>
                  <span className="text-xs text-[var(--color-ink-muted)]">
                    ({cat._count?.services || 0})
                  </span>
                  <button
                    onClick={() => openCategoryModal(cat)}
                    className="p-1 rounded hover:bg-[var(--color-bg)] transition-colors"
                  >
                    <Edit className="w-3 h-3 text-[var(--color-ink-muted)]" />
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteCategory(cat.id, cat.name, cat._count?.services || 0)
                    }
                    className="p-1 rounded hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search & Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="relative w-full flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-ink-muted)]" />
              <Input
                placeholder="جستجو در سرویس‌ها..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pr-10"
              />
            </div>
            <div className="w-48!">
              <Select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
                options={[
                  { value: "", label: "همه دسته‌بندی‌ها" },
                  ...categories.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                  })),
                ]}
                className="w-48!"
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
              columns={serviceColumns}
              data={services}
              keyExtractor={(service) => service.id}
              emptyMessage="سرویسی یافت نشد"
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      {/* Category Modal */}
      <Modal
        open={categoryModalOpen}
        onClose={closeCategoryModal}
        title={editingCategory ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}
      >
        <div className="space-y-5">
          {/* Section: Basic Info */}
          <div>
            <h3 className="text-xs font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider mb-3">
              اطلاعات پایه
            </h3>
            <div className="space-y-3">
              <Input
                label="نام دسته‌بندی"
                value={categoryForm.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setCategoryForm((prev) => ({
                    ...prev,
                    name,
                    slug: slugManuallyEdited
                      ? prev.slug
                      : name
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^\w\-]+/g, ""),
                  }));
                }}
                placeholder="مثلاً: پوست و زیبایی"
                required
              />
              <Input
                label="slug"
                value={categoryForm.slug}
                onChange={(e) => {
                  setCategoryForm((prev) => ({ ...prev, slug: e.target.value }));
                  setSlugManuallyEdited(true);
                }}
                placeholder="url-slug"
                dir="ltr"
              />
              <Input
                label="توضیحات (اختیاری)"
                value={categoryForm.description}
                onChange={(e) =>
                  setCategoryForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="توضیح کوتاه درباره دسته‌بندی"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[var(--color-ink)]/5" />

          {/* Section: Image */}
          <div>
            <h3 className="text-xs font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider mb-3">
              تصویر دسته‌بندی
            </h3>
            <div
              onClick={() => !uploadingImage && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
                categoryForm.image
                  ? "border-[var(--color-primary)]/30"
                  : "border-gray-200 hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/5"
              } ${uploadingImage ? "pointer-events-none opacity-60" : ""}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleCategoryImageUpload}
                className="hidden"
              />

              {categoryForm.image ? (
                <div className="relative aspect-[16/10]">
                  <Image
                    src={categoryForm.image}
                    alt="پیش‌نمایش"
                    fill
                    sizes="100%"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 text-[var(--color-ink)] text-xs font-medium hover:bg-white transition"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        تغییر تصویر
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCategoryForm((prev) => ({ ...prev, image: "" }));
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/90 text-white text-xs font-medium hover:bg-red-500 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                        حذف
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
                <div className="py-10 text-center">
                  {uploadingImage ? (
                    <Loader2 className="w-10 h-10 mx-auto text-[var(--color-primary)] animate-spin mb-3" />
                  ) : (
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--color-bg-soft)] flex items-center justify-center mb-3">
                      <ImageIcon className="w-6 h-6 text-[var(--color-ink-muted)]" />
                    </div>
                  )}
                  <p className="text-sm font-medium text-[var(--color-ink)]">
                    {uploadingImage ? "در حال آپلود..." : "کلیک کنید یا تصویر را بکشید"}
                  </p>
                  <p className="text-xs text-[var(--color-ink-muted)] mt-1">
                    PNG, JPG, WebP (حداکثر ۱۰ مگابایت)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[var(--color-ink)]/5" />

          {/* Section: Settings */}
          <div>
            <h3 className="text-xs font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider mb-3">
              تنظیمات
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="ترتیب نمایش"
                type="number"
                value={categoryForm.sortOrder}
                onChange={(e) =>
                  setCategoryForm((prev) => ({
                    ...prev,
                    sortOrder: Number(e.target.value),
                  }))
                }
              />
              <div>
                <label className="block text-sm font-medium text-[var(--color-ink)] mb-2">
                  وضعیت
                </label>
                <button
                  type="button"
                  onClick={() => setCategoryForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
                  className={`relative w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 transition-all duration-300 ${
                    categoryForm.isActive
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 bg-gray-50 text-gray-500"
                  }`}
                >
                  <div
                    className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${
                      categoryForm.isActive ? "bg-emerald-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${
                        categoryForm.isActive ? "right-0.5" : "right-[calc(100%-1.125rem)]"
                      }`}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {categoryForm.isActive ? "فعال" : "غیرفعال"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-[var(--color-ink)]/5">
            <Button type="button" variant="ghost" onClick={closeCategoryModal}>
              انصراف
            </Button>
            <Button
              onClick={handleSubmitCategory}
              isLoading={createCategory.isPending || updateCategory.isPending}
            >
              {editingCategory ? "بروزرسانی" : "ایجاد"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
