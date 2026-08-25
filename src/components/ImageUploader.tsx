"use client";

import { useCallback, useState } from "react";

interface Props {
  onUploadComplete: (fileKeys: string[]) => void;
  diagnosticId: string;
}

interface FileUpload {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  fileKey?: string;
  error?: string;
}

const MAX_IMAGES = 12;
const MAX_SIZE_MB = 10;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export default function ImageUploader({ onUploadComplete, diagnosticId }: Props) {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [uploading, setUploading] = useState(false);

  const addFiles = useCallback((input: FileList | null) => {
    if (!input) return;
    const incoming = Array.from(input).filter(
      (f) => ACCEPTED.includes(f.type) && f.size <= MAX_SIZE_MB * 1024 * 1024
    );
    setFiles((prev) => {
      const combined = [...prev.map((f) => f.file), ...incoming].slice(0, MAX_IMAGES);
      return combined.map((f): FileUpload => ({ file: f, progress: 0, status: "pending" }));
    });
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadAll = async () => {
    setUploading(true);
    const uploadedKeys: string[] = [];

    for (let i = 0; i < files.length; i++) {
      if (files[i].status === "done") continue;

      setFiles((prev) =>
        prev.map((f, idx) => (idx === i ? { ...f, status: "uploading", progress: 0 } : f))
      );

      try {
        const file = files[i].file;

        // Get presigned URL
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            diagnosticId,
            fileName: file.name,
            contentType: file.type,
          }),
        });

        if (!res.ok) throw new Error("Error generando URL de subida");
        const { uploadUrl, fileKey } = await res.json();

        // Upload to R2
        const xhr = new XMLHttpRequest();
        const key = fileKey;

        await new Promise<void>((resolve, reject) => {
          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              const pct = Math.round((e.loaded / e.total) * 100);
              setFiles((prev) =>
                prev.map((f, idx) => (idx === i ? { ...f, progress: pct } : f))
              );
            }
          });
          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve();
            else reject(new Error("Error subiendo archivo"));
          });
          xhr.addEventListener("error", () => reject(new Error("Error de red")));
          xhr.open("PUT", uploadUrl);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });

        // Save metadata
        await fetch("/api/upload/metadata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            diagnosticId,
            fileKey: key,
            fileName: file.name,
            fileSize: file.size,
          }),
        });

        uploadedKeys.push(key);
        setFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, status: "done", progress: 100, fileKey: key } : f))
        );
      } catch (err) {
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: "error", error: (err as Error).message } : f
          )
        );
      }
    }

    setUploading(false);
    if (uploadedKeys.length > 0) {
      onUploadComplete(uploadedKeys);
    }
  };

  const allDone = files.length > 0 && files.every((f) => f.status === "done");
  const hasErrors = files.some((f) => f.status === "error");

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          addFiles(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-amber-400 transition-colors cursor-pointer"
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <div className="text-4xl mb-3">📷</div>
        <p className="text-gray-700 font-medium">
          Arrastra imágenes aquí o haz clic para seleccionar
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Máximo {MAX_IMAGES} imágenes · JPG, PNG, WebP · {MAX_SIZE_MB}MB c/u
        </p>
        <input
          id="file-input"
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-sm">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{f.file.name}</p>
                <p className="text-xs text-gray-500">
                  {(f.file.size / 1024 / 1024).toFixed(1)} MB
                </p>
                {f.status === "uploading" && (
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-amber-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${f.progress}%` }}
                    />
                  </div>
                )}
                {f.status === "error" && (
                  <p className="text-xs text-red-600 mt-1">{f.error}</p>
                )}
              </div>
              <div className="shrink-0">
                {f.status === "done" && <span className="text-green-600 text-lg">✓</span>}
                {f.status === "error" && <span className="text-red-600 text-lg">✗</span>}
                {f.status === "pending" && (
                  <button
                    onClick={() => removeFile(i)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {files.length > 0 && (
        <div className="flex gap-3">
          {!allDone && (
            <button
              onClick={uploadAll}
              disabled={uploading}
              className="flex-1 bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50"
            >
              {uploading
                ? "Subiendo..."
                : `Subir ${files.filter((f) => f.status !== "done").length} imágenes`}
            </button>
          )}
          {allDone && (
            <div className="flex-1 bg-green-50 border border-green-200 text-green-700 py-3 rounded-lg font-medium text-center">
              ✓ {files.length} imágenes subidas correctamente
            </div>
          )}
        </div>
      )}
    </div>
  );
}
