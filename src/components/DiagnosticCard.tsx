"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteDiagnostic } from "@/lib/actions";

interface DiagnosticImage {
  id: string;
  file_name: string;
  file_key: string;
  created_at: string;
}

interface Diagnostic {
  id: string;
  panel_location: string | null;
  panel_count: number | null;
  status: string;
  created_at: string;
  diagnostic_images: DiagnosticImage[];
}

const statusLabels: Record<string, { text: string; color: string }> = {
  uploaded: { text: "Imágenes subidas", color: "bg-blue-100 text-blue-800" },
  analyzing: { text: "Analizando...", color: "bg-yellow-100 text-yellow-800" },
  completed: { text: "Análisis completo", color: "bg-green-100 text-green-800" },
  failed: { text: "Error en análisis", color: "bg-red-100 text-red-800" },
};

export default function DiagnosticCard({ diagnostic }: { diagnostic: Diagnostic }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const status = statusLabels[diagnostic.status] || statusLabels.uploaded;
  const imageCount = diagnostic.diagnostic_images?.length || 0;

  const handleDelete = async () => {
    setDeleting(true);
    const result = await deleteDiagnostic(diagnostic.id);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || "Error al eliminar");
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">
            {diagnostic.panel_location || "Sin ubicación"}
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(diagnostic.created_at).toLocaleDateString("es-MX", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
          {status.text}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <span>📷 {imageCount} imagen{imageCount !== 1 ? "es" : ""}</span>
        {diagnostic.panel_count && (
          <span>🔢 {diagnostic.panel_count} panel{diagnostic.panel_count !== 1 ? "es" : ""}</span>
        )}
      </div>

      {/* Image list */}
      {imageCount > 0 && (
        <div className="space-y-1 mb-4">
          {diagnostic.diagnostic_images.map((img) => (
            <div
              key={img.id}
              className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-1.5"
            >
              <span className="text-gray-400">📄</span>
              <span className="truncate">{img.file_name}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <Link
          href={`/portal/diagnostic/results/${diagnostic.id}`}
          className="flex-1 text-center bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Ver Detalles
        </Link>
        {diagnostic.status === "completed" && (
          <Link
            href={`/portal/book?diagnostic=${diagnostic.id}`}
            className="flex-1 text-center bg-amber-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
          >
            Agendar Limpieza
          </Link>
        )}
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-gray-400 hover:text-red-500 text-sm px-2 transition-colors"
            title="Eliminar diagnóstico"
          >
            🗑️
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {deleting ? "..." : "Sí"}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-300 transition-colors"
            >
              No
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
