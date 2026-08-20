"use client";

import { useState } from "react";
import { createBooking } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function BookServicePage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [panelCount, setPanelCount] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");

  const pricePerPanel = 150;
  const totalPrice = panelCount * pricePerPanel;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = new FormData(e.currentTarget);
    const result = await createBooking(form);

    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg(result.error || "Error al agendar");
    }
  }

  return (
    <div className="bg-gray-50 min-h-[80vh]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Agendar Servicio
        </h1>
        <p className="text-gray-600 mb-8">
          Selecciona la fecha, hora y cantidad de paneles para tu limpieza.
        </p>

        {status === "success" ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">✓</div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              ¡Servicio Agendado!
            </h3>
            <p className="text-green-700 mb-6">
              Tu cita ha sido registrada. Recibirás confirmación pronto.
            </p>
            <button
              onClick={() => router.push("/portal")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Volver al Portal
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha del Servicio *
                </label>
                <input
                  type="date"
                  name="service_date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora Preferida *
                </label>
                <input
                  type="time"
                  name="service_time"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Servicio *
              </label>
              <select
                name="service_type"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              >
                <option value="residential">Residencial ($150/panel)</option>
                <option value="commercial">Comercial (cotización)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad de Paneles *
              </label>
              <input
                type="number"
                name="panel_count"
                required
                min="1"
                value={panelCount}
                onChange={(e) => setPanelCount(Number(e.target.value) || 1)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección del Servicio *
              </label>
              <input
                type="text"
                name="address"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="Calle, número, colonia, Chihuahua"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas Adicionales
              </label>
              <textarea
                name="notes"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                placeholder="Instrucciones especiales, acceso, etc."
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Total Estimado:</span>
                <span className="text-2xl font-bold text-amber-600">
                  ${totalPrice.toLocaleString("es-MX")} MXN
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {panelCount} paneles × ${pricePerPanel} MXN
              </p>
            </div>

            {status === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? "Agendando..." : "Confirmar Servicio"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
