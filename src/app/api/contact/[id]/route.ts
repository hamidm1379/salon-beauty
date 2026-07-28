import { contactMessageService } from "@/services/contact-message.service";
import { successResponse, handleApiError } from "@/utils/api-response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await contactMessageService.getById(id);
    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (body.isRead === true) {
      const result = await contactMessageService.markAsRead(id);
      return successResponse(result, "Message marked as read");
    }
    return successResponse(null, "No action taken");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await contactMessageService.delete(id);
    return successResponse(null, "Message deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
