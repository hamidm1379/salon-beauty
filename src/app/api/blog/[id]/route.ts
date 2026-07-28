import { blogService } from "@/services/blog.service";
import { successResponse, handleApiError } from "@/utils/api-response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await blogService.getById(id);
    if (!post) {
      return handleApiError(new Error("Blog post not found"));
    }
    return successResponse(post);
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
    const result = await blogService.update(id, body);
    return successResponse(result, "Blog post updated successfully");
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
    await blogService.delete(id);
    return successResponse(null, "Blog post deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
