import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="bg-gray-50 min-h-[80vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Historial de Servicios
            </h1>
            <p className="text-gray-600 mt-1">
              Todos tus servicios de limpieza de paneles solares.
            </p>
          </div>
          <Link
            href="/portal"
            className="text-amber-600 hover:text-amber-700 font-medium text-sm"
          >
            ← Volver al Portal
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {bookings && bookings.length > 0 ? (
              bookings.map((booking) => (
                <div key={booking.id} className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {booking.panel_count} Paneles -{" "}
                          {booking.service_type === "residential"
                            ? "Residencial"
                            : "Comercial"}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "confirmed"
                              ? "bg-blue-100 text-blue-800"
                              : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : booking.status === "cancelled"
                              ? "bg-red-100 text-red-800"
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
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>
                          📅{" "}
                          {new Date(booking.service_date).toLocaleDateString("es-MX", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}{" "}
                          a las {booking.service_time}
                        </p>
                        <p>📍 {booking.address}</p>
                        {booking.notes && <p>📝 {booking.notes}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-amber-600">
                        ${booking.total_price?.toLocaleString("es-MX")} MXN
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Agendado:{" "}
                        {new Date(booking.created_at).toLocaleDateString("es-MX")}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500">
                <p className="text-lg mb-2">No tienes servicios registrados</p>
                <Link
                  href="/portal/book"
                  className="text-amber-600 font-medium hover:text-amber-700"
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
