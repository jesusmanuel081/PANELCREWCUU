import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import NewDiagnosticButton from "./NewDiagnosticButton";
import DiagnosticCard from "@/components/DiagnosticCard";
import SignOutButton from "@/components/SignOutButton";

export default async function DiagnosticPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: diagnostics } = await supabase
    .from("panel_diagnostics")
    .select("*, diagnostic_images(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="bg-gray-50 min-h-[80vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Diagnóstico de Paneles
            </h1>
            <p className="text-gray-600 mt-1">
              Sube fotos de tus paneles para obtener un análisis de su estado.
            </p>
          </div>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <Link
              href="/portal"
              className="text-amber-600 hover:text-amber-700 font-medium text-sm"
            >
              ← Volver al Portal
            </Link>
            <SignOutButton />
          </div>
        </div>

        <NewDiagnosticButton />

        {diagnostics && diagnostics.length > 0 ? (
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Mis Diagnósticos</h2>
            {diagnostics.map((d) => (
              <DiagnosticCard key={d.id} diagnostic={d} />
            ))}
          </div>
        ) : (
          <div className="mt-8 bg-white border border-gray-100 rounded-xl p-12 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-600 text-lg mb-2">Aún no tienes diagnósticos</p>
            <p className="text-gray-500 text-sm">
              Sube fotos de tus paneles para saber en qué estado se encuentran.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
