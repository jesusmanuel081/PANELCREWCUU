import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPresignedUploadUrl, getPresignedDownloadUrl, buildFileKey } from "@/lib/r2";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { diagnosticId, fileName, contentType } = await request.json();

  if (!diagnosticId || !fileName || !contentType) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json({ error: "Tipo de archivo no permitido" }, { status: 400 });
  }

  // Verify diagnostic belongs to user
  const { data: diagnostic } = await supabase
    .from("panel_diagnostics")
    .select("id, user_id")
    .eq("id", diagnosticId)
    .eq("user_id", user.id)
    .single();

  if (!diagnostic) {
    return NextResponse.json({ error: "Diagnóstico no encontrado" }, { status: 404 });
  }

  // Check image count limit
  const { count } = await supabase
    .from("diagnostic_images")
    .select("*", { count: "exact", head: true })
    .eq("diagnostic_id", diagnosticId);

  if (count && count >= 12) {
    return NextResponse.json({ error: "Máximo 12 imágenes por diagnóstico" }, { status: 400 });
  }

  const fileKey = buildFileKey(user.id, diagnosticId, fileName);

  try {
    const uploadUrl = await getPresignedUploadUrl(fileKey, contentType);
    return NextResponse.json({ uploadUrl, fileKey });
  } catch (error) {
    return NextResponse.json(
      { error: "Error generando URL de subida" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const { fileKey } = await request.json();

  if (!fileKey) {
    return NextResponse.json({ error: "fileKey required" }, { status: 400 });
  }

  try {
    const downloadUrl = await getPresignedDownloadUrl(fileKey);
    return NextResponse.json({ downloadUrl });
  } catch (error) {
    return NextResponse.json(
      { error: "Error generando URL de descarga" },
      { status: 500 }
    );
  }
}
