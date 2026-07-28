import { serviceService } from "@/services/service.service";
import { successResponse, createdResponse, handleApiError } from "@/utils/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isActiveParam = searchParams.get("isActive");
    const result = await serviceService.list({
      categoryId: searchParams.get("categoryId") ?? undefined,
      isActive: isActiveParam !== null ? isActiveParam === "true" : undefined,
      search: searchParams.get("search") ?? undefined,
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      sortBy: (searchParams.get("sortBy") as "name" | "price" | "createdAt" | "sortOrder") || "sortOrder",
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
    const result = await serviceService.create(body);
    return createdResponse(result, "Service created successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
