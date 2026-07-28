import { categoryService } from "@/services/category.service";
import { successResponse, handleApiError } from "@/utils/api-response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await categoryService.getById(id);
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
    const result = await categoryService.update(id, body);
    return successResponse(result, "Category updated successfully");
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
    await categoryService.delete(id);
    return successResponse(null, "Category deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
