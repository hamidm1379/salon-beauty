import { prisma } from "@/lib/prisma";
import type { Category, Prisma } from "@/generated/prisma/client";

export type CategoryWithCount = Category & {
  _count: { services: number };
};

export class CategoryRepository {
  async findMany(
    args: Prisma.CategoryFindManyArgs
  ): Promise<CategoryWithCount[]> {
    return prisma.category.findMany(args) as Promise<CategoryWithCount[]>;
  }

  async count(args: Prisma.CategoryCountArgs): Promise<number> {
    return prisma.category.count(args);
  }

  async findById(id: string): Promise<CategoryWithCount | null> {
    return prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { services: true } } },
    }) as Promise<CategoryWithCount | null>;
  }

  async findBySlug(slug: string): Promise<CategoryWithCount | null> {
    return prisma.category.findUnique({
      where: { slug },
      include: { _count: { select: { services: true } } },
    }) as Promise<CategoryWithCount | null>;
  }

  async create(data: Prisma.CategoryCreateInput): Promise<CategoryWithCount> {
    return prisma.category.create({
      data,
      include: { _count: { select: { services: true } } },
    }) as Promise<CategoryWithCount>;
  }

  async update(
    id: string,
    data: Prisma.CategoryUpdateInput
  ): Promise<CategoryWithCount> {
    return prisma.category.update({
      where: { id },
      data,
      include: { _count: { select: { services: true } } },
    }) as Promise<CategoryWithCount>;
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({ where: { id } });
  }
}

export const categoryRepository = new CategoryRepository();
