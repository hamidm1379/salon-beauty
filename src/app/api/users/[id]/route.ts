import { userService } from "@/services/user.service";
import { successResponse, handleApiError } from "@/utils/api-response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await userService.getById(id);
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
    const result = await userService.updateRole(id, body.role);
    return successResponse(result, "User role updated successfully");
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
    await userService.delete(id);
    return successResponse(null, "User deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
