"use client";

import { useState } from "react";
import Link from "next/link";

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
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { ResponsiveTable } from "@/components/admin/ResponsiveTable";
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
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    postId: string | null;
  }>({ open: false, postId: null });

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
    setConfirmModal({ open: true, postId: id });
  };

  const confirmDelete = () => {
    if (!confirmModal.postId) return;
    deletePost.mutate(confirmModal.postId);
    setConfirmModal({ open: false, postId: null });
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

  const columns = [
    {
      key: "title",
      label: "مقاله",
      render: (post: (typeof posts)[0]) => (
        <div className="min-w-0">
          <Link
            href={`/admin/blog/edit/${post.id}`}
            className="font-semibold text-sm text-[var(--color-ink)] hover:text-[var(--color-primary)] transition-colors line-clamp-1"
          >
            {post.title}
          </Link>
        </div>
      ),
    },
    {
      key: "category",
      label: "دسته‌بندی",
      render: (post: (typeof posts)[0]) => (
        <Badge variant="default" className="text-xs">
          {post.blogCategory.name}
        </Badge>
      ),
    },
    {
      key: "date",
      label: "تاریخ",
      render: (post: (typeof posts)[0]) => (
        <span className="text-sm text-[var(--color-ink-muted)] flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {new Date(post.createdAt).toLocaleDateString("fa-IR")}
        </span>
      ),
    },
    {
      key: "status",
      label: "وضعیت",
      render: (post: (typeof posts)[0]) => (
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
      ),
    },
    {
      key: "actions",
      label: "عملیات",
      render: (post: (typeof posts)[0]) => (
        <div className="flex items-center gap-1">
          <Link href={`/blog/${post.slug}`} target="_blank">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="مشاهده">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          <Link href={`/admin/blog/edit/${post.id}`}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="ویرایش">
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
      ),
    },
  ];

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
            className="gap-2 max-sm:text-[10px]"
            onClick={() => setShowCategoryModal(true)}
          >
            <FolderPlus className="w-4 h-4" />
            دسته‌بندی جدید
          </Button>
          <Link href="/admin/blog/new">
            <Button className="gap-2 max-sm:text-[10px]">
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
          <CardContent className="p-0">
            <ResponsiveTable
              columns={columns}
              data={posts}
              keyExtractor={(post) => post.id}
              emptyMessage="پستی یافت نشد"
              getMobileImage={(post) => post.image?.url || post.coverImage}
            />
          </CardContent>
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

      {/* Confirm Delete Modal */}
      <Modal
        open={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, postId: null })}
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-[var(--color-ink)] mb-2">
            حذف پست
          </h3>
          <p className="text-sm text-[var(--color-ink-muted)] mb-6 leading-relaxed">
            آیا از حذف این پست اطمینان دارید؟ این عمل قابل بازگشت نیست.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="ghost"
              onClick={() => setConfirmModal({ open: false, postId: null })}
            >
              انصراف
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={confirmDelete}
              isLoading={deletePost.isPending}
            >
              <Trash2 className="w-4 h-4 ml-1.5" />
              حذف
            </Button>
          </div>
        </div>
      </Modal>

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
