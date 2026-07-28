import { categoryService } from "@/services/category.service";
import { successResponse, createdResponse, handleApiError } from "@/utils/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isActiveParam = searchParams.get("isActive");
    const result = await categoryService.list({
      isActive: isActiveParam !== null ? isActiveParam === "true" : undefined,
      search: searchParams.get("search") ?? undefined,
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      sortBy: (searchParams.get("sortBy") as "name" | "createdAt" | "sortOrder") || "sortOrder",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
    });
    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await categoryService.create(body);
    return createdResponse(result, "Category created successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
