import { userService } from "@/services/user.service";
import { successResponse, handleApiError } from "@/utils/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await userService.list({
      role: (searchParams.get("role") as "ADMIN" | "EDITOR") ?? undefined,
      search: searchParams.get("search") ?? undefined,
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
    });
    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}
