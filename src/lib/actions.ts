"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitEnterpriseQuote(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("enterprise_quotes").insert({
    company_name: formData.get("company_name") as string,
    contact_name: formData.get("contact_name") as string,
    contact_email: formData.get("contact_email") as string,
    contact_phone: formData.get("contact_phone") as string,
    panel_count: Number(formData.get("panel_count")),
    property_type: formData.get("property_type") as string,
    message: formData.get("message") as string,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function submitPartnerLead(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("partner_leads").insert({
    full_name: formData.get("full_name") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
    zone: formData.get("zone") as string,
    experience: formData.get("experience") as string,
    message: formData.get("message") as string,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function createBooking(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const panelCount = Number(formData.get("panel_count"));
  const pricePerPanel = 150;
  const totalPrice = panelCount * pricePerPanel;

  const { error } = await supabase.from("bookings").insert({
    user_id: user.id,
    service_date: formData.get("service_date") as string,
    service_time: formData.get("service_time") as string,
    panel_count: panelCount,
    service_type: formData.get("service_type") as string,
    address: formData.get("address") as string,
    notes: formData.get("notes") as string,
    total_price: totalPrice,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/portal");
  revalidatePath("/portal/history");
  return { success: true };
}

export async function getBookings() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado", data: [] };
  }

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, data };
}

export async function getPayments() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado", data: [] };
  }

  const { data, error } = await supabase
    .from("payments")
    .select("*, bookings(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, data };
}
