import {
  appointmentRepository,
  type AppointmentWithRelations,
} from "@/repositories/appointment.repository";
import type {
  CreateAppointmentInput,
  ListAppointmentsInput,
  PaginatedResponse,
  ApiResponse,
} from "@/dto";
import type { AppointmentStatus } from "@/dto";

export class AppointmentService {
  async list(
    input: ListAppointmentsInput
  ): Promise<ApiResponse<PaginatedResponse<AppointmentWithRelations>>> {
    const { status, serviceId, dateFrom, dateTo, page, limit } = input;
    const where: Record<string, unknown> = {};

    if (status) where.status = status;
    if (serviceId) where.serviceId = serviceId;
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) (where.date as Record<string, Date>).gte = new Date(dateFrom);
      if (dateTo) (where.date as Record<string, Date>).lte = new Date(dateTo);
    }

    const [items, total] = await Promise.all([
      appointmentRepository.findMany({
        where,
        include: { service: { select: { id: true, name: true, slug: true, price: true, duration: true } }, user: { select: { id: true, name: true, email: true } } },
        orderBy: { date: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      appointmentRepository.count({ where }),
    ]);

    return {
      success: true,
      data: { items, total, page, limit, totalPages: Math.ceil(total / limit) },
      message: "Appointments retrieved successfully",
    };
  }

  async getById(id: string): Promise<ApiResponse<AppointmentWithRelations>> {
    const appointment = await appointmentRepository.findById(id);
    if (!appointment) {
      return { success: false, message: "Appointment not found" };
    }
    return { success: true, data: appointment, message: "Success" };
  }

  async checkAvailability(
    date: string,
    time: string,
    serviceId: string
  ): Promise<ApiResponse<{ available: boolean }>> {
    const existing = await appointmentRepository.findByDateAndService(
      new Date(date),
      time,
      serviceId
    );
    return {
      success: true,
      data: { available: !existing },
      message: existing ? "Time slot is not available" : "Time slot is available",
    };
  }

  async create(
    input: CreateAppointmentInput
  ): Promise<ApiResponse<AppointmentWithRelations>> {
    const dateObj = new Date(input.date);
    if (dateObj <= new Date()) {
      return { success: false, message: "Date must be in the future" };
    }

    const conflict = await appointmentRepository.findByDateAndService(
      dateObj,
      input.time,
      input.serviceId
    );
    if (conflict) {
      return {
        success: false,
        message: "This time slot is already booked",
      };
    }

    const appointment = await appointmentRepository.create({
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      date: dateObj,
      time: input.time,
      notes: input.notes,
      service: { connect: { id: input.serviceId } },
      user: input.userId ? { connect: { id: input.userId } } : undefined,
    });

    return {
      success: true,
      data: appointment,
      message: "Appointment created successfully",
    };
  }

  async updateStatus(
    id: string,
    status: AppointmentStatus
  ): Promise<ApiResponse<AppointmentWithRelations>> {
    const existing = await appointmentRepository.findById(id);
    if (!existing) {
      return { success: false, message: "Appointment not found" };
    }

    const updated = await appointmentRepository.update(id, { status });
    return {
      success: true,
      data: updated,
      message: `Appointment ${status.toLowerCase()} successfully`,
    };
  }

  async cancel(id: string): Promise<ApiResponse<AppointmentWithRelations>> {
    return this.updateStatus(id, "CANCELLED");
  }

  async confirm(id: string): Promise<ApiResponse<AppointmentWithRelations>> {
    return this.updateStatus(id, "CONFIRMED");
  }

  async getAvailableSlots(
    date: string,
    serviceId: string
  ): Promise<ApiResponse<{ time: string; available: boolean }[]>> {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return { success: false, message: "Invalid date" };
    }

    const booked = await appointmentRepository.findBookedSlotsByDate(dateObj, serviceId);
    const bookedTimes = new Set(booked.map((b) => b.time));

    const slots: { time: string; available: boolean }[] = [];
    const startHour = 9;
    const endHour = 19;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const time = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
        slots.push({ time, available: !bookedTimes.has(time) });
      }
    }

    return {
      success: true,
      data: slots,
      message: "Available slots retrieved successfully",
    };
  }
}

export const appointmentService = new AppointmentService();
