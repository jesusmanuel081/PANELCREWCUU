import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ML_API_URL = process.env.ML_API_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { diagnosticId } = await req.json();

    if (!diagnosticId) {
      return NextResponse.json({ error: "diagnosticId required" }, { status: 400 });
    }

    // Get diagnostic and its images
    const { data: diagnostic, error: diagError } = await supabase
      .from("panel_diagnostics")
      .select("*, diagnostic_images(*)")
      .eq("id", diagnosticId)
      .eq("user_id", user.id)
      .single();

    if (diagError || !diagnostic) {
      return NextResponse.json({ error: "Diagnostic not found" }, { status: 404 });
    }

    if (!diagnostic.diagnostic_images || diagnostic.diagnostic_images.length === 0) {
      return NextResponse.json({ error: "No images uploaded" }, { status: 400 });
    }

    // Update status to analyzing
    await supabase
      .from("panel_diagnostics")
      .update({ status: "analyzing" })
      .eq("id", diagnosticId);

    // Generate presigned URLs for each image
    const imageUrls = await Promise.all(
      diagnostic.diagnostic_images.map(async (img: { file_name: string; file_key: string }) => {
        const uploadRes = await fetch(`${req.nextUrl.origin}/api/upload`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileKey: img.file_key }),
        });

        if (!uploadRes.ok) {
          throw new Error(`Failed to get URL for ${img.file_name}`);
        }

        const { downloadUrl } = await uploadRes.json();
        return {
          image_url: downloadUrl,
          filename: img.file_name,
        };
      })
    );

    // Call ML API
    const mlResponse = await fetch(`${ML_API_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        diagnostic_id: diagnosticId,
        images: imageUrls,
      }),
    });

    if (!mlResponse.ok) {
      const errorData = await mlResponse.json().catch(() => ({}));
      throw new Error(errorData.detail || "ML API error");
    }

    const result = await mlResponse.json();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);

    // Update diagnostic status to failed
    const { diagnosticId } = await req.json().catch(() => ({}));
    if (diagnosticId) {
      const supabase = await createClient();
      await supabase
        .from("panel_diagnostics")
        .update({ status: "failed" })
        .eq("id", diagnosticId);
    }

    return NextResponse.json(
      { error: (error as Error).message || "Analysis failed" },
      { status: 500 }
    );
  }
}
