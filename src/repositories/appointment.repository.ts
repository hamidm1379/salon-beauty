import { prisma } from "@/lib/prisma";
import type { Appointment, Prisma } from "@/generated/prisma/client";

export type AppointmentWithRelations = Appointment & {
  service: { id: string; name: string; slug: string; price: number; duration: number };
  user: { id: string; name: string; email: string } | null;
};

export class AppointmentRepository {
  async findMany(args: Prisma.AppointmentFindManyArgs): Promise<AppointmentWithRelations[]> {
    return prisma.appointment.findMany(args) as Promise<AppointmentWithRelations[]>;
  }

  async findBookedSlotsByDate(date: Date, serviceId?: string) {
    const where: Prisma.AppointmentWhereInput = {
      date,
      status: { in: ["PENDING", "CONFIRMED"] },
    };
    if (serviceId) where.serviceId = serviceId;
    return prisma.appointment.findMany({
      where,
      select: { time: true, serviceId: true },
    });
  }

  async count(args: Prisma.AppointmentCountArgs) {
    return prisma.appointment.count(args);
  }

  async findById(id: string): Promise<AppointmentWithRelations | null> {
    return prisma.appointment.findUnique({
      where: { id },
      include: { service: true, user: true },
    }) as Promise<AppointmentWithRelations | null>;
  }

  async findByDateAndService(date: Date, time: string, serviceId: string) {
    return prisma.appointment.findFirst({
      where: {
        date,
        time,
        serviceId,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });
  }

  async findByDateRange(start: Date, end: Date, serviceId?: string) {
    const where: Prisma.AppointmentWhereInput = {
      date: { gte: start, lte: end },
      status: { in: ["PENDING", "CONFIRMED"] },
    };
    if (serviceId) where.serviceId = serviceId;
    return prisma.appointment.findMany({ where });
  }

  async create(data: Prisma.AppointmentCreateInput): Promise<AppointmentWithRelations> {
    return prisma.appointment.create({
      data,
      include: { service: true, user: true },
    }) as Promise<AppointmentWithRelations>;
  }

  async update(id: string, data: Prisma.AppointmentUpdateInput): Promise<AppointmentWithRelations> {
    return prisma.appointment.update({
      where: { id },
      data,
      include: { service: true, user: true },
    }) as Promise<AppointmentWithRelations>;
  }
}

export const appointmentRepository = new AppointmentRepository();
