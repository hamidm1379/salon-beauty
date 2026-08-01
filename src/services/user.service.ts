import { userRepository } from "@/repositories/user.repository";
import type { User } from "@/generated/prisma/client";
import type { Role } from "@/dto";

type UserResponse = Omit<User, "passwordHash">;

interface PaginatedUsers {
  items: UserResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class UserService {
  async list(input: {
    role?: Role;
    search?: string;
    page: number;
    limit: number;
  }): Promise<PaginatedUsers> {
    const { role, search, page, limit } = input;
    const where: Record<string, unknown> = {};

    if (role) where.role = role;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [items, total] = await Promise.all([
      userRepository.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          avatar: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      userRepository.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getById(id: string): Promise<UserResponse | null> {
    const user = await userRepository.findById(id);
    if (!user) return null;

    const userWithoutPassword = { ...user };
    delete (userWithoutPassword as Record<string, unknown>).passwordHash;
    return userWithoutPassword as UserResponse;
  }

  async updateRole(id: string, role: Role): Promise<UserResponse> {
    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new Error("User not found");
    }

    const updated = await userRepository.update(id, { role });
    const userWithoutPassword = { ...updated };
    delete (userWithoutPassword as Record<string, unknown>).passwordHash;
    return userWithoutPassword as UserResponse;
  }

  async delete(id: string): Promise<void> {
    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new Error("User not found");
    }
    await userRepository.delete(id);
  }
}

export const userService = new UserService();
