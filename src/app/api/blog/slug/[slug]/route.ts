import { blogService } from "@/services/blog.service";
import { successResponse, handleApiError } from "@/utils/api-response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await blogService.getBySlug(slug);
    if (!post) {
      return handleApiError(new Error("Blog post not found"));
    }
    return successResponse(post);
  } catch (error) {
    return handleApiError(error);
  }
}
