"use client";

import Link from "next/link";

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
  const status = statusLabels[diagnostic.status] || statusLabels.uploaded;
  const imageCount = diagnostic.diagnostic_images?.length || 0;

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

      {/* Thumbnails */}
      {imageCount > 0 && (
        <div className="flex gap-2 mb-4">
          {diagnostic.diagnostic_images.slice(0, 4).map((img) => (
            <div
              key={img.id}
              className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500 overflow-hidden"
            >
              🖼️
            </div>
          ))}
          {imageCount > 4 && (
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium text-gray-600">
              +{imageCount - 4}
            </div>
          )}
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
      </div>
    </div>
  );
}
