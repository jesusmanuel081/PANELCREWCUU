"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithPassword } from "@/lib/auth-actions";

export default function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const result = await loginWithPassword(new FormData(e.currentTarget));

    if (result.success) {
      const target =
        redirectTo && redirectTo.startsWith("/") ? redirectTo : "/portal";
      router.push(target);
      router.refresh();
    } else {
      setStatus("error");
      setErrorMsg(result.error);
    }
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
          Contraseña
        </label>
        <input
          type="password"
          name="password"
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Ingresando..." : "Iniciar Sesión"}
      </button>
    </form>
  );
}
