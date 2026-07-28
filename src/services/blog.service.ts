import {
  blogRepository,
  type BlogWithRelations,
} from "@/repositories/blog.repository";
import type {
  CreateBlogInput,
  ListBlogInput,
  PaginatedResponse,
  ApiResponse,
} from "@/dto";

export class BlogService {
  async list(
    input: ListBlogInput
  ): Promise<PaginatedResponse<BlogWithRelations>> {
    const { published, blogCategoryId, search, page, limit } = input;
    const where: Record<string, unknown> = {};

    if (published !== undefined) where.published = published;
    if (blogCategoryId) where.blogCategoryId = blogCategoryId;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const [items, total] = await Promise.all([
      blogRepository.findMany({
        where,
        include: {
          blogCategory: { select: { id: true, name: true, slug: true } },
          image: { select: { id: true, url: true, alt: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      blogRepository.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getById(id: string): Promise<BlogWithRelations | null> {
    return blogRepository.findById(id);
  }

  async getBySlug(slug: string): Promise<BlogWithRelations | null> {
    return blogRepository.findBySlug(slug);
  }

  async getRelated(id: string): Promise<BlogWithRelations[]> {
    const post = await blogRepository.findById(id);
    if (!post) return [];
    return blogRepository.findRelated(id, post.blogCategoryId, 3);
  }

  async create(input: CreateBlogInput): Promise<BlogWithRelations> {
    if (!input.blogCategoryId) {
      throw new Error("Blog category is required");
    }

    const existingSlug = await blogRepository.findBySlug(input.slug);
    if (existingSlug) {
      throw new Error("A post with this slug already exists");
    }

    return blogRepository.create({
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      coverImage: input.coverImage,
      published: input.published ?? false,
      publishedAt: input.published ? new Date() : null,
      primaryKeyword: input.primaryKeyword,
      secondaryKeyword: input.secondaryKeyword,
      blogCategory: { connect: { id: input.blogCategoryId } },
      image: input.imageId ? { connect: { id: input.imageId } } : undefined,
    });
  }

  async update(
    id: string,
    input: Partial<CreateBlogInput>
  ): Promise<BlogWithRelations> {
    const existing = await blogRepository.findById(id);
    if (!existing) {
      throw new Error("Blog post not found");
    }

    if (input.slug && input.slug !== existing.slug) {
      const slugExists = await blogRepository.findBySlug(input.slug);
      if (slugExists) {
        throw new Error("A post with this slug already exists");
      }
    }

    const data: Record<string, unknown> = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.slug !== undefined) data.slug = input.slug;
    if (input.excerpt !== undefined) data.excerpt = input.excerpt || null;
    if (input.content !== undefined) data.content = input.content;
    if (input.coverImage !== undefined) data.coverImage = input.coverImage || null;
    if (input.primaryKeyword !== undefined) data.primaryKeyword = input.primaryKeyword || null;
    if (input.secondaryKeyword !== undefined) data.secondaryKeyword = input.secondaryKeyword || null;
    if (input.published !== undefined) {
      data.published = input.published;
      if (input.published && !existing.published) {
        data.publishedAt = new Date();
      }
    }
    if (input.blogCategoryId !== undefined && input.blogCategoryId) {
      data.blogCategory = { connect: { id: input.blogCategoryId } };
    }
    if (input.imageId !== undefined) {
      data.image = input.imageId ? { connect: { id: input.imageId } } : { disconnect: true };
    }

    try {
      const result = await blogRepository.update(id, data as never);
      return result;
    } catch (dbError) {
      throw dbError;
    }
  }

  async delete(id: string): Promise<void> {
    const existing = await blogRepository.findById(id);
    if (!existing) {
      throw new Error("Blog post not found");
    }
    await blogRepository.delete(id);
  }
}

export const blogService = new BlogService();
