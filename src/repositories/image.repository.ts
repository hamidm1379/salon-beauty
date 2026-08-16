import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export class ImageRepository {
  async create(data: Prisma.ImageCreateInput) {
    return prisma.image.create({ data });
  }

  async findById(id: string) {
    return prisma.image.findUnique({ where: { id } });
  }

  async findByUrl(url: string) {
    return prisma.image.findFirst({ where: { url } });
  }

  async delete(id: string) {
    return prisma.image.delete({ where: { id } });
  }
}

export const imageRepository = new ImageRepository();
