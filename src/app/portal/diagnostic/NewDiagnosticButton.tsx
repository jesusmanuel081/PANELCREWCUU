"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDiagnostic } from "@/lib/actions";

export default function NewDiagnosticButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [location, setLocation] = useState("");
  const [panelCount, setPanelCount] = useState("");
  const [notes, setNotes] = useState("");

  const handleCreate = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await createDiagnostic(
        location,
        panelCount ? Number(panelCount) : null,
        notes
      );

      if (result.success && result.diagnosticId) {
        router.push(`/portal/diagnostic/results/${result.diagnosticId}`);
      } else {
        setError(result.error || "Error al crear diagnóstico. Intenta de nuevo.");
        setLoading(false);
      }
    } catch (err) {
      setError("Error de conexión. Verifica tu internet y intenta de nuevo.");
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
      >
        + Nuevo Diagnóstico
      </button>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
      <h3 className="font-semibold text-gray-900">Nuevo Diagnóstico</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ubicación de los paneles
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
            placeholder="Ej. Fachada principal, Azotea"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cantidad de paneles (aprox.)
          </label>
          <input
            type="number"
            value={panelCount}
            onChange={(e) => setPanelCount(e.target.value)}
            min="1"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
            placeholder="Ej. 20"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notas adicionales
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm resize-none"
          placeholder="Algo que quieras que sepamos..."
        />
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-amber-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 text-sm"
        >
          {loading ? "Creando..." : "Crear y Subir Fotos"}
        </button>
        <button
          onClick={() => { setOpen(false); setError(""); }}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
