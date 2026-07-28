import { prisma } from "@/lib/prisma";
import type { BlogCategory, Prisma } from "@/generated/prisma/client";

export type BlogCategoryWithCount = BlogCategory & {
  _count: { posts: number };
};

export class BlogCategoryRepository {
  async findMany(
    args: Prisma.BlogCategoryFindManyArgs
  ): Promise<BlogCategoryWithCount[]> {
    return prisma.blogCategory.findMany(args) as Promise<BlogCategoryWithCount[]>;
  }

  async count(args: Prisma.BlogCategoryCountArgs): Promise<number> {
    return prisma.blogCategory.count(args);
  }

  async findById(id: string): Promise<BlogCategoryWithCount | null> {
    return prisma.blogCategory.findUnique({
      where: { id },
      include: { _count: { select: { posts: true } } },
    }) as Promise<BlogCategoryWithCount | null>;
  }

  async findBySlug(slug: string): Promise<BlogCategoryWithCount | null> {
    return prisma.blogCategory.findUnique({
      where: { slug },
      include: { _count: { select: { posts: true } } },
    }) as Promise<BlogCategoryWithCount | null>;
  }

  async create(data: Prisma.BlogCategoryCreateInput): Promise<BlogCategoryWithCount> {
    return prisma.blogCategory.create({
      data,
      include: { _count: { select: { posts: true } } },
    }) as Promise<BlogCategoryWithCount>;
  }

  async update(
    id: string,
    data: Prisma.BlogCategoryUpdateInput
  ): Promise<BlogCategoryWithCount> {
    return prisma.blogCategory.update({
      where: { id },
      data,
      include: { _count: { select: { posts: true } } },
    }) as Promise<BlogCategoryWithCount>;
  }

  async delete(id: string): Promise<void> {
    await prisma.blogCategory.delete({ where: { id } });
  }
}

export const blogCategoryRepository = new BlogCategoryRepository();
