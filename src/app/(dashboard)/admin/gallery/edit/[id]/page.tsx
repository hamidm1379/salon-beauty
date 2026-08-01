"use client";

import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAdminGallery } from "@/hooks/use-admin-gallery";
import { GalleryForm } from "@/components/admin/GalleryForm";

export default function EditGalleryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: galleryData, isLoading, error } = useAdminGallery({ limit: 100 });

  const item = galleryData?.items?.find((i) => i.id === id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--color-ink-muted)]">آیتم یافت نشد</p>
        <button
          onClick={() => router.push("/admin/gallery")}
          className="mt-4 text-[var(--color-primary)] hover:underline"
        >
          بازگشت به لیست گالری
        </button>
      </div>
    );
  }

  return <GalleryForm mode="edit" initialData={item} itemId={id} />;
}
