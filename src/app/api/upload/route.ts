import { NextResponse } from "next/server";
import { uploadService } from "@/services/upload.service";
import { successResponse } from "@/utils/api-response";

export const runtime = "nodejs";
export const maxDuration = 300;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 1024 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const alt = formData.get("alt") as string | null;
    const purpose = formData.get("purpose") as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF, MP4, WebM, OGG` },
        { status: 400 }
      );
    }

    const isVideo = file.type.startsWith("video/");
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      const limitMB = isVideo ? 1024 : 10;
      return NextResponse.json(
        { success: false, message: `File size exceeds ${limitMB}MB limit` },
        { status: 400 }
      );
    }

    const result = await uploadService.uploadFile(file, { alt: alt ?? undefined, purpose: purpose ?? undefined });

    if (!result.success) {
      console.error("Upload service error:", result.message);
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }

    return successResponse(result.data, "File uploaded successfully");
  } catch (error) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { success: false, message: `Internal server error: ${error instanceof Error ? error.message : "Unknown"}` },
      { status: 500 }
    );
  }
}
