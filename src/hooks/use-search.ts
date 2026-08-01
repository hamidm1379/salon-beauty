"use client";

import { useDeferredValue } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

interface SearchResultService {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  category: { id: string; name: string; slug: string };
}

interface SearchResultBlog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  blogCategory: { id: string; name: string; slug: string };
}

async function searchServices(query: string): Promise<SearchResultService[]> {
  const { data } = await axiosInstance.get("/services", {
    params: { search: query, isActive: true, limit: 20 },
  });
  return data.data.items;
}

async function searchBlog(query: string): Promise<SearchResultBlog[]> {
  const { data } = await axiosInstance.get("/blog", {
    params: { search: query, published: true, limit: 20 },
  });
  return data.data.items;
}

export function useSearch(rawQuery: string) {
  const trimmed = rawQuery.trim();
  const query = useDeferredValue(trimmed);
  const enabled = query.length >= 2;

  const servicesQuery = useQuery({
    queryKey: ["search", "services", query],
    queryFn: () => searchServices(query),
    enabled,
    staleTime: 60 * 1000,
  });

  const blogQuery = useQuery({
    queryKey: ["search", "blog", query],
    queryFn: () => searchBlog(query),
    enabled,
    staleTime: 60 * 1000,
  });

  const isLoading = enabled && (servicesQuery.isLoading || blogQuery.isLoading);
  const services = servicesQuery.data || [];
  const blog = blogQuery.data || [];
  const hasResults = services.length > 0 || blog.length > 0;
  const isInitial = !enabled;
  const noResults = enabled && !isLoading && !hasResults;

  return { services, blog, isLoading, hasResults, isInitial, noResults, query };
}

export type { SearchResultService, SearchResultBlog };
