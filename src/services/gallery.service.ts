import {
  galleryRepository,
  type GalleryWithRelations,
} from "@/repositories/gallery.repository";
import type {
  CreateGalleryInput,
  ListGalleryInput,
  PaginatedResponse,
} from "@/dto";
import { AppError } from "@/lib/errors";

export class GalleryService {
  async list(
    input: ListGalleryInput
  ): Promise<PaginatedResponse<GalleryWithRelations>> {
    const { isActive, page, limit } = input;
    const where: Record<string, unknown> = {};
    if (isActive !== undefined) where.isActive = isActive;

    const [items, total] = await Promise.all([
      galleryRepository.findMany({
        where,
        include: { image: { select: { id: true, url: true, type: true, alt: true, width: true, height: true } } },
        orderBy: { sortOrder: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      galleryRepository.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getById(id: string): Promise<GalleryWithRelations> {
    const item = await galleryRepository.findById(id);
    if (!item) {
      throw AppError.notFound("Gallery item not found");
    }
    return item;
  }

  async create(
    input: CreateGalleryInput
  ): Promise<GalleryWithRelations> {
    return galleryRepository.create({
      title: input.title,
      description: input.description,
      sortOrder: input.sortOrder ?? 0,
      isActive: input.isActive ?? true,
      image: input.imageId ? { connect: { id: input.imageId } } : undefined,
    });
  }

  async update(
    id: string,
    input: Partial<CreateGalleryInput>
  ): Promise<GalleryWithRelations> {
    const existing = await galleryRepository.findById(id);
    if (!existing) {
      throw AppError.notFound("Gallery item not found");
    }

    const data: Record<string, unknown> = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.description !== undefined) data.description = input.description;
    if (input.sortOrder !== undefined) data.sortOrder = input.sortOrder;
    if (input.isActive !== undefined) data.isActive = input.isActive;
    if (input.imageId !== undefined) {
      data.image = input.imageId ? { connect: { id: input.imageId } } : { disconnect: true };
    }

    return galleryRepository.update(id, data as never);
  }

  async delete(id: string): Promise<void> {
    const existing = await galleryRepository.findById(id);
    if (!existing) {
      throw AppError.notFound("Gallery item not found");
    }
    await galleryRepository.delete(id);
  }
}

export const galleryService = new GalleryService();
