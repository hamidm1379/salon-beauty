import { contactMessageService } from "@/services/contact-message.service";
import { successResponse, createdResponse, handleApiError } from "@/utils/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await contactMessageService.list({
      isRead: searchParams.get("isRead") !== null ? searchParams.get("isRead") === "true" : undefined,
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 20,
    });
    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await contactMessageService.create(body);
    return createdResponse(result, "Message sent successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
