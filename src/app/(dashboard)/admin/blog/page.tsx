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
  EyeOff,
  Loader2,
  Search,
  FileText,
  Calendar,
  Tag,
  MoreVertical,
  PenLine,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import {
  useBlogPosts,
  useDeleteBlogPost,
  useUpdateBlogPost,
} from "@/hooks/use-blog";
import { useBlogCategories } from "@/hooks/use-blog-categories";

export default function AdminBlogPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const { data: postsData, isLoading } = useBlogPosts({
    blogCategoryId: selectedCategory || undefined,
    search: search || undefined,
    page,
    limit: 12,
  });

  const { data: categoriesData } = useBlogCategories();
  const deletePost = useDeleteBlogPost();
  const updatePost = useUpdateBlogPost();

  const posts = postsData?.items || [];
  const totalPages = postsData?.totalPages || 1;
  const totalPosts = postsData?.total || 0;
  const categories = categoriesData?.items || [];

  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.filter((p) => !p.published).length;

  const handleDelete = (id: string) => {
    if (confirm("آیا از حذف این پست اطمینان دارید؟")) {
      deletePost.mutate(id);
      setActiveMenu(null);
    }
  };

  const handleTogglePublish = (id: string, currentStatus: boolean) => {
    updatePost.mutate({
      id,
      data: { published: !currentStatus },
    });
    setActiveMenu(null);
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
        <Link href="/admin/blog/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            پست جدید
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "کل پست‌ها", value: totalPosts, icon: FileText, color: "var(--color-primary)" },
          { label: "منتشر شده", value: publishedCount, icon: Eye, color: "#22c55e" },
          { label: "پیش‌نویس", value: draftCount, icon: PenLine, color: "#f59e0b" },
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
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
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
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setPage(1);
                }}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  !selectedCategory
                    ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20"
                    : "bg-[var(--color-bg-soft)] text-[var(--color-ink)] hover:bg-[var(--color-primary)]/10"
                }`}
              >
                همه
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setPage(1);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20"
                      : "bg-[var(--color-bg-soft)] text-[var(--color-ink)] hover:bg-[var(--color-primary)]/10"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Grid */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card hover className="group h-full flex flex-col">
                  {/* Cover Image */}
                  <div className="relative aspect-[16/10] overflow-hidden rounded-t-3xl">
                    {post.coverImage || post.image?.url ? (
                      <Image
                        src={post.coverImage || post.image?.url || ""}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 flex items-center justify-center">
                        <PenLine className="w-10 h-10 text-[var(--color-primary)]/30" />
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant={post.published ? "success" : "warning"}
                        className="backdrop-blur-sm"
                      >
                        {post.published ? "منتشر شده" : "پیش‌نویس"}
                      </Badge>
                    </div>

                    {/* Menu Button */}
                    <div className="absolute top-3 left-3">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveMenu(activeMenu === post.id ? null : post.id)
                          }
                          className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition shadow-sm"
                        >
                          <MoreVertical className="w-4 h-4 text-[var(--color-ink)]" />
                        </button>

                        <AnimatePresence>
                          {activeMenu === post.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9, y: -5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: -5 }}
                              className="absolute left-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-[var(--color-ink)]/10 py-1 z-20"
                            >
                              <Link
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-bg-soft)] transition"
                                onClick={() => setActiveMenu(null)}
                              >
                                <Eye className="w-4 h-4" />
                                مشاهده
                              </Link>
                              <button
                                onClick={() =>
                                  handleTogglePublish(post.id, post.published)
                                }
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-bg-soft)] transition"
                              >
                                {post.published ? (
                                  <>
                                    <EyeOff className="w-4 h-4" />
                                    انتشار پیش‌نویس
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-4 h-4" />
                                    انتشار
                                  </>
                                )}
                              </button>
                              <Link
                                href={`/admin/blog/edit/${post.id}`}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-bg-soft)] transition"
                                onClick={() => setActiveMenu(null)}
                              >
                                <Edit className="w-4 h-4" />
                                ویرایش
                              </Link>
                              <hr className="my-1 border-[var(--color-ink)]/5" />
                              <button
                                onClick={() => handleDelete(post.id)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                                حذف
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-5 flex-1 flex flex-col">
                    {/* Category */}
                    <Badge variant="default" className="text-xs w-fit mb-3">
                      {post.blogCategory.name}
                    </Badge>

                    {/* Title */}
                    <h3 className="font-bold text-[var(--color-ink)] line-clamp-2 mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-sm text-[var(--color-ink-muted)] line-clamp-2 mb-4 flex-1">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-[var(--color-ink)]/5 mt-auto">
                      <div className="flex items-center gap-1.5 text-xs text-[var(--color-ink-muted)]">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.createdAt).toLocaleDateString("fa-IR")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/blog/edit/${post.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
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
    </div>
  );
}
