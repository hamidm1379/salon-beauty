import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export class UserRepository {
  async findMany(args: Prisma.UserFindManyArgs) {
    return prisma.user.findMany(args);
  }

  async count(args: Prisma.UserCountArgs) {
    return prisma.user.count(args);
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  }
}

export const userRepository = new UserRepository();
