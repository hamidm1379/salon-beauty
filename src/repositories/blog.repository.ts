import { prisma } from "@/lib/prisma";
import type { Blog, Prisma } from "@/generated/prisma/client";

export type BlogWithRelations = Blog & {
  blogCategory: { id: string; name: string; slug: string };
  image: { id: string; url: string; alt: string | null } | null;
};

export class BlogRepository {
  async findMany(args: Prisma.BlogFindManyArgs): Promise<BlogWithRelations[]> {
    return prisma.blog.findMany(args) as Promise<BlogWithRelations[]>;
  }

  async count(args: Prisma.BlogCountArgs) {
    return prisma.blog.count(args);
  }

  async findById(id: string): Promise<BlogWithRelations | null> {
    return prisma.blog.findUnique({
      where: { id },
      include: { blogCategory: true, image: true },
    }) as Promise<BlogWithRelations | null>;
  }

  async findBySlug(slug: string): Promise<BlogWithRelations | null> {
    return prisma.blog.findUnique({
      where: { slug },
      include: { blogCategory: true, image: true },
    }) as Promise<BlogWithRelations | null>;
  }

  async findRelated(postId: string, blogCategoryId: string, limit = 3): Promise<BlogWithRelations[]> {
    return prisma.blog.findMany({
      where: {
        id: { not: postId },
        blogCategoryId,
        published: true,
      },
      include: { blogCategory: true, image: true },
      take: limit,
      orderBy: { createdAt: "desc" },
    }) as Promise<BlogWithRelations[]>;
  }

  async create(data: Prisma.BlogCreateInput): Promise<BlogWithRelations> {
    return prisma.blog.create({
      data,
      include: { blogCategory: true, image: true },
    }) as Promise<BlogWithRelations>;
  }

  async update(id: string, data: Prisma.BlogUpdateInput): Promise<BlogWithRelations> {
    return prisma.blog.update({
      where: { id },
      data,
      include: { blogCategory: true, image: true },
    }) as Promise<BlogWithRelations>;
  }

  async delete(id: string) {
    return prisma.blog.delete({ where: { id } });
  }
}

export const blogRepository = new BlogRepository();
