import { blogService } from "@/services/blog.service";
import { successResponse, createdResponse, handleApiError } from "@/utils/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await blogService.list({
      published: searchParams.get("published") !== null ? searchParams.get("published") === "true" : undefined,
      blogCategoryId: searchParams.get("blogCategoryId") ?? undefined,
      search: searchParams.get("search") ?? undefined,
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
    const result = await blogService.create(body);
    return createdResponse(result, "Blog post created successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
