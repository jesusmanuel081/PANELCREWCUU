import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import ImageUploader from "@/components/ImageUploader";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: diagnostic } = await supabase
    .from("panel_diagnostics")
    .select("*, diagnostic_images(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!diagnostic) notFound();

  const statusMap: Record<string, { text: string; color: string }> = {
    uploaded: { text: "Imágenes subidas", color: "text-blue-600" },
    analyzing: { text: "Análisis en proceso...", color: "text-yellow-600" },
    completed: { text: "Análisis completo", color: "text-green-600" },
    failed: { text: "Error en análisis", color: "text-red-600" },
  };

  const status = statusMap[diagnostic.status] || statusMap.uploaded;
  const imageCount = diagnostic.diagnostic_images?.length || 0;

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
              {diagnostic.analysis_result?.confidence
                ? `${Math.round(diagnostic.analysis_result.confidence * 100)}%`
                : "—"}
            </div>
            <div className="text-xs text-gray-500">Confianza IA</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {diagnostic.analysis_result?.needs_cleaning === true
                ? "⚠️"
                : diagnostic.analysis_result?.needs_cleaning === false
                ? "✓"
                : "—"}
            </div>
            <div className="text-xs text-gray-500">Necesita limpieza</div>
          </div>
        </div>

        {/* Analysis result */}
        {diagnostic.status === "completed" && diagnostic.analysis_result && (
          <div className="bg-white border border-gray-100 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Resultado del Análisis</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Nivel de suciedad:</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{
                        width: `${diagnostic.analysis_result.dirty_level || 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {diagnostic.analysis_result.dirty_level || 0}%
                  </span>
                </div>
              </div>
              <p className="text-gray-700">
                {diagnostic.analysis_result.needs_cleaning
                  ? "Se recomienda limpieza de paneles para mantener la eficiencia energética."
                  : "Los paneles se encuentran en buen estado."}
              </p>
            </div>
            <Link
              href={`/portal/book?diagnostic=${diagnostic.id}`}
              className="mt-4 inline-block bg-amber-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors"
            >
              Agendar Limpieza
            </Link>
          </div>
        )}

        {/* Uploaded images */}
        {imageCount > 0 && (
          <div className="bg-white border border-gray-100 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Imágenes ({imageCount})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {diagnostic.diagnostic_images.map((img: { id: string; file_name: string; created_at: string }) => (
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
