import { commentService } from "@/services/comment.service";
import { successResponse, createdResponse, handleApiError } from "@/utils/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isApprovedParam = searchParams.get("isApproved");
    const result = await commentService.list({
      serviceId: searchParams.get("serviceId") ?? undefined,
      isApproved: isApprovedParam !== null ? isApprovedParam === "true" : undefined,
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
    const result = await commentService.create(body);
    return createdResponse(result, "Comment submitted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
