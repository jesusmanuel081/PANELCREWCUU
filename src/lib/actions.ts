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
  const serviceTime = formData.get("service_time") as string;
  const serviceDate = formData.get("service_date") as string;
  const address = formData.get("address") as string;

  if (!serviceDate) {
    return { success: false, error: "Selecciona una fecha." };
  }
  if (!serviceTime) {
    return { success: false, error: "Selecciona un horario." };
  }
  if (!address || !address.trim()) {
    return { success: false, error: "Ingresa la dirección del servicio." };
  }
  if (!panelCount || panelCount < 1) {
    return { success: false, error: "Ingresa la cantidad de paneles." };
  }

  const pricePerPanel = 150;
  const totalPrice = panelCount * pricePerPanel;

  const { error } = await supabase.from("bookings").insert({
    user_id: user.id,
    service_date: serviceDate,
    service_time: serviceTime,
    panel_count: panelCount,
    service_type: formData.get("service_type") as string,
    address: address.trim(),
    notes: (formData.get("notes") as string) || null,
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

// ============================================================
// DIAGNOSTIC ACTIONS
// ============================================================

export async function createDiagnostic(
  panelLocation: string,
  panelCount: number | null,
  notes: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  if (!panelLocation || !panelLocation.trim()) {
    return { success: false, error: "La ubicación de los paneles es obligatoria." };
  }

  if (!panelCount || panelCount < 1) {
    return { success: false, error: "Ingresa la cantidad de paneles (mínimo 1)." };
  }

  const { data, error } = await supabase
    .from("panel_diagnostics")
    .insert({
      user_id: user.id,
      panel_location: panelLocation.trim(),
      panel_count: panelCount,
      notes: notes?.trim() || null,
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, diagnosticId: data.id };
}

export async function saveDiagnosticImage(
  diagnosticId: string,
  fileKey: string,
  fileName: string,
  fileSize: number
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const { error } = await supabase.from("diagnostic_images").insert({
    diagnostic_id: diagnosticId,
    file_key: fileKey,
    file_name: fileName,
    file_size: fileSize,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getUserDiagnostics() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado", data: [] };
  }

  const { data, error } = await supabase
    .from("panel_diagnostics")
    .select("*, diagnostic_images(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, data };
}

export async function getDiagnosticById(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const { data, error } = await supabase
    .from("panel_diagnostics")
    .select("*, diagnostic_images(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function deleteDiagnostic(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  await supabase
    .from("diagnostic_images")
    .delete()
    .eq("diagnostic_id", id);

  const { error } = await supabase
    .from("panel_diagnostics")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/portal/diagnostic");
  return { success: true };
}
