"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { ResponsiveTable } from "@/components/admin/ResponsiveTable";
import {
  useAdminServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from "@/hooks/use-admin-services";
import { useBlogCategories } from "@/hooks/use-blog-categories";

const serviceSchema = z.object({
  name: z.string().min(1, "نام الزامی است"),
  slug: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive("قیمت باید مثبت باشد"),
  duration: z.number().positive("مدت زمان باید مثبت باشد"),
  categoryId: z.string().min(1, "دسته‌بندی الزامی است"),
  sortOrder: z.number().min(0),
  isActive: z.boolean(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export default function AdminServicesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: servicesData, isLoading } = useAdminServices({
    search: search || undefined,
    page,
    limit: 10,
  });

  const { data: categoriesData } = useBlogCategories();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const services = servicesData?.items || [];
  const totalPages = servicesData?.totalPages || 1;
  const categories = categoriesData?.items || [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      isActive: true,
      sortOrder: 0,
      name: "",
      price: 0,
      duration: 0,
      categoryId: "",
    },
  });

  const openModal = (service?: typeof services[0]) => {
    if (service) {
      setEditingId(service.id);
      setValue("name", service.name);
      setValue("slug", service.slug);
      setValue("description", service.description || "");
      setValue("price", service.price);
      setValue("duration", service.duration);
      setValue("categoryId", service.category.id);
      setValue("sortOrder", service.sortOrder);
      setValue("isActive", service.isActive);
    } else {
      setEditingId(null);
      reset();
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    reset();
  };

  const onSubmit = (data: ServiceFormData) => {
    if (editingId) {
      updateService.mutate(
        { id: editingId, data },
        { onSuccess: closeModal }
      );
    } else {
      createService.mutate(data, { onSuccess: closeModal });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("آیا از حذف این سرویس اطمینان دارید؟")) {
      deleteService.mutate(id);
    }
  };

  const columns = [
    {
      key: "name",
      label: "نام",
      render: (service: typeof services[0]) => (
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
      render: (service: typeof services[0]) => (
        <Badge variant="default">{service.category.name}</Badge>
      ),
    },
    {
      key: "price",
      label: "قیمت",
      render: (service: typeof services[0]) => (
        <span className="font-medium">{service.price.toLocaleString("fa-IR")} تومان</span>
      ),
    },
    {
      key: "duration",
      label: "مدت زمان",
      render: (service: typeof services[0]) => (
        <span>{service.duration} دقیقه</span>
      ),
    },
    {
      key: "isActive",
      label: "وضعیت",
      render: (service: typeof services[0]) => (
        <Badge variant={service.isActive ? "success" : "warning"}>
          {service.isActive ? "فعال" : "غیرفعال"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "عملیات",
      render: (service: typeof services[0]) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => openModal(service)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(service.id)}
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
        <h1 className="text-2xl font-bold text-[var(--color-ink)]">مدیریت سرویس‌ها</h1>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4 ml-2" />
          سرویس جدید
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="جستجو در سرویس‌ها..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
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
              data={services}
              keyExtractor={(service) => service.id}
              emptyMessage="سرویسی یافت نشد"
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
        title={editingId ? "ویرایش سرویس" : "سرویس جدید"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="نام سرویس"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="Slug (اختیاری)"
            error={errors.slug?.message}
            {...register("slug")}
          />
          <Input
            label="توضیحات (اختیاری)"
            error={errors.description?.message}
            {...register("description")}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="قیمت (تومان)"
              type="number"
              error={errors.price?.message}
              {...register("price", { valueAsNumber: true })}
            />
            <Input
              label="مدت زمان (دقیقه)"
              type="number"
              error={errors.duration?.message}
              {...register("duration", { valueAsNumber: true })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-ink)] mb-2">
              دسته‌بندی
            </label>
            <select
              {...register("categoryId")}
              className="w-full px-4 py-3 rounded-xl border bg-white text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors"
            >
              <option value="">انتخاب کنید</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-500">{errors.categoryId.message}</p>
            )}
          </div>
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
                className="w-4 h-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-[var(--color-ink)]">
                فعال
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={closeModal}>
              انصراف
            </Button>
            <Button type="submit" isLoading={createService.isPending || updateService.isPending}>
              {editingId ? "بروزرسانی" : "ایجاد"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
