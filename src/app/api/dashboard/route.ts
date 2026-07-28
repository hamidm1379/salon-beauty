import { prisma } from "@/lib/prisma";
import { successResponse, handleApiError } from "@/utils/api-response";
import { startOfDay, endOfDay, subDays, format } from "date-fns";

export async function GET() {
  try {
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);

    const [
      todayAppointments,
      pendingAppointments,
      totalServices,
      unreadMessages,
      recentAppointments,
      weeklyData,
    ] = await Promise.all([
      prisma.appointment.count({
        where: {
          date: { gte: todayStart, lte: todayEnd },
          status: { in: ["PENDING", "CONFIRMED"] },
        },
      }),
      prisma.appointment.count({
        where: { status: "PENDING" },
      }),
      prisma.service.count({
        where: { isActive: true },
      }),
      prisma.contactMessage.count({
        where: { isRead: false },
      }),
      prisma.appointment.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          service: { select: { name: true } },
        },
      }),
      Promise.all(
        Array.from({ length: 7 }, async (_, i) => {
          const date = subDays(today, 6 - i);
          const dayStart = startOfDay(date);
          const dayEnd = endOfDay(date);
          const count = await prisma.appointment.count({
            where: {
              date: { gte: dayStart, lte: dayEnd },
            },
          });
          return {
            date: format(date, "MM/dd"),
            count,
          };
        })
      ),
    ]);

    const stats = {
      todayAppointments,
      pendingAppointments,
      totalServices,
      unreadMessages,
      totalBlogViews: 0,
      recentAppointments: recentAppointments.map((apt) => ({
        id: apt.id,
        customerName: apt.customerName,
        date: format(apt.date, "yyyy-MM-dd"),
        time: apt.time,
        status: apt.status,
        service: apt.service,
      })),
      weeklyAppointments: weeklyData,
    };

    return successResponse(stats);
  } catch (error) {
    return handleApiError(error);
  }
}
