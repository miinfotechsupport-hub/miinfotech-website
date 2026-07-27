import React, { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Camera, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { uploadFile } from "../lib/supabase";

interface MediaUploadZoneProps {
  bucket: "logos" | "gallery" | "blog-images" | "service-images" | "testimonials" | "products" | "favicons";
  onUploadSuccess: (urls: string[]) => void;
  onSingleUploadSuccess?: (url: string) => void;
  label?: string;
  currentValue?: string;
  multiple?: boolean;
}

export default function MediaUploadZone({
  bucket,
  onUploadSuccess,
  onSingleUploadSuccess,
  label = "Upload Image",
  currentValue = "",
  multiple = false,
}: MediaUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>(currentValue ? [currentValue] : []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFiles = async (files: FileList) => {
    setLoading(true);
    setError(null);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) {
          setError("Only image files are supported.");
          continue;
        }

        // Compress and upload (Disable compression for logos and favicons)
        const shouldCompress = bucket !== "logos" && bucket !== "favicons";
        const url = await uploadFile(bucket, file, shouldCompress);
        uploadedUrls.push(url);

        if (!multiple) {
          setPreviews([url]);
          if (onSingleUploadSuccess) onSingleUploadSuccess(url);
          break; // Stop after first file in single mode
        }
      }

      if (multiple && uploadedUrls.length > 0) {
        setPreviews((prev) => [...prev, ...uploadedUrls]);
        onUploadSuccess(uploadedUrls);
      } else if (!multiple && uploadedUrls.length > 0) {
        onUploadSuccess(uploadedUrls);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to compress or upload image.");
    } finally {
      setLoading(false);
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerCameraInput = () => {
    cameraInputRef.current?.click();
  };

  const removeImage = (indexToRemove: number) => {
    const updated = previews.filter((_, idx) => idx !== indexToRemove);
    setPreviews(updated);
    onUploadSuccess(updated);
    if (!multiple && onSingleUploadSuccess) {
      onSingleUploadSuccess("");
    }
  };

  return (
    <div className="space-y-3 text-left">
      {label && (
        <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider">
          {label}
        </label>
      )}

      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center text-center gap-3 bg-slate-950/40 cursor-pointer ${
          dragActive
            ? "border-blue-500 bg-blue-500/5"
            : "border-slate-800 hover:border-slate-700 hover:bg-slate-900/10"
        }`}
        onClick={triggerFileInput}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          accept="image/*"
          aria-label={label || "Choose image file"}
          onChange={handleChange}
        />

        {/* Dedicated mobile camera input */}
        <input
          ref={cameraInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          capture="environment"
          aria-label="Take picture with camera"
          onChange={handleChange}
        />

        {loading ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-xs text-slate-400 font-mono">Compressing & Uploading...</p>
          </div>
        ) : (
          <>
            <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 group-hover:text-blue-500 transition-colors">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-white font-semibold">
                Drag & drop here, or <span className="text-blue-500 underline">browse files</span>
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Supports JPG, PNG, WebP (Auto-compressed to modern WebP)
              </p>
            </div>

            {/* Mobile quick actions */}
            <div className="flex gap-2 mt-2 sm:hidden" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={triggerFileInput}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg text-[10px] font-bold"
              >
                <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                Library
              </button>
              <button
                type="button"
                onClick={triggerCameraInput}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg text-[10px] font-bold"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-500" />
                Camera
              </button>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-950/20 border border-red-900/50 rounded-xl text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Image Previews / Thumbnails */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
          {previews.map((url, index) => {
            if (!url) return null;
            return (
              <div
                key={index}
                className="relative group aspect-square rounded-xl overflow-hidden border border-slate-850 bg-slate-900 shadow-md"
              >
                <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  aria-label={`Remove image ${index + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute top-1.5 right-1.5 p-1 bg-red-600/90 hover:bg-red-500 text-white rounded-full transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
