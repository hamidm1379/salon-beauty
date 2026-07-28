import { appointmentService } from "@/services/appointment.service";
import { successResponse, createdResponse, handleApiError } from "@/utils/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await appointmentService.list({
      status: (searchParams.get("status") as "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED") ?? undefined,
      serviceId: searchParams.get("serviceId") ?? undefined,
      dateFrom: searchParams.get("dateFrom") ?? undefined,
      dateTo: searchParams.get("dateTo") ?? undefined,
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
    });
    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await appointmentService.create(body);
    return createdResponse(result, "Appointment created successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
