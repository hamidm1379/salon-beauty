"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { useSettings, useUpdateSettings } from "@/hooks/use-settings";

const settingsSchema = z.object({
  salonName: z.string().min(1, "نام سالن الزامی است"),
  salonAddress: z.string().optional(),
  salonPhone: z.string().optional(),
  salonEmail: z.string().email("ایمیل نامعتبر است").optional().or(z.literal("")),
  workingHours: z.string().optional(),
  instagram: z.string().url("لینک نامعتبر است").optional().or(z.literal("")),
  telegram: z.string().url("لینک نامعتبر است").optional().or(z.literal("")),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function AdminSettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const onSubmit = (data: SettingsFormData) => {
    updateSettings.mutate(data);
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
          <Badge variant="warning">تغییرات ذخیره نشده</Badge>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="general">
          <TabsList className="mb-6">
            <TabsTrigger value="general">اطلاعات کلی</TabsTrigger>
            <TabsTrigger value="social">شبکه‌های اجتماعی</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-[var(--color-ink)]">
                  اطلاعات سالن
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="تلفن"
                    error={errors.salonPhone?.message}
                    {...register("salonPhone")}
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-[var(--color-ink)]">
                  تنظیمات SEO
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="عنوان پیش‌فرض"
                  error={errors.seoTitle?.message}
                  {...register("seoTitle")}
                />
                <Textarea
                  label="توضیحات پیش‌فرض"
                  error={errors.seoDescription?.message}
                  {...register("seoDescription")}
                />
                <Textarea
                  label="کلمات کلیدی (با کاما جدا کنید)"
                  error={errors.seoKeywords?.message}
                  {...register("seoKeywords")}
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

function Badge({ variant, children }: { variant: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
      variant === "warning" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"
    }`}>
      {children}
    </span>
  );
}
