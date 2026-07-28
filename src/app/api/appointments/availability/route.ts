import { appointmentService } from "@/services/appointment.service";
import { successResponse, handleApiError } from "@/utils/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const serviceId = searchParams.get("serviceId");

    if (!date || !serviceId) {
      return handleApiError(new Error("date and serviceId are required"));
    }

    const result = await appointmentService.getAvailableSlots(date, serviceId);
    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}
