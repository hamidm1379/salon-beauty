import path from "path";
import fs from "fs/promises";
import { categoryRepository, type CategoryWithCount } from "@/repositories/category.repository";
import { AppError } from "@/lib/errors";
import {
  CreateCategorySchema,
  UpdateCategorySchema,
  ListCategoriesSchema,
  type CreateCategoryInput,
  type UpdateCategoryInput,
  type ListCategoriesInput,
  type CategoryResponseDTO,
  type PaginatedCategoriesResponseDTO,
} from "@/dto/category.dto";

function toResponseDTO(category: CategoryWithCount): CategoryResponseDTO {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image,
    isActive: category.isActive,
    sortOrder: category.sortOrder,
    _count: category._count,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function deleteFileIfExists(url: string | null): Promise<void> {
  if (!url) return;
  try {
    const filePath = path.join(process.cwd(), "public", url);
    await fs.unlink(filePath);
  } catch {
    // File might not exist or already deleted
  }
  if (url.startsWith("/uploads/")) {
    const dir = path.dirname(url);
    const filename = path.basename(url);
    const thumbPath = path.join(process.cwd(), "public", dir, `thumb-${filename}`);
    try {
      await fs.unlink(thumbPath);
    } catch {
      // Thumbnail might not exist
    }
  }
}

export class CategoryService {
  async list(input: ListCategoriesInput): Promise<PaginatedCategoriesResponseDTO> {
    const params = ListCategoriesSchema.parse(input);
    const { isActive, search, page, limit, sortBy, sortOrder } = params;

    const where: Record<string, unknown> = {};
    if (isActive !== undefined) where.isActive = isActive;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const orderBy: Record<string, string> = {};
    if (sortBy === "name" || sortBy === "createdAt") {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.sortOrder = sortOrder;
    }

    const [items, total] = await Promise.all([
      categoryRepository.findMany({
        where,
        include: { _count: { select: { services: true } } },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      categoryRepository.count({ where }),
    ]);

    return {
      items: items.map(toResponseDTO),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getById(id: string): Promise<CategoryResponseDTO> {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw AppError.notFound("Category not found");
    }
    return toResponseDTO(category);
  }

  async getBySlug(slug: string): Promise<CategoryResponseDTO> {
    const category = await categoryRepository.findBySlug(slug);
    if (!category) {
      throw AppError.notFound("Category not found");
    }
    return toResponseDTO(category);
  }

  async create(input: CreateCategoryInput): Promise<CategoryResponseDTO> {
    const data = CreateCategorySchema.parse(input);

    const slug = data.slug || generateSlug(data.name);

    const existingSlug = await categoryRepository.findBySlug(slug);
    if (existingSlug) {
      throw AppError.conflict("A category with this slug already exists");
    }

    const category = await categoryRepository.create({
      name: data.name,
      slug,
      description: data.description,
      image: data.image,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
    });

    return toResponseDTO(category);
  }

  async update(id: string, input: UpdateCategoryInput): Promise<CategoryResponseDTO> {
    const existing = await categoryRepository.findById(id);
    if (!existing) {
      throw AppError.notFound("Category not found");
    }

    const data = UpdateCategorySchema.parse(input);

    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await categoryRepository.findBySlug(data.slug);
      if (slugExists) {
        throw AppError.conflict("A category with this slug already exists");
      }
    }

    // Delete old image if a new one is provided and different
    if (data.image !== undefined && data.image !== existing.image) {
      await deleteFileIfExists(existing.image);
    }

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const category = await categoryRepository.update(id, updateData as never);
    return toResponseDTO(category);
  }

  async delete(id: string): Promise<void> {
    const existing = await categoryRepository.findById(id);
    if (!existing) {
      throw AppError.notFound("Category not found");
    }
    await deleteFileIfExists(existing.image);
    await categoryRepository.delete(id);
  }
}

export const categoryService = new CategoryService();
