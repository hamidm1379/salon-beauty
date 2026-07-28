"use client";

import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useBlogPosts } from "@/hooks/use-blog";
import { BlogForm } from "@/components/admin/BlogForm";

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: postsData, isLoading, error } = useBlogPosts({ limit: 100 });

  const post = postsData?.items?.find((p) => p.id === id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--color-ink-muted)]">پست یافت نشد</p>
        <button
          onClick={() => router.push("/admin/blog")}
          className="mt-4 text-[var(--color-primary)] hover:underline"
        >
          بازگشت به لیست بلاگ
        </button>
      </div>
    );
  }

  return <BlogForm mode="edit" initialData={post} postId={id} />;
}
