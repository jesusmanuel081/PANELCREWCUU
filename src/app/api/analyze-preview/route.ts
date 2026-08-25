import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ML_API_URL = process.env.ML_API_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const { imageUrls, diagnosticId } = await req.json();

    if (!imageUrls || imageUrls.length === 0) {
      return NextResponse.json({ error: "imageUrls required" }, { status: 400 });
    }

    const images = imageUrls.map((url: string, idx: number) => ({
      image_url: url,
      filename: `panel_${idx + 1}.jpg`,
    }));

    const mlResponse = await fetch(`${ML_API_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        diagnostic_id: diagnosticId || "preview",
        images,
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
    return NextResponse.json(
      { error: (error as Error).message || "Analysis failed" },
      { status: 500 }
    );
  }
}
