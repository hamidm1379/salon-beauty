import { galleryService } from "@/services/gallery.service";
import { successResponse, createdResponse, handleApiError } from "@/utils/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await galleryService.list({
      isActive: searchParams.get("isActive") !== null ? searchParams.get("isActive") === "true" : undefined,
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 12,
    });
    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await galleryService.create(body);
    return createdResponse(result, "Gallery item created successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
