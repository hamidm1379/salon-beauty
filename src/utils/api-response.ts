import { NextResponse } from "next/server";
import { AppError } from "@/lib/errors";
import type { ZodError } from "zod";

export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  message: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: string[];
}

export function successResponse<T>(data: T, message: string = "Success"): NextResponse<SuccessResponse<T>> {
  return NextResponse.json({ success: true, data, message }, { status: 200 });
}

export function createdResponse<T>(data: T, message: string = "Created"): NextResponse<SuccessResponse<T>> {
  return NextResponse.json({ success: true, data, message }, { status: 201 });
}

export function errorResponse(message: string, statusCode: number = 500, errors?: string[]): NextResponse<ErrorResponse> {
  return NextResponse.json({ success: false, message, errors }, { status: statusCode });
}

export function handleApiError(error: unknown): NextResponse<ErrorResponse> {
  if (error instanceof AppError) {
    return errorResponse(error.message, error.statusCode);
  }

  if (error && typeof error === "object" && "issues" in error) {
    const zodError = error as ZodError;
    const messages = zodError.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
    return errorResponse("Validation failed", 422, messages);
  }

  console.error("Unexpected error:", error);
  return errorResponse("Internal server error", 500);
}
