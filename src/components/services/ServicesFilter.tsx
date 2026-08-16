"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Paintbrush } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { Pagination } from "@/components/ui/Pagination";

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

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  duration: number;
  image: string | null;
  category: { id: string; name: string; slug: string };
}

interface ServicesResponse {
  items: Service[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ServicesFilterProps {
  categories: Category[];
  categorySlug?: string;
}

export function ServicesFilter({ categories, categorySlug }: ServicesFilterProps) {
  const router = useRouter();
  const initialCategoryId = categorySlug
    ? categories.find((c) => c.slug === categorySlug)?.id ?? ""
    : "";

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [page, setPage] = useState(1);
  const limit = 9;

  const handleCategoryChange = (newCategoryId: string) => {
    setCategoryId(newCategoryId);
    setPage(1);
    const slug = categories.find((c) => c.id === newCategoryId)?.slug;
    const url = slug ? `/services?category=${slug}` : "/services";
    router.replace(url, { scroll: false });
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["services", { search, categoryId, page, limit }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (categoryId) params.set("categoryId", categoryId);
      params.set("page", String(page));
      params.set("limit", String(limit));
      const { data } = await axiosInstance.get(`/services?${params.toString()}`);
      return data.data as ServicesResponse;
    },
    placeholderData: keepPreviousData,
  });

  return (
    <div>
      {/* ─── Filter Bar ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col sm:flex-row gap-4 mb-12"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-primary)]/60" aria-hidden="true" />
          <input
            type="text"
            placeholder="جستجوی خدمات..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[var(--color-ink)]/10 bg-[var(--color-bg)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]/40 transition-all duration-300 shadow-[0_4px_20px_-8px_rgba(124,58,237,0.08)]"
            aria-label="جستجوی خدمات"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-primary)]/60 pointer-events-none" aria-hidden="true" />
          <select
            value={categoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="appearance-none pl-10 pr-10 py-3.5 rounded-2xl border border-[var(--color-ink)]/10 bg-[var(--color-bg)] text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]/40 transition-all duration-300 shadow-[0_4px_20px_-8px_rgba(124,58,237,0.08)] cursor-pointer"
            aria-label="دسته‌بندی خدمات"
          >
            <option value="">همه دسته‌بندی‌ها</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* ─── Results ─── */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            aria-label="در حال بارگذاری"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="bg-[var(--color-bg)] rounded-3xl p-6 shadow-[0_4px_20px_-8px_rgba(124,58,237,0.06)]"
              >
                <div className="h-48 bg-gradient-to-br from-[var(--color-bg-soft)] to-[var(--color-primary)]/5 rounded-2xl mb-4 animate-pulse" />
                <div className="h-4 bg-gradient-to-r from-[var(--color-bg-soft)] to-[var(--color-primary)]/5 rounded w-3/4 mb-3 animate-pulse" />
                <div className="h-3 bg-gradient-to-r from-[var(--color-bg-soft)] to-[var(--color-primary)]/5 rounded w-1/2 animate-pulse" />
              </motion.div>
            ))}
          </motion.div>
        ) : !data || data.items.length === 0 ? (
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
            <p className="text-[var(--color-ink-muted)] text-lg">خدماتی یافت نشد</p>
            <p className="text-[var(--color-ink-muted)]/60 text-sm mt-2">
              جستجوی خود را تغییر دهید یا فیلتر دیگری انتخاب کنید
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={`page-${page}-${search}-${categoryId}`}
            variants={stagger}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={isFetching ? "opacity-50 pointer-events-none" : "transition-opacity duration-300"}
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.items.map((service, i) => (
                <motion.a
                  key={service.id}
                  href={`/services/${service.slug}`}
                  variants={cardVariant}
                  custom={i}
                  whileHover={{ y: -8, transition: { duration: 0.25, ease: "easeOut" } }}
                  className="group bg-[var(--color-bg)] rounded-3xl overflow-hidden shadow-[0_10px_40px_-15px_rgba(124,58,237,0.1)] hover:shadow-[0_20px_50px_-15px_rgba(124,58,237,0.18)] transition-shadow duration-300"
                >
                  <div className="h-52 bg-[var(--color-bg-soft)] overflow-hidden relative">
                    {service.image ? (
                      <Image
                        src={service.image}
                        alt={service.name}
                        width={400}
                        height={200}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--color-ink-muted)]">
                        بدون تصویر
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-primary)]/40" />
                      <span className="text-xs text-[var(--color-primary)] font-medium">{service.category.name}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-primary)] transition-colors duration-300">
                      {service.name}
                    </h3>
                    <p
                      className="text-sm text-[var(--color-ink-muted)] mt-2 line-clamp-3 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: service.description?.replace(/<[^>]*>/g, "") || "",
                      }}
                    />
                    <span className="inline-flex items-center text-sm font-medium text-[var(--color-primary)] mt-4 mb-2 float-left px-3 py-1.5 rounded-full bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 transition-all duration-300">
                      توضیحات بیشتر
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <Pagination
                currentPage={data?.page ?? 1}
                totalPages={data?.totalPages ?? 1}
                onPageChange={setPage}
                className="mt-12"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

