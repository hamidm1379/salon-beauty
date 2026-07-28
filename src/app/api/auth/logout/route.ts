import { authService } from "@/services/auth.service";
import { successResponse, handleApiError } from "@/utils/api-response";

export async function POST() {
  try {
    await authService.logout();
    return successResponse(null, "Logout successful");
  } catch (error) {
    return handleApiError(error);
  }
}
