"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2,
  Search,
  FileText,
  Calendar,
  Tag,
  FolderPlus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import {
  useBlogPosts,
  useDeleteBlogPost,
  useUpdateBlogPost,
} from "@/hooks/use-blog";
import {
  useBlogCategories,
  useCreateBlogCategory,
} from "@/hooks/use-blog-categories";

export default function AdminBlogPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");

  const { data: postsData, isLoading } = useBlogPosts({
    blogCategoryId: selectedCategory || undefined,
    search: search || undefined,
    page,
    limit: 10,
  });

  const { data: categoriesData } = useBlogCategories();
  const deletePost = useDeleteBlogPost();
  const updatePost = useUpdateBlogPost();
  const createCategory = useCreateBlogCategory();

  const posts = postsData?.items || [];
  const totalPages = postsData?.totalPages || 1;
  const totalPosts = postsData?.total || 0;
  const categories = categoriesData?.items || [];

  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.filter((p) => !p.published).length;

  const handleDelete = (id: string) => {
    if (confirm("آیا از حذف این پست اطمینان دارید؟")) {
      deletePost.mutate(id);
    }
  };

  const handleTogglePublish = (id: string, currentStatus: boolean) => {
    updatePost.mutate({
      id,
      data: { published: !currentStatus },
    });
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    createCategory.mutate(
      { name: newCategoryName.trim(), description: newCategoryDesc.trim() || undefined },
      {
        onSuccess: () => {
          setNewCategoryName("");
          setNewCategoryDesc("");
          setShowCategoryModal(false);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-ink)]">مدیریت بلاگ</h1>
          <p className="text-sm text-[var(--color-ink-muted)] mt-1">
            ایجاد و مدیریت مقالات بلاگ
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            className="gap-2"
            onClick={() => setShowCategoryModal(true)}
          >
            <FolderPlus className="w-4 h-4" />
            دسته‌بندی جدید
          </Button>
          <Link href="/admin/blog/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              پست جدید
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "کل پست‌ها", value: totalPosts, icon: FileText, color: "var(--color-primary)" },
          { label: "منتشر شده", value: publishedCount, icon: Eye, color: "#22c55e" },
          { label: "پیش‌نویس", value: draftCount, icon: FileText, color: "#f59e0b" },
          { label: "دسته‌بندی", value: categories.length, icon: Tag, color: "#8b5cf6" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--color-ink)]">{stat.value}</p>
                  <p className="text-xs text-[var(--color-ink-muted)]">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-ink-muted)]" />
              <Input
                placeholder="جستجو در عنوان، خلاصه..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pr-10"
              />
            </div>
            <div className="w-full sm:w-56">
              <Select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
                options={[
                  { value: "", label: "همه دسته‌بندی‌ها" },
                  ...categories.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                  })),
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="py-20 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-bg-soft)] flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-[var(--color-ink-muted)]" />
            </div>
            <p className="text-[var(--color-ink-muted)] text-lg">پستی یافت نشد</p>
            <p className="text-sm text-[var(--color-ink-muted)] mt-2">
              برای شروع، پست جدیدی ایجاد کنید
            </p>
            <Link href="/admin/blog/new" className="mt-6 inline-block">
              <Button>
                <Plus className="w-4 h-4 ml-2" />
                پست جدید
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-ink)]/10">
                  <th className="text-right text-xs font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider px-5 py-3.5">
                    مقاله
                  </th>
                  <th className="text-right text-xs font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider px-5 py-3.5 hidden md:table-cell">
                    دسته‌بندی
                  </th>
                  <th className="text-right text-xs font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider px-5 py-3.5 hidden lg:table-cell">
                    تاریخ
                  </th>
                  <th className="text-center text-xs font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider px-5 py-3.5">
                    وضعیت
                  </th>
                  <th className="text-center text-xs font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider px-5 py-3.5">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-ink)]/5">
                <AnimatePresence>
                  {posts.map((post, index) => (
                    <motion.tr
                      key={post.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="group hover:bg-[var(--color-bg-soft)]/50 transition-colors"
                    >
                      {/* Title + thumbnail */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-12 rounded-lg overflow-hidden bg-[var(--color-bg-soft)] shrink-0 border border-[var(--color-ink)]/5">
                            {post.coverImage || post.image?.url ? (
                              <Image
                                src={post.image?.url || post.coverImage || ""}
                                alt={post.title}
                                width={128}
                                height={96}
                                sizes="128px"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FileText className="w-5 h-5 text-[var(--color-ink-muted)]/40" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/admin/blog/edit/${post.id}`}
                              className="font-semibold text-sm text-[var(--color-ink)] hover:text-[var(--color-primary)] transition-colors line-clamp-1"
                            >
                              {post.title}
                            </Link>
                            {post.excerpt && (
                              <p className="text-xs text-[var(--color-ink-muted)] line-clamp-1 mt-0.5">
                                {post.excerpt}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        <Badge variant="default" className="text-xs">
                          {post.blogCategory.name}
                        </Badge>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-sm text-[var(--color-ink-muted)] flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(post.createdAt).toLocaleDateString("fa-IR")}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => handleTogglePublish(post.id, post.published)}
                          className="inline-flex"
                        >
                          <Badge
                            variant={post.published ? "success" : "warning"}
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                          >
                            {post.published ? "منتشر شده" : "پیش‌نویس"}
                          </Badge>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="مشاهده"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/blog/edit/${post.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="ویرایش"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                            title="حذف"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Add Category Modal */}
      <AnimatePresence>
        {showCategoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowCategoryModal(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-ink)]/10">
                <h3 className="text-lg font-bold text-[var(--color-ink)]">
                  دسته‌بندی جدید
                </h3>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--color-bg-soft)] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4">
                <Input
                  label="نام دسته‌بندی"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="مثلاً: نکات زیبایی"
                  autoFocus
                />
                <Input
                  label="توضیحات (اختیاری)"
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  placeholder="توضیح کوتاه درباره دسته‌بندی"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--color-ink)]/10 bg-[var(--color-bg-soft)]/50">
                <Button
                  variant="ghost"
                  onClick={() => setShowCategoryModal(false)}
                >
                  انصراف
                </Button>
                <Button
                  onClick={handleCreateCategory}
                  disabled={!newCategoryName.trim() || createCategory.isPending}
                >
                  {createCategory.isPending ? (
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 ml-2" />
                  )}
                  ایجاد دسته‌بندی
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
