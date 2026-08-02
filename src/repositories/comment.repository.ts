import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

const commentInclude = {
  service: { select: { id: true, name: true, slug: true } },
  replies: {
    where: { isApproved: true },
    orderBy: { createdAt: "asc" as const },
    select: { id: true, name: true, content: true, createdAt: true, parentId: true },
  },
} satisfies Prisma.CommentInclude;

export type CommentWithService = Prisma.CommentGetPayload<{
  include: typeof commentInclude;
}>;

class CommentRepository {
  async findMany(args: Prisma.CommentFindManyArgs) {
    return prisma.comment.findMany({ ...args, include: commentInclude });
  }

  async findById(id: string) {
    return prisma.comment.findUnique({ where: { id }, include: commentInclude });
  }

  async count(args: Prisma.CommentCountArgs) {
    return prisma.comment.count(args);
  }

  async create(data: Prisma.CommentCreateInput) {
    return prisma.comment.create({ data, include: commentInclude });
  }

  async update(id: string, data: Prisma.CommentUpdateInput) {
    return prisma.comment.update({ where: { id }, data, include: commentInclude });
  }

  async delete(id: string) {
    return prisma.comment.delete({ where: { id } });
  }
}

export const commentRepository = new CommentRepository();
