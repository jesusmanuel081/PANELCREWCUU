const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function notifyNewBooking(booking: {
  service_date: string;
  service_time: string;
  panel_count: number;
  service_type: string;
  address: string;
  notes?: string | null;
  total_price: number;
  user_email?: string;
}) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("Telegram not configured, skipping notification");
    return;
  }

  const typeLabel = booking.service_type === "residential" ? "Residencial" : "Comercial";
  const message = [
    "🆕 *Nueva Reserva - PanelCrewCUU*",
    "",
    `📅 Fecha: ${booking.service_date}`,
    `🕐 Horario: ${booking.service_time}`,
    `🏠 Tipo: ${typeLabel}`,
    `🔢 Paneles: ${booking.panel_count}`,
    `📍 Dirección: ${booking.address}`,
    `💰 Total: $${booking.total_price.toLocaleString("es-MX")} MXN`,
    booking.notes ? `📝 Notas: ${booking.notes}` : "",
    booking.user_email ? `👤 Cliente: ${booking.user_email}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );
  } catch (err) {
    console.error("Telegram notification failed:", err);
  }
}
