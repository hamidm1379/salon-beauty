import { commentRepository, type CommentWithService } from "@/repositories/comment.repository";
import { AppError } from "@/lib/errors";

export interface CreateCommentInput {
  name: string;
  phone: string;
  content: string;
  serviceId: string;
  parentId?: string;
}

export interface ReplyCommentInput {
  name: string;
  content: string;
  serviceId: string;
  parentId: string;
}

export interface ListCommentsInput {
  serviceId?: string;
  isApproved?: boolean;
  page: number;
  limit: number;
}

export interface PaginatedComments {
  items: CommentWithService[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class CommentService {
  async list(input: ListCommentsInput): Promise<PaginatedComments> {
    const { serviceId, isApproved, page, limit } = input;
    const where: Record<string, unknown> = {};
    if (serviceId) where.serviceId = serviceId;
    if (isApproved !== undefined) where.isApproved = isApproved;
    where.parentId = null;

    const [items, total] = await Promise.all([
      commentRepository.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      commentRepository.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async listAll(input: ListCommentsInput): Promise<PaginatedComments> {
    const { serviceId, isApproved, page, limit } = input;
    const where: Record<string, unknown> = {};
    if (serviceId) where.serviceId = serviceId;
    if (isApproved !== undefined) where.isApproved = isApproved;

    const [items, total] = await Promise.all([
      commentRepository.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      commentRepository.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getById(id: string): Promise<CommentWithService> {
    const comment = await commentRepository.findById(id);
    if (!comment) {
      throw AppError.notFound("Comment not found");
    }
    return comment;
  }

  async create(input: CreateCommentInput): Promise<CommentWithService> {
    return commentRepository.create({
      name: input.name,
      phone: input.phone,
      content: input.content,
      service: { connect: { id: input.serviceId } },
      ...(input.parentId ? { parent: { connect: { id: input.parentId } } } : {}),
    });
  }

  async reply(input: ReplyCommentInput): Promise<CommentWithService> {
    const parent = await commentRepository.findById(input.parentId);
    if (!parent) {
      throw AppError.notFound("Parent comment not found");
    }
    return commentRepository.create({
      name: input.name,
      phone: "admin",
      content: input.content,
      isApproved: true,
      service: { connect: { id: input.serviceId } },
      parent: { connect: { id: input.parentId } },
    });
  }

  async approve(id: string): Promise<CommentWithService> {
    const existing = await commentRepository.findById(id);
    if (!existing) {
      throw AppError.notFound("Comment not found");
    }
    return commentRepository.update(id, { isApproved: true });
  }

  async reject(id: string): Promise<CommentWithService> {
    const existing = await commentRepository.findById(id);
    if (!existing) {
      throw AppError.notFound("Comment not found");
    }
    return commentRepository.update(id, { isApproved: false });
  }

  async delete(id: string): Promise<void> {
    const existing = await commentRepository.findById(id);
    if (!existing) {
      throw AppError.notFound("Comment not found");
    }
    await commentRepository.delete(id);
  }
}

export const commentService = new CommentService();
