import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PortalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: recentBookings } = await supabase
    .from("bookings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="bg-gray-50 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hola, {profile?.full_name || "Usuario"}
            </h1>
            <p className="text-gray-600 mt-1">
              Bienvenido a tu portal de cliente
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Link
              href="/portal/book"
              className="bg-amber-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors"
            >
              Agendar Servicio
            </Link>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cerrar Sesión
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Servicios Totales</div>
            <div className="text-3xl font-bold text-gray-900">
              {recentBookings?.length || 0}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Próximo Servicio</div>
            <div className="text-lg font-semibold text-gray-900">
              {recentBookings && recentBookings.length > 0
                ? new Date(recentBookings[0].service_date).toLocaleDateString("es-MX")
                : "Sin citas"}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Dirección</div>
            <div className="text-sm font-medium text-gray-900">
              {profile?.address || "Sin dirección registrada"}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Últimos Servicios
            </h2>
            <Link
              href="/portal/history"
              className="text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              Ver todo →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentBookings && recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">
                      {booking.panel_count} paneles -{" "}
                      {booking.service_type === "residential" ? "Residencial" : "Comercial"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(booking.service_date).toLocaleDateString("es-MX")} a las{" "}
                      {booking.service_time}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {booking.status === "pending"
                      ? "Pendiente"
                      : booking.status === "confirmed"
                      ? "Confirmado"
                      : booking.status === "in_progress"
                      ? "En Progreso"
                      : booking.status === "completed"
                      ? "Completado"
                      : "Cancelado"}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                <p>No tienes servicios registrados aún.</p>
                <Link
                  href="/portal/book"
                  className="text-amber-600 font-medium hover:text-amber-700 mt-2 inline-block"
                >
                  Agendar tu primer servicio →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
