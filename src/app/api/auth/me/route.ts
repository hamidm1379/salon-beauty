import { getCurrentUserFromCookie } from "@/lib/auth";
import { authService } from "@/services/auth.service";
import { successResponse, errorResponse, handleApiError } from "@/utils/api-response";

export async function GET() {
  try {
    const tokenPayload = await getCurrentUserFromCookie();
    if (!tokenPayload) {
      return errorResponse("Not authenticated", 401);
    }

    const user = await authService.getCurrentUser(tokenPayload.userId);
    return successResponse(user);
  } catch (error) {
    return handleApiError(error);
  }
}
