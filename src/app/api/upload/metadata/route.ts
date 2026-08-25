import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { diagnosticId, fileKey, fileName, fileSize } = await request.json();

  if (!diagnosticId || !fileKey || !fileName) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  // Verify diagnostic belongs to user
  const { data: diagnostic } = await supabase
    .from("panel_diagnostics")
    .select("id")
    .eq("id", diagnosticId)
    .eq("user_id", user.id)
    .single();

  if (!diagnostic) {
    return NextResponse.json({ error: "Diagnóstico no encontrado" }, { status: 404 });
  }

  const { error } = await supabase.from("diagnostic_images").insert({
    diagnostic_id: diagnosticId,
    file_key: fileKey,
    file_name: fileName,
    file_size: fileSize || 0,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
