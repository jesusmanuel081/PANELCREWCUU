import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const { booking_id, amount, payment_method } = body;

  if (!booking_id || !amount) {
    return NextResponse.json(
      { error: "booking_id y amount son requeridos" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("payments")
    .insert({
      booking_id,
      user_id: user.id,
      amount,
      currency: "MXN",
      payment_method: payment_method || "card",
      payment_status: "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // TODO: Integrar con Stripe/MercadoPago
  // const session = await stripe.checkout.sessions.create({ ... });

  return NextResponse.json({
    message: "Pago registrado. Pendiente de integración con pasarela.",
    payment: data,
    // session_url: session.url,
  });
}

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("payments")
    .select("*, bookings(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ payments: data });
}
