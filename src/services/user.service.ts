import { userRepository } from "@/repositories/user.repository";
import type {
  ListUsersInput,
  PaginatedResponse,
  ApiResponse,
} from "@/dto";
import type { User } from "@/generated/prisma/client";
import type { Role } from "@/dto";

type UserResponse = Omit<User, "passwordHash">;

export class UserService {
  async list(
    input: ListUsersInput
  ): Promise<ApiResponse<PaginatedResponse<UserResponse>>> {
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
      success: true,
      data: { items, total, page, limit, totalPages: Math.ceil(total / limit) },
      message: "Users retrieved successfully",
    };
  }

  async getById(id: string): Promise<ApiResponse<UserResponse>> {
    const user = await userRepository.findById(id);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const userWithoutPassword = { ...user };
    delete (userWithoutPassword as Record<string, unknown>).passwordHash;
    return {
      success: true,
      data: userWithoutPassword as UserResponse,
      message: "Success",
    };
  }

  async updateRole(
    id: string,
    role: Role
  ): Promise<ApiResponse<UserResponse>> {
    const existing = await userRepository.findById(id);
    if (!existing) {
      return { success: false, message: "User not found" };
    }

    const updated = await userRepository.update(id, { role });
    const userWithoutPassword = { ...updated };
    delete (userWithoutPassword as Record<string, unknown>).passwordHash;

    return {
      success: true,
      data: userWithoutPassword as UserResponse,
      message: "User role updated successfully",
    };
  }
}

export const userService = new UserService();
