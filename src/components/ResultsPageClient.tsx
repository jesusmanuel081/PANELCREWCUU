"use client";

import { useState } from "react";
import Link from "next/link";
import ImageUploader from "@/components/ImageUploader";

interface DiagnosticImage {
  id: string;
  file_name: string;
  r2_key: string;
  created_at: string;
}

interface Diagnostic {
  id: string;
  panel_location: string | null;
  panel_count: number | null;
  notes: string | null;
  status: string;
  created_at: string;
  analysis_result: {
    overall?: string;
    clean_count?: number;
    dirty_count?: number;
    total?: number;
    confidence?: number;
    needs_cleaning?: boolean;
    dirty_level?: number;
  } | null;
  diagnostic_images: DiagnosticImage[];
}

interface Prediction {
  filename: string;
  label: string;
  confidence: number;
  clean_prob: number;
  dirty_prob: number;
}

interface AnalysisResult {
  diagnostic_id: string;
  status: string;
  overall_label: string;
  overall_confidence: number;
  predictions: Prediction[];
}

export default function ResultsPageClient({ diagnostic }: { diagnostic: Diagnostic }) {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const statusMap: Record<string, { text: string; color: string }> = {
    uploaded: { text: "Imágenes subidas", color: "text-blue-600" },
    analyzing: { text: "Análisis en proceso...", color: "text-yellow-600" },
    completed: { text: "Análisis completo", color: "text-green-600" },
    failed: { text: "Error en análisis", color: "text-red-600" },
  };

  const currentStatus = analyzing ? "analyzing" : result ? "completed" : diagnostic.status;
  const status = statusMap[currentStatus] || statusMap.uploaded;
  const imageCount = diagnostic.diagnostic_images?.length || 0;

  const displayResult = result || diagnostic.analysis_result;
  const overallLabel = result?.overall_label || diagnostic.analysis_result?.overall;
  const overallConfidence = result?.overall_confidence || diagnostic.analysis_result?.confidence;

  const needsCleaning =
    overallLabel === "dirty" ||
    (overallLabel === "mixed" && (overallConfidence || 0) > 0.6);

  return (
    <div className="bg-gray-50 min-h-[80vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {diagnostic.panel_location || "Diagnóstico"}
            </h1>
            <p className="text-gray-600 mt-1">
              {new Date(diagnostic.created_at).toLocaleDateString("es-MX", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {" · "}
              <span className={`font-medium ${status.color}`}>{status.text}</span>
            </p>
          </div>
          <Link
            href="/portal/diagnostic"
            className="text-amber-600 hover:text-amber-700 font-medium text-sm"
          >
            ← Volver
          </Link>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{imageCount}</div>
            <div className="text-xs text-gray-500">Imágenes</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {diagnostic.panel_count || "—"}
            </div>
            <div className="text-xs text-gray-500">Paneles</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {overallConfidence
                ? `${Math.round(overallConfidence * 100)}%`
                : "—"}
            </div>
            <div className="text-xs text-gray-500">Confianza IA</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {needsCleaning ? "⚠️" : overallLabel ? "✓" : "—"}
            </div>
            <div className="text-xs text-gray-500">Necesita limpieza</div>
          </div>
        </div>

        {/* Analysis result */}
        {displayResult && !analyzing && (
          <div className="bg-white border border-gray-100 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Resultado del Análisis IA
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-lg font-medium ${
                  overallLabel === "clean"
                    ? "bg-green-100 text-green-800"
                    : overallLabel === "dirty"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {overallLabel === "clean"
                    ? "✓ Limpio"
                    : overallLabel === "dirty"
                    ? "⚠ Sucio"
                    : "◐ Mixto"}
                </div>
                <span className="text-gray-600">
                  Confianza: {Math.round((overallConfidence || 0) * 100)}%
                </span>
              </div>

              {result?.predictions && result.predictions.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Detalle por imagen:</h3>
                  <div className="space-y-2">
                    {result.predictions.map((pred, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                      >
                        <span className="text-sm text-gray-700">{pred.filename}</span>
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-medium ${
                            pred.label === "clean" ? "text-green-600" : "text-red-600"
                          }`}>
                            {pred.label === "clean" ? "Limpio" : "Sucio"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {Math.round(pred.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-gray-700 mt-4">
                {needsCleaning
                  ? "Se recomienda limpieza de paneles para mantener la eficiencia energética."
                  : "Los paneles se encuentran en buen estado."}
              </p>
            </div>

            {needsCleaning && (
              <Link
                href={`/portal/book?diagnostic=${diagnostic.id}`}
                className="mt-4 inline-block bg-amber-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors"
              >
                Agendar Limpieza
              </Link>
            )}
          </div>
        )}

        {/* Analyzing indicator */}
        {analyzing && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-blue-700 font-medium">Analizando imágenes con IA...</p>
            <p className="text-blue-600 text-sm mt-1">Esto puede tomar unos segundos</p>
          </div>
        )}

        {/* Uploaded images */}
        {imageCount > 0 && (
          <div className="bg-white border border-gray-100 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Imágenes ({imageCount})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {diagnostic.diagnostic_images.map((img) => (
                <div
                  key={img.id}
                  className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400"
                >
                  🖼️
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload section */}
        {imageCount < 12 && diagnostic.status !== "completed" && (
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {imageCount === 0 ? "Sube tus imágenes" : "Agregar más imágenes"}
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Puedes subir hasta {12 - imageCount} imagen{12 - imageCount !== 1 ? "es" : ""} más.
            </p>
            <ImageUploader
              diagnosticId={diagnostic.id}
              onUploadComplete={() => {}}
              onAnalysisStart={() => setAnalyzing(true)}
              onAnalysisComplete={(r) => {
                setAnalyzing(false);
                setResult(r);
              }}
              showAnalyzeButton={imageCount > 0}
            />
          </div>
        )}

        {/* Notes */}
        {diagnostic.notes && (
          <div className="bg-white border border-gray-100 rounded-xl p-6 mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Notas</h2>
            <p className="text-gray-600">{diagnostic.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
