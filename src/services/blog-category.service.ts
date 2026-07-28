import {
  blogCategoryRepository,
  type BlogCategoryWithCount,
} from "@/repositories/blog-category.repository";

export interface BlogCategoryResponse {
  items: BlogCategoryWithCount[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class BlogCategoryService {
  async list(params: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<BlogCategoryResponse> {
    const { search, page = 1, limit = 100 } = params;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [items, total] = await Promise.all([
      blogCategoryRepository.findMany({
        where,
        include: { _count: { select: { posts: true } } },
        orderBy: { name: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      blogCategoryRepository.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getById(id: string): Promise<BlogCategoryWithCount | null> {
    return blogCategoryRepository.findById(id);
  }

  async create(data: { name: string; slug?: string; description?: string }) {
    const slug = data.slug || this.generateSlug(data.name);
    return blogCategoryRepository.create({
      name: data.name,
      slug,
      description: data.description,
    });
  }

  async update(
    id: string,
    data: { name?: string; slug?: string; description?: string }
  ) {
    return blogCategoryRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await blogCategoryRepository.delete(id);
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }
}

export const blogCategoryService = new BlogCategoryService();
