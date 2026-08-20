"use client";

import { useState } from "react";
import { submitEnterpriseQuote } from "@/lib/actions";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <PricingSection />
      <EnterpriseQuoteSection />
      <CtaSection />
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('/solar-pattern.svg')] opacity-10" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Paneles Solares Limpios.{" "}
            <span className="text-amber-400">Máxima Eficiencia.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
            Los paneles sucios pierden hasta un{" "}
            <strong className="text-amber-400">25% de su eficiencia</strong>.
            Nuestro servicio profesional de limpieza en Chihuahua garantiza que
            tu inversión en energía solar rinda al máximo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/auth/register"
              className="bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors text-center"
            >
              Agendar Servicio
            </a>
            <a
              href="/#precios"
              className="border border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors text-center"
            >
              Ver Precios
            </a>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-lg">
            <div>
              <div className="text-3xl font-bold text-amber-400">25%</div>
              <div className="text-sm text-gray-400">Pérdida por suciedad</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-400">2x</div>
              <div className="text-sm text-gray-400">Más vida útil</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-400">100%</div>
              <div className="text-sm text-gray-400">Satisfacción</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    {
      title: "Limpieza Residencial",
      description:
        "Para hogares con sistemas solares. Incluye inspección visual, limpieza con agua desionizada y reporte post-servicio.",
      icon: "🏠",
    },
    {
      title: "Limpieza Comercial",
      description:
        "Para empresas e industrias. Servicio a gran escala con equipos especializados y jornadas programadas.",
      icon: "🏭",
    },
    {
      title: "Mantenimiento Preventivo",
      description:
        "Programas de mantenimiento periódico para asegurar la eficiencia continua de tus paneles solares.",
      icon: "🔧",
    },
  ];

  return (
    <section id="servicios" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Soluciones integrales para mantener tus paneles solares en óptimas
            condiciones todo el año.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const plans = [
    {
      name: "Residencial Básico",
      price: "$150",
      unit: "por panel",
      description: "Ideal para sistemas domésticos pequeños",
      features: [
        "Hasta 20 paneles",
        "Limpieza con agua desionizada",
        "Inspección visual",
        "Reporte fotográfico",
      ],
      highlighted: false,
    },
    {
      name: "Residencial Premium",
      price: "$130",
      unit: "por panel",
      description: "Para hogares con sistemas grandes",
      features: [
        "21-50 paneles",
        "Limpieza con agua desionizada",
        "Inspección detallada",
        "Reporte fotográfico",
        "Sellador anti-polvo",
        "Garantía 30 días",
      ],
      highlighted: true,
    },
    {
      name: "Comercial / B2B",
      price: "Cotizar",
      unit: "precios preferenciales",
      description: "Para empresas, industrias y gobierno",
      features: [
        "+50 paneles",
        "Precios por volumen",
        "Equipos especializados",
        "Programación flexible",
        "Mantenimiento periódico",
        "Facturación empresarial",
      ],
      highlighted: false,
    },
  ];

  return (
    <section id="precios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Precios
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tarifas transparentes para servicios residenciales. Precios desde{" "}
            <strong>$150 MXN por panel</strong>.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-xl border-2 ${
                plan.highlighted
                  ? "border-amber-500 bg-amber-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  MÁS POPULAR
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">
                {plan.description}
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-gray-500 text-sm ml-1">
                  {plan.unit}
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg
                      className="w-5 h-5 text-green-500 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={plan.highlighted ? "/auth/register" : "/#cotizacion"}
                className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors ${
                  plan.highlighted
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {plan.price === "Cotizar" ? "Solicitar Cotización" : "Agendar Ahora"}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EnterpriseQuoteSection() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = new FormData(e.currentTarget);
    const result = await submitEnterpriseQuote(form);

    if (result.success) {
      setStatus("success");
      (e.currentTarget as HTMLFormElement).reset();
    } else {
      setStatus("error");
      setErrorMsg(result.error || "Error al enviar");
    }
  }

  return (
    <section id="cotizacion" className="py-20 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Cotización para Empresas
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            ¿Tienes una empresa, industrial o gobierno? Solicita precios
            preferenciales por volumen. Nuestro equipo te contactará en menos
            de 24 horas.
          </p>
        </div>

        {status === "success" ? (
          <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">✓</div>
            <h3 className="text-xl font-semibold mb-2">¡Solicitud Enviada!</h3>
            <p className="text-gray-400">
              Nuestro equipo comercial te contactará pronto.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 rounded-xl p-8 space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre de la Empresa *
                </label>
                <input
                  type="text"
                  name="company_name"
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="Ej. SolarTech SA de CV"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre de Contacto *
                </label>
                <input
                  type="text"
                  name="contact_name"
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  name="contact_email"
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="correo@empresa.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="contact_phone"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="(614) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cantidad de Paneles *
                </label>
                <input
                  type="number"
                  name="panel_count"
                  required
                  min="1"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de Propiedad
                </label>
                <select
                  name="property_type"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                >
                  <option value="industrial">Industrial</option>
                  <option value="commercial">Comercial</option>
                  <option value="government">Gobierno</option>
                  <option value="other">Otro</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mensaje / Detalles Adicionales
              </label>
              <textarea
                name="message"
                rows={4}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                placeholder="Describe la ubicación, frecuencia deseada, etc."
              />
            </div>

            {status === "error" && (
              <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 text-red-300 text-sm">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "submitting"
                ? "Enviando..."
                : "Solicitar Cotización Empresarial"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="py-20 bg-amber-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          ¿Listo para Maximizar tu Energía?
        </h2>
        <p className="text-amber-100 text-lg mb-8">
          Agenda tu limpieza hoy y recupera hasta un 25% de eficiencia en tus
          paneles solares.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/auth/register"
            className="bg-white text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
          >
            Agendar Servicio
          </a>
          <a
            href="/partners"
            className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
          >
            Únete como Partner
          </a>
        </div>
      </div>
    </section>
  );
}
