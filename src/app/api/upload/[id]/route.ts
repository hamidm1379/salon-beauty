import { NextResponse } from "next/server";
import { uploadService } from "@/services/upload.service";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(request.url).searchParams.get("url");

    const result = url
      ? await uploadService.deleteImageByUrl(url)
      : await uploadService.deleteImage(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete upload error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
