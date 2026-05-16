import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";

/* GET /api/messages?conversation_id=xxx  – fetch messages for a conversation */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const conversationId = req.nextUrl.searchParams.get("conversation_id");
  if (!conversationId) return NextResponse.json({ error: "conversation_id required" }, { status: 400 });

  const service = await createServiceClient();

  // Verify the user owns this conversation or is designer
  const { data: conv } = await service
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .single();

  const { data: profile } = await service
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (conv.client_id !== user.id && profile?.role !== "designer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: messages } = await service
    .from("messages")
    .select("*, profiles(full_name, avatar_url, role)")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  // Mark messages as read
  await service
    .from("messages")
    .update({ is_read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", user.id);

  return NextResponse.json({ messages: messages || [], conversation: conv });
}

/* POST /api/messages – send a message */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { conversation_id, content } = await req.json();
  if (!conversation_id || !content?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const service = await createServiceClient();

  // Check conversation and block status
  const { data: conv } = await service
    .from("conversations")
    .select("*")
    .eq("id", conversation_id)
    .single();

  if (!conv) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  if (conv.is_client_blocked && conv.client_id === user.id) {
    return NextResponse.json({ error: "This conversation is closed." }, { status: 403 });
  }
  if (conv.status === "rejected" && conv.client_id === user.id) {
    return NextResponse.json({ error: "This conversation is closed." }, { status: 403 });
  }

  const { data: profile } = await service
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const senderRole = profile?.role === "designer" ? "designer" : "client";

  const { data: message, error } = await service
    .from("messages")
    .insert({
      conversation_id,
      sender_id: user.id,
      sender_role: senderRole,
      content: content.trim(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Update conversation updated_at
  await service
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversation_id);

  return NextResponse.json({ message });
}
