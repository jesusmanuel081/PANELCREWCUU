"use client";

import { useState } from "react";
import { submitPartnerLead } from "@/lib/actions";

const ZONES = [
  "Centro",
  "Noreste",
  "Noroeste",
  "Sureste",
  "Suroeste",
  "Zona Industrial",
  "Zona Metropolitana",
];

export default function PartnersPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = new FormData(e.currentTarget);
    const result = await submitPartnerLead(form);

    if (result.success) {
      setStatus("success");
      (e.currentTarget as HTMLFormElement).reset();
    } else {
      setStatus("error");
      setErrorMsg(result.error || "Error al enviar");
    }
  }

  return (
    <>
      <section className="bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Limpas Paneles Solares?
            </h1>
            <p className="text-lg text-green-100 mb-8 leading-relaxed">
              Únete a <strong>PANELCREWCUU</strong> como partner y forma parte
              del equipo de limpieza de paneles solares más grande de Chihuahua.
              Te conectamos con clientes, tú pones tu experiencia.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-green-800/50 rounded-xl p-6">
                <div className="text-2xl font-bold text-green-300 mb-2">
                  Clientes
                </div>
                <p className="text-green-200 text-sm">
                  Acceso constante a demanda de limpieza en toda la zona
                  metropolitana.
                </p>
              </div>
              <div className="bg-green-800/50 rounded-xl p-6">
                <div className="text-2xl font-bold text-green-300 mb-2">
                  Flexibilidad
                </div>
                <p className="text-green-200 text-sm">
                  Tú defines tu horario y zona de trabajo. Sin exclusividad.
                </p>
              </div>
              <div className="bg-green-800/50 rounded-xl p-6">
                <div className="text-2xl font-bold text-green-300 mb-2">
                  Pagos
                </div>
                <p className="text-green-200 text-sm">
                  Pagos puntuales por cada servicio completado. Sin comisiones
                  ocultas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Postúlate como Partner
            </h2>
            <p className="text-gray-600">
              Completa el formulario y nuestro equipo se pondrá en contacto
              contigo para formalizar el proceso de onboarding.
            </p>
          </div>

          {status === "success" ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                ¡Solicitud Recibida!
              </h3>
              <p className="text-green-700">
                Te contactaremos pronto para continuar con el proceso.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-gray-50 rounded-xl p-8 space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  name="full_name"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="(614) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zona de Chihuahua *
                </label>
                <select
                  name="zone"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                >
                  <option value="">Selecciona tu zona</option>
                  {ZONES.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experiencia Previa
                </label>
                <input
                  type="text"
                  name="experience"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="Ej. 2 años limpiando paneles solares"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje Adicional
                </label>
                <textarea
                  name="message"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                  placeholder="Cuéntanos sobre ti..."
                />
              </div>

              {status === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? "Enviando..." : "Enviar Solicitud"}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
