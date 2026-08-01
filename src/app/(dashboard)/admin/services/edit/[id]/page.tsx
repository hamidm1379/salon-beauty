"use client";

import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAdminServices } from "@/hooks/use-admin-services";
import { ServiceForm } from "@/components/admin/ServiceForm";

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: servicesData, isLoading, error } = useAdminServices({ limit: 100 });

  const service = servicesData?.items?.find((s) => s.id === id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--color-ink-muted)]">سرویس یافت نشد</p>
        <button
          onClick={() => router.push("/admin/services")}
          className="mt-4 text-[var(--color-primary)] hover:underline"
        >
          بازگشت به لیست سرویس‌ها
        </button>
      </div>
    );
  }

  return <ServiceForm mode="edit" initialData={service} serviceId={id} />;
}
