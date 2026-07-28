import { contactMessageRepository } from "@/repositories/contact-message.repository";
import type {
  CreateContactMessageInput,
  ListContactMessagesInput,
  PaginatedResponse,
  ApiResponse,
} from "@/dto";
import type { ContactMessage } from "@/generated/prisma/client";

type ContactMessageResponse = ContactMessage;

export class ContactMessageService {
  async list(
    input: ListContactMessagesInput
  ): Promise<ApiResponse<PaginatedResponse<ContactMessageResponse>>> {
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

    return {
      success: true,
      data: { items, total, page, limit, totalPages: Math.ceil(total / limit) },
      message: "Contact messages retrieved successfully",
    };
  }

  async getById(id: string): Promise<ApiResponse<ContactMessageResponse>> {
    const message = await contactMessageRepository.findById(id);
    if (!message) {
      return { success: false, message: "Contact message not found" };
    }
    return { success: true, data: message, message: "Success" };
  }

  async create(
    input: CreateContactMessageInput
  ): Promise<ApiResponse<ContactMessageResponse>> {
    const message = await contactMessageRepository.create({
      name: input.name,
      email: input.email,
      phone: input.phone,
      subject: input.subject,
      message: input.message,
    });

    return {
      success: true,
      data: message,
      message: "Message sent successfully",
    };
  }

  async markAsRead(id: string): Promise<ApiResponse<ContactMessageResponse>> {
    const existing = await contactMessageRepository.findById(id);
    if (!existing) {
      return { success: false, message: "Contact message not found" };
    }

    const updated = await contactMessageRepository.markAsRead(id);
    return {
      success: true,
      data: updated,
      message: "Message marked as read",
    };
  }

  async delete(id: string): Promise<ApiResponse<null>> {
    const existing = await contactMessageRepository.findById(id);
    if (!existing) {
      return { success: false, message: "Contact message not found" };
    }

    await contactMessageRepository.delete(id);
    return { success: true, message: "Message deleted successfully" };
  }
}

export const contactMessageService = new ContactMessageService();
