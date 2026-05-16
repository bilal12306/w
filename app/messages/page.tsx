import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ClientMessagesView from "./ClientMessagesView";

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirect=/messages");

  // Get user's conversation
  const { data: conversation } = await supabase
    .from("conversations")
    .select("*")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return <ClientMessagesView conversation={conversation} profile={profile} />;
}
