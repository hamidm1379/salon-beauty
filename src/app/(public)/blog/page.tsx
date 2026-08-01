"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Search, BookOpen, Paintbrush } from "lucide-react";
import { Container } from "@/components/ui/Layout";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { BlogHero } from "@/components/blog/BlogHero";
import { useBlogPosts } from "@/hooks/use-blog";
import { useBlogCategories } from "@/hooks/use-blog-categories";

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    y: -16,
    scale: 0.97,
    transition: { duration: 0.25 },
  },
};

export default function BlogPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: postsData, isLoading: postsLoading } = useBlogPosts({
    published: true,
    blogCategoryId: selectedCategory || undefined,
    search: search || undefined,
    page,
    limit: 9,
  });

  const { data: categoriesData } = useBlogCategories();

  const posts = postsData?.items || [];
  const totalPages = postsData?.totalPages || 1;
  const categories: { id: string; name: string; slug: string }[] = categoriesData?.items || [];

  return (
    <>
      <BlogHero />

      <section className="py-16 bg-[var(--color-bg-soft)] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--color-primary)]/[0.04] blur-3xl" />

        <Container className="relative">
          {/* ─── Filter Bar ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col md:flex-row gap-4 mb-12"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-primary)]/60" aria-hidden="true" />
              <input
                type="text"
                placeholder="جستجو در مقالات..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[var(--color-ink)]/10 bg-[var(--color-bg)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]/40 transition-all duration-300 shadow-[0_4px_20px_-8px_rgba(124,58,237,0.08)]"
                aria-label="جستجو در مقالات"
              />
            </div>
            <div className="flex gap-4 items-center">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full md:w-auto px-5 py-3 rounded-2xl text-sm font-medium bg-[var(--color-bg)] text-[var(--color-ink)] border border-[var(--color-ink)]/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]/40 transition-all duration-300 shadow-[0_4px_20px_-8px_rgba(124,58,237,0.08)] appearance-none cursor-pointer"
              >
                <option value="">همه دسته‌بندی‌ها</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* ─── Posts Grid ─── */}
          <AnimatePresence mode="wait">
            {postsLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="bg-[var(--color-bg)] rounded-3xl overflow-hidden shadow-[0_4px_20px_-8px_rgba(124,58,237,0.06)]"
                  >
                    <div className="aspect-video bg-gradient-to-br from-[var(--color-bg-soft)] to-[var(--color-primary)]/5 animate-pulse" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gradient-to-r from-[var(--color-bg-soft)] to-[var(--color-primary)]/5 rounded w-1/3 animate-pulse" />
                      <div className="h-5 bg-gradient-to-r from-[var(--color-bg-soft)] to-[var(--color-primary)]/5 rounded w-3/4 animate-pulse" />
                      <div className="h-3 bg-gradient-to-r from-[var(--color-bg-soft)] to-[var(--color-primary)]/5 rounded w-full animate-pulse" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : posts.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="text-center py-24"
              >
                <div className="w-20 h-20 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-6">
                  <Paintbrush className="w-9 h-9 text-[var(--color-primary)]/50" />
                </div>
                <p className="text-[var(--color-ink-muted)] text-lg">مقاله‌ای یافت نشد</p>
                <p className="text-[var(--color-ink-muted)]/60 text-sm mt-2">
                  جستجوی خود را تغییر دهید یا دسته‌بندی دیگری انتخاب کنید
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={`page-${page}-${search}-${selectedCategory}`}
                variants={stagger}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <motion.div key={post.id} variants={cardVariant}>
                      <Link href={`/blog/${post.slug}`}>
                        <motion.div
                          whileHover={{ y: -8, transition: { duration: 0.25, ease: "easeOut" } }}
                          className="group bg-[var(--color-bg)] rounded-3xl overflow-hidden shadow-[0_10px_40px_-15px_rgba(124,58,237,0.1)] hover:shadow-[0_20px_50px_-15px_rgba(124,58,237,0.18)] transition-shadow duration-300 h-full flex flex-col"
                        >
                          <div className="aspect-video bg-[var(--color-bg-soft)] overflow-hidden relative">
                            {post.image ? (
                              <Image
                                src={post.image.url}
                                alt={post.image.alt || post.title}
                                width={400}
                                height={225}
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                              />
                            ) : post.coverImage ? (
                              <Image
                                src={post.coverImage}
                                alt={post.title}
                                width={400}
                                height={225}
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="w-12 h-12 text-[var(--color-primary)]/20" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>

                          <div className="p-6 flex flex-col flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="default">{post.blogCategory.name}</Badge>
                              <span className="text-xs text-[var(--color-ink-muted)] flex items-center gap-1">
                                <CalendarDays className="w-3 h-3" />
                                {new Date(post.createdAt).toLocaleDateString("fa-IR")}
                              </span>
                            </div>

                            <h3 className="text-lg font-bold text-[var(--color-ink)] mb-2 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors duration-300">
                              {post.title}
                            </h3>

                            {post.excerpt && (
                              <p className="text-sm text-[var(--color-ink-muted)] line-clamp-2 mb-4 leading-relaxed">
                                {post.excerpt}
                              </p>
                            )}

                            <div className="mt-auto pt-2">
                              <span className="inline-flex items-center justify-center w-full py-2.5 rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all duration-300">
                                ادامه مطلب
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                      className="mt-12"
                    />
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </section>
    </>
  );
}
