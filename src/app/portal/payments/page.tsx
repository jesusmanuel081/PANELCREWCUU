import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PaymentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: payments } = await supabase
    .from("payments")
    .select("*, bookings(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="bg-gray-50 min-h-[80vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Pagos</h1>
            <p className="text-gray-600 mt-1">
              Historial de transacciones y pagos.
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
            {payments && payments.length > 0 ? (
              payments.map((payment) => (
                <div key={payment.id} className="p-6 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">
                      Servicio - {payment.bookings?.panel_count} paneles
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(payment.created_at).toLocaleDateString("es-MX")} •{" "}
                      {payment.payment_method === "card"
                        ? "Tarjeta"
                        : payment.payment_method === "cash"
                        ? "Efectivo"
                        : payment.payment_method === "transfer"
                        ? "Transferencia"
                        : "OXXO"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">
                      ${payment.amount.toLocaleString("es-MX")} {payment.currency}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        payment.payment_status === "completed"
                          ? "text-green-600"
                          : payment.payment_status === "failed"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {payment.payment_status === "completed"
                        ? "Pagado"
                        : payment.payment_status === "failed"
                        ? "Fallido"
                        : "Pendiente"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500">
                <p>No tienes pagos registrados.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
