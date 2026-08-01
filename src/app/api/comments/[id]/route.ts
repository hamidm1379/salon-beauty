import { commentService } from "@/services/comment.service";
import { successResponse, handleApiError } from "@/utils/api-response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await commentService.getById(id);
    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    let result;
    if (body.action === "approve") {
      result = await commentService.approve(id);
    } else if (body.action === "reject") {
      result = await commentService.reject(id);
    } else if (body.action === "reply") {
      result = await commentService.reply({
        name: body.name || "مدیریت",
        content: body.content,
        serviceId: body.serviceId,
        parentId: id,
      });
    } else {
      result = await commentService.getById(id);
    }
    return successResponse(result, "Comment updated successfully");
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
    await commentService.delete(id);
    return successResponse(null, "Comment deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
