import { z } from "zod";
import { authService } from "@/services/auth.service";
import { successResponse, handleApiError } from "@/utils/api-response";

const loginSchema = z.object({
  username: z.string().min(1, "نام کاربری الزامی است"),
  password: z.string().min(1, "رمز عبور الزامی است"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = loginSchema.parse(body);
    const result = await authService.login(data);
    return successResponse(result, "Login successful");
  } catch (error) {
    return handleApiError(error);
  }
}
