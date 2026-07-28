import { prisma } from "@/lib/prisma";
import type { Gallery, Prisma } from "@/generated/prisma/client";

export type GalleryWithRelations = Gallery & {
  image: { id: string; url: string; alt: string | null; width: number | null; height: number | null } | null;
};

export class GalleryRepository {
  async findMany(args: Prisma.GalleryFindManyArgs): Promise<GalleryWithRelations[]> {
    return prisma.gallery.findMany(args) as Promise<GalleryWithRelations[]>;
  }

  async count(args: Prisma.GalleryCountArgs) {
    return prisma.gallery.count(args);
  }

  async findById(id: string): Promise<GalleryWithRelations | null> {
    return prisma.gallery.findUnique({
      where: { id },
      include: { image: true },
    }) as Promise<GalleryWithRelations | null>;
  }

  async create(data: Prisma.GalleryCreateInput): Promise<GalleryWithRelations> {
    return prisma.gallery.create({
      data,
      include: { image: true },
    }) as Promise<GalleryWithRelations>;
  }

  async update(id: string, data: Prisma.GalleryUpdateInput): Promise<GalleryWithRelations> {
    return prisma.gallery.update({
      where: { id },
      data,
      include: { image: true },
    }) as Promise<GalleryWithRelations>;
  }

  async delete(id: string) {
    return prisma.gallery.delete({ where: { id } });
  }
}

export const galleryRepository = new GalleryRepository();
