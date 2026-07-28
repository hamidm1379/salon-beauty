import { prisma } from "@/lib/prisma";
import type { Prisma, Service } from "@/generated/prisma/client";

export type ServiceWithCategory = Service & {
  category: { id: string; name: string; slug: string };
};

export class ServiceRepository {
  async findMany(
    args: Prisma.ServiceFindManyArgs
  ): Promise<ServiceWithCategory[]> {
    return prisma.service.findMany(args) as Promise<ServiceWithCategory[]>;
  }

  async count(args: Prisma.ServiceCountArgs): Promise<number> {
    return prisma.service.count(args);
  }

  async findById(id: string): Promise<ServiceWithCategory | null> {
    return prisma.service.findUnique({
      where: { id },
      include: { category: { select: { id: true, name: true, slug: true } } },
    }) as Promise<ServiceWithCategory | null>;
  }

  async findBySlug(slug: string): Promise<ServiceWithCategory | null> {
    return prisma.service.findUnique({
      where: { slug },
      include: { category: { select: { id: true, name: true, slug: true } } },
    }) as Promise<ServiceWithCategory | null>;
  }

  async create(data: Prisma.ServiceCreateInput): Promise<ServiceWithCategory> {
    return prisma.service.create({
      data,
      include: { category: { select: { id: true, name: true, slug: true } } },
    }) as Promise<ServiceWithCategory>;
  }

  async update(
    id: string,
    data: Prisma.ServiceUpdateInput
  ): Promise<ServiceWithCategory> {
    return prisma.service.update({
      where: { id },
      data,
      include: { category: { select: { id: true, name: true, slug: true } } },
    }) as Promise<ServiceWithCategory>;
  }

  async delete(id: string): Promise<void> {
    await prisma.service.delete({ where: { id } });
  }
}

export const serviceRepository = new ServiceRepository();
