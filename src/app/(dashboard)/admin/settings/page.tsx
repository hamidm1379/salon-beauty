"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, Upload, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { useSettings, useUpdateSettings } from "@/hooks/use-settings";
import axiosInstance from "@/lib/axios";

const settingsSchema = z.object({
  salonName: z.string().min(1, "نام سالن الزامی است"),
  salonAddress: z.string().optional(),
  salonPhone: z.string().optional(),
  salonMobile: z.string().optional(),
  salonEmail: z.string().email("ایمیل نامعتبر است").optional().or(z.literal("")),
  workingHours: z.string().optional(),
  logoUrl: z.string().optional(),
  instagram: z.string().url("لینک نامعتبر است").optional().or(z.literal("")),
  telegram: z.string().url("لینک نامعتبر است").optional().or(z.literal("")),
  whatsapp: z.string().optional(),
  rubika: z.string().optional(),
  bale: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  seoOgImage: z.string().optional(),
  seoFavicon: z.string().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function AdminSettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isDirty },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  const watchedLogoUrl = useWatch({ control, name: "logoUrl" });

  const logoPreview = watchedLogoUrl || null;

  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const onSubmit = (data: SettingsFormData) => {
    const hasChanges = Object.keys(data).some((key) => {
      return data[key as keyof SettingsFormData] !== settings?.[key];
    });
    if (!hasChanges) {
      toast("تغییری اعمال نشده است", { icon: "ℹ️" });
      return;
    }
    updateSettings.mutate(data, {
      onSuccess: () => {
        toast.success("تنظیمات با موفقیت بروزرسانی شد");
      },
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", "logo");

      const { data } = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const result = data.data;
      setValue("logoUrl", result.url, { shouldDirty: true });
    } catch {
      toast.error("خطا در آپلود لوگو");
    } finally {
      setIsUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  const handleLogoDelete = async () => {
    const currentUrl = watchedLogoUrl;
    setValue("logoUrl", "", { shouldDirty: true });

    if (currentUrl && currentUrl.startsWith("/uploads/")) {
      try {
        const filename = currentUrl.split("/").pop();
        const imageId = filename?.split("-")[0];
        if (imageId) {
          await axiosInstance.delete(`/upload/${imageId}`).catch(() => {});
        }
      } catch {
        // silent
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--color-ink)]">تنظیمات</h1>
        {isDirty && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            تغییرات ذخیره نشده
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="general">
          <TabsList className="mb-6">
            <TabsTrigger value="general">اطلاعات کلی</TabsTrigger>
            <TabsTrigger value="social">شبکه‌های اجتماعی</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* ─── General Tab ─── */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-[var(--color-ink)]">
                  اطلاعات سالن
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-ink)] mb-1.5">
                    لوگو
                  </label>
                  {logoPreview ? (
                    <div className="relative inline-block">
                      <Image
                        src={logoPreview}
                        alt="لوگوی سالن"
                        width={120}
                        height={120}
                        className="w-32 h-32 object-contain rounded-2xl border border-[var(--color-ink)]/10 bg-[var(--color-bg-soft)]"
                      />
                      <div className="absolute -top-2 -left-2 flex gap-1">
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          className="p-1.5 rounded-full bg-[var(--color-primary)] text-white hover:opacity-90 transition shadow-md"
                        >
                          <Upload className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleLogoDelete}
                          className="p-1.5 rounded-full bg-red-500 text-white hover:opacity-90 transition shadow-md"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => logoInputRef.current?.click()}
                      className="relative flex flex-col items-center justify-center w-32 h-32 rounded-2xl border-2 border-dashed border-[var(--color-ink)]/15 hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-bg-soft)] cursor-pointer transition-all"
                    >
                      {isUploadingLogo ? (
                        <Loader2 className="w-6 h-6 text-[var(--color-primary)] animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-[var(--color-primary)]/60 mb-1" />
                          <span className="text-xs text-[var(--color-ink-muted)]">آپلود لوگو</span>
                        </>
                      )}
                    </div>
                  )}
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>

                <Input
                  label="نام سالن"
                  error={errors.salonName?.message}
                  {...register("salonName")}
                />
                <Textarea
                  label="آدرس"
                  error={errors.salonAddress?.message}
                  {...register("salonAddress")}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="تلفن ثابت"
                    error={errors.salonPhone?.message}
                    {...register("salonPhone")}
                  />
                  <Input
                    label="موبایل"
                    placeholder="0912-123-4567"
                    dir="ltr"
                    error={errors.salonMobile?.message}
                    {...register("salonMobile")}
                  />
                  <Input
                    label="ایمیل"
                    type="email"
                    error={errors.salonEmail?.message}
                    {...register("salonEmail")}
                  />
                </div>
                <Input
                  label="ساعات کاری"
                  error={errors.workingHours?.message}
                  {...register("workingHours")}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Social Tab ─── */}
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-[var(--color-ink)]">
                  شبکه‌های اجتماعی
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="لینک Instagram"
                  placeholder="https://instagram.com/..."
                  error={errors.instagram?.message}
                  {...register("instagram")}
                />
                <Input
                  label="لینک Telegram"
                  placeholder="https://t.me/..."
                  error={errors.telegram?.message}
                  {...register("telegram")}
                />
                <Input
                  label="لینک WhatsApp"
                  placeholder="https://wa.me/989121234567"
                  dir="ltr"
                  error={errors.whatsapp?.message}
                  {...register("whatsapp")}
                />
                <Input
                  label="لینک Rubika"
                  placeholder="https://rubika.ir/..."
                  dir="ltr"
                  error={errors.rubika?.message}
                  {...register("rubika")}
                />
                <Input
                  label="لینک Bale"
                  placeholder="https://ble.ir/..."
                  dir="ltr"
                  error={errors.bale?.message}
                  {...register("bale")}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── SEO Tab ─── */}
          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-[var(--color-ink)]">
                  تنظیمات SEO
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="عنوان پیش‌فرض (Title)"
                  error={errors.seoTitle?.message}
                  {...register("seoTitle")}
                />
                <Textarea
                  label="توضیحات پیش‌فرض (Description)"
                  error={errors.seoDescription?.message}
                  {...register("seoDescription")}
                />
                <Textarea
                  label="کلمات کلیدی (با کاما جدا کنید)"
                  error={errors.seoKeywords?.message}
                  {...register("seoKeywords")}
                />
                <Input
                  label="تصویر Open Graph (OG Image)"
                  placeholder="URL تصویر OG"
                  dir="ltr"
                  error={errors.seoOgImage?.message}
                  {...register("seoOgImage")}
                />
                <Input
                  label="آدرس Favicon"
                  placeholder="URL favicon"
                  dir="ltr"
                  error={errors.seoFavicon?.message}
                  {...register("seoFavicon")}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            isLoading={updateSettings.isPending}
            disabled={!isDirty}
          >
            <Save className="w-4 h-4 ml-2" />
            ذخیره تنظیمات
          </Button>
        </div>
      </form>
    </div>
  );
}
