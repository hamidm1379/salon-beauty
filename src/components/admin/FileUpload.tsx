"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Film, Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

interface FileUploadProps {
  value?: { id: string; url: string; type: string } | null;
  onChange: (file: { id: string; url: string; type: string } | null) => void;
  onRemove?: () => void;
  accept?: string;
  label?: string;
}

export function FileUpload({
  value,
  onChange,
  onRemove,
  accept = "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm",
  label = "آپلود فایل",
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value?.url || null);
  const [fileType, setFileType] = useState<string>(value?.type || "");
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", file.name);

      const { data } = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const result = data.data;
      setPreview(result.url);
      setFileType(result.type);
      onChange({ id: result.id, url: result.url, type: result.type });
    } catch {
      toast.error("خطا در آپلود فایل");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleRemove = () => {
    setPreview(null);
    setFileType("");
    onChange(null);
    onRemove?.();
    if (inputRef.current) inputRef.current.value = "";
  };

  const isVideo = fileType === "video" || value?.type === "video";

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[var(--color-ink)]">
          {label}
        </label>
      )}

      {preview ? (
        <div className="relative rounded-2xl overflow-hidden border border-[var(--color-ink)]/10 bg-[var(--color-bg-soft)]">
          {isVideo ? (
            <video
              src={preview}
              controls
              className="w-full h-48 object-cover"
            />
          ) : (
            <Image
              src={preview}
              alt="Preview"
              width={400}
              height={200}
              className="w-full h-48 object-cover"
            />
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 left-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`
            relative flex flex-col items-center justify-center h-48 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200
            ${isDragging
              ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
              : "border-[var(--color-ink)]/15 hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-bg-soft)]"
            }
          `}
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-3">
                <Upload className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <p className="text-sm text-[var(--color-ink-muted)] mb-1">
                فایل را اینجا رها کنید یا کلیک کنید
              </p>
              <p className="text-xs text-[var(--color-ink-muted)]/60 flex items-center gap-1">
                <Film className="w-3 h-3" />
                تصاویر (تا ۱۰MB) و ویدیوها (تا ۵۰MB)
              </p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
