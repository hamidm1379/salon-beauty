import sharp from "sharp";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs/promises";
import { imageRepository } from "@/repositories/image.repository";
import type { ApiResponse } from "@/dto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const THUMBNAIL_SIZE = 200;
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];

export interface UploadResult {
  id: string;
  url: string;
  type: string;
  alt: string | null;
  width: number | null;
  height: number | null;
}

export class UploadService {
  async ensureUploadDir() {
    try {
      await fs.access(UPLOAD_DIR);
    } catch {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
    }
  }

  isImage(mimeType: string): boolean {
    return IMAGE_TYPES.includes(mimeType);
  }

  isVideo(mimeType: string): boolean {
    return VIDEO_TYPES.includes(mimeType);
  }

  async processImage(
    file: Buffer,
    options?: { width?: number; height?: number; alt?: string }
  ): Promise<ApiResponse<UploadResult>> {
    try {
      await this.ensureUploadDir();

      const timestamp = Date.now();
      const uuid = randomUUID();
      const filename = `${uuid}-${timestamp}.webp`;
      const thumbnailFilename = `thumb-${filename}`;

      const processed = sharp(file)
        .webp({ quality: 85 })
        .resize({
          width: options?.width || MAX_WIDTH,
          height: options?.height || MAX_HEIGHT,
          fit: "inside",
          withoutEnlargement: true,
        });

      const mainBuffer = await processed.toBuffer();
      const mainMetadata = await sharp(mainBuffer).metadata();

      await sharp(file)
        .webp({ quality: 80 })
        .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, { fit: "cover" })
        .toFile(path.join(UPLOAD_DIR, thumbnailFilename));

      await fs.writeFile(path.join(UPLOAD_DIR, filename), mainBuffer);

      const image = await imageRepository.create({
        url: `/uploads/${filename}`,
        type: "image",
        alt: options?.alt || null,
        width: mainMetadata.width || null,
        height: mainMetadata.height || null,
      });

      return {
        success: true,
        data: {
          id: image.id,
          url: image.url,
          type: "image",
          alt: image.alt,
          width: image.width || null,
          height: image.height || null,
        },
        message: "Image uploaded successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }

  async processVideo(
    file: Buffer,
    mimeType: string,
    options?: { alt?: string }
  ): Promise<ApiResponse<UploadResult>> {
    try {
      await this.ensureUploadDir();

      const timestamp = Date.now();
      const uuid = randomUUID();
      const ext = mimeType === "video/webm" ? "webm" : mimeType === "video/ogg" ? "ogv" : "mp4";
      const filename = `${uuid}-${timestamp}.${ext}`;

      await fs.writeFile(path.join(UPLOAD_DIR, filename), file);

      const image = await imageRepository.create({
        url: `/uploads/${filename}`,
        type: "video",
        alt: options?.alt || null,
        width: null,
        height: null,
      });

      return {
        success: true,
        data: {
          id: image.id,
          url: image.url,
          type: "video",
          alt: image.alt,
          width: null,
          height: null,
        },
        message: "Video uploaded successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }

  async processFavicon(
    file: Buffer,
    mimeType: string,
    alt?: string
  ): Promise<ApiResponse<UploadResult>> {
    try {
      await this.ensureUploadDir();

      const timestamp = Date.now();
      const uuid = randomUUID();
      const ext = mimeType === "image/png" ? "png" : mimeType === "image/gif" ? "gif" : "ico";
      const filename = `${uuid}-${timestamp}.${ext}`;

      await fs.writeFile(path.join(UPLOAD_DIR, filename), file);

      const image = await imageRepository.create({
        url: `/uploads/${filename}`,
        type: "image",
        alt: alt || null,
        width: null,
        height: null,
      });

      return {
        success: true,
        data: {
          id: image.id,
          url: image.url,
          type: "image",
          alt: image.alt,
          width: null,
          height: null,
        },
        message: "Favicon uploaded successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: `Favicon upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }

  async uploadFile(
    file: File,
    options?: { alt?: string; purpose?: string }
  ): Promise<ApiResponse<UploadResult>> {
    const buffer = Buffer.from(await file.arrayBuffer());

    if (options?.purpose === "favicon" && this.isImage(file.type)) {
      return this.processFavicon(buffer, file.type, options?.alt);
    }

    if (this.isImage(file.type)) {
      return this.processImage(buffer, { alt: options?.alt });
    }

    if (this.isVideo(file.type)) {
      return this.processVideo(buffer, file.type, { alt: options?.alt });
    }

    return {
      success: false,
      message: "Unsupported file type",
    };
  }

  async deleteImage(id: string): Promise<ApiResponse<null>> {
    try {
      const image = await imageRepository.findById(id);
      if (!image) {
        return { success: false, message: "Image not found" };
      }

      const filePath = path.join(process.cwd(), "public", image.url);
      try {
        await fs.unlink(filePath);
      } catch {
        // File might not exist
      }

      // Delete thumbnail (only for images)
      if (image.type === "image") {
        const dir = path.dirname(image.url);
        const filename = path.basename(image.url);
        const thumbPath = path.join(process.cwd(), "public", dir, `thumb-${filename}`);
        try {
          await fs.unlink(thumbPath);
        } catch {
          // Thumbnail might not exist
        }
      }

      await imageRepository.delete(id);
      return { success: true, message: "File deleted successfully" };
    } catch (error) {
      return {
        success: false,
        message: `Delete failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }

  async deleteImageByUrl(url: string): Promise<ApiResponse<null>> {
    try {
      const image = await imageRepository.findByUrl(url);

      // Delete file from disk regardless of DB record
      const filePath = path.join(process.cwd(), "public", url);
      try {
        await fs.unlink(filePath);
      } catch {
        // File might not exist
      }

      // Delete thumbnail if it exists
      const dir = path.dirname(url);
      const filename = path.basename(url);
      const thumbPath = path.join(process.cwd(), "public", dir, `thumb-${filename}`);
      try {
        await fs.unlink(thumbPath);
      } catch {
        // Thumbnail might not exist
      }

      // Delete DB record if it exists
      if (image) {
        await imageRepository.delete(image.id);
      }

      return { success: true, message: "File deleted successfully" };
    } catch (error) {
      return {
        success: false,
        message: `Delete failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }
}

export const uploadService = new UploadService();
