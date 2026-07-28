import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export class ContactMessageRepository {
  async findMany(args: Prisma.ContactMessageFindManyArgs) {
    return prisma.contactMessage.findMany(args);
  }

  async count(args: Prisma.ContactMessageCountArgs) {
    return prisma.contactMessage.count(args);
  }

  async findById(id: string) {
    return prisma.contactMessage.findUnique({ where: { id } });
  }

  async create(data: Prisma.ContactMessageCreateInput) {
    return prisma.contactMessage.create({ data });
  }

  async markAsRead(id: string) {
    return prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async delete(id: string) {
    return prisma.contactMessage.delete({ where: { id } });
  }
}

export const contactMessageRepository = new ContactMessageRepository();
