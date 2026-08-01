import { contactMessageRepository } from "@/repositories/contact-message.repository";
import type {
  CreateContactMessageInput,
  ListContactMessagesInput,
  PaginatedResponse,
} from "@/dto";
import type { ContactMessage } from "@/generated/prisma/client";

type ContactMessageResponse = ContactMessage;

export class ContactMessageService {
  async list(
    input: ListContactMessagesInput
  ): Promise<PaginatedResponse<ContactMessageResponse>> {
    const { isRead, page, limit } = input;
    const where: Record<string, unknown> = {};
    if (isRead !== undefined) where.isRead = isRead;

    const [items, total] = await Promise.all([
      contactMessageRepository.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      contactMessageRepository.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getById(id: string): Promise<ContactMessageResponse | null> {
    return contactMessageRepository.findById(id);
  }

  async create(
    input: CreateContactMessageInput
  ): Promise<ContactMessageResponse> {
    return contactMessageRepository.create({
      name: input.name,
      email: input.email,
      phone: input.phone,
      subject: input.subject,
      message: input.message,
    });
  }

  async markAsRead(id: string): Promise<ContactMessageResponse> {
    return contactMessageRepository.markAsRead(id);
  }

  async delete(id: string): Promise<void> {
    await contactMessageRepository.delete(id);
  }
}

export const contactMessageService = new ContactMessageService();
