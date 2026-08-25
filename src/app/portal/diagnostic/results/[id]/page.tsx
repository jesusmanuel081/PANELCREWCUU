import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import ResultsPageClient from "@/components/ResultsPageClient";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: diagnostic } = await supabase
    .from("panel_diagnostics")
    .select("*, diagnostic_images(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!diagnostic) notFound();

  return <ResultsPageClient diagnostic={diagnostic} />;
}
