import { blogCategoryService } from "@/services/blog-category.service";
import { successResponse, createdResponse, handleApiError } from "@/utils/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await blogCategoryService.list({
      search: searchParams.get("search") ?? undefined,
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 100,
    });
    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await blogCategoryService.create(body);
    return createdResponse(result, "Blog category created successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
