"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerWithPassword } from "@/lib/auth-actions";

export default function RegisterForm() {
  const router = useRouter();
  const [status, setStatus] = useState<
    "idle" | "submitting" | "error" | "needs-confirmation"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const result = await registerWithPassword(new FormData(e.currentTarget));

    if (result.success) {
      if (result.needsConfirmation) {
        setStatus("needs-confirmation");
      } else {
        router.push("/portal");
        router.refresh();
      }
    } else {
      setStatus("error");
      setErrorMsg(result.error);
    }
  }

  if (status === "needs-confirmation") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">✓</div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          ¡Cuenta Creada!
        </h3>
        <p className="text-green-700">
          Te enviamos un correo para confirmar tu cuenta. Revisa tu bandeja de
          entrada y confirma para poder iniciar sesión.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {errorMsg}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre Completo
        </label>
        <input
          type="text"
          name="full_name"
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
          placeholder="Tu nombre"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Correo Electrónico
        </label>
        <input
          type="email"
          name="email"
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
          placeholder="tu@email.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Teléfono
        </label>
        <input
          type="tel"
          name="phone"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
          placeholder="(614) 123-4567"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contraseña
        </label>
        <input
          type="password"
          name="password"
          required
          minLength={6}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
          placeholder="Mínimo 6 caracteres"
        />
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Creando cuenta..." : "Crear Cuenta"}
      </button>
    </form>
  );
}
