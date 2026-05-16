"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface Msg { id: string; content: string; sender_role: string; created_at: string; sender_id: string; }
interface Conv { id: string; status: string; project_description: string; estimated_price: number | null; ai_summary: string; client_name: string; }
interface Profile { id: string; full_name: string; role: string; }

export default function ClientMessagesView({
  conversation,
  profile,
}: {
  conversation: Conv | null;
  profile: Profile | null;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isBlocked = conversation?.status === "rejected";
  const isConfirmed = conversation?.status === "confirmed" || conversation?.status === "active";
  const isPending = conversation?.status === "pending";

  const fetchMessages = useCallback(async () => {
    if (!conversation?.id) return;
    const res = await fetch(`/api/messages?conversation_id=${conversation.id}`);
    const data = await res.json();
    if (data.messages) setMessages(data.messages);
    setLoading(false);
  }, [conversation?.id]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Realtime subscription
  useEffect(() => {
    if (!conversation?.id) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`conv:${conversation.id}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversation.id}`,
      }, (payload) => {
        setMessages((prev) => {
          if (prev.find((m) => m.id === payload.new.id)) return prev;
          return [...prev, payload.new as Msg];
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversation?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || sending || !conversation?.id || isBlocked) return;
    setSending(true);
    const content = input.trim();
    setInput("");
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversation_id: conversation.id, content }),
    });
    setSending(false);
  };

  // No conversation yet
  if (!conversation) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center mx-auto mb-6 text-3xl">💬</div>
          <h2 className="font-display font-800 text-2xl mb-3">No active project yet</h2>
          <p className="text-text-secondary mb-6">
            Start a conversation with Bilal's AI assistant to get a quote and submit your project.
          </p>
          <Link href="/" className="btn-primary inline-flex">Go to Portfolio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void flex flex-col">
      {/* Top bar */}
      <header className="glass border-b border-border-subtle px-4 sm:px-6 py-4 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-display font-800 text-white text-xs">W</div>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-700 text-sm truncate">Project Chat</h1>
          <div className={`text-xs mt-0.5 flex items-center gap-1.5 ${
            isBlocked ? "text-red-400" :
            isConfirmed ? "text-green-400" :
            "text-yellow-400"
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {isBlocked ? "Closed — Project declined" : isConfirmed ? "Active — Project accepted" : "Pending review"}
          </div>
        </div>
        {conversation.estimated_price && (
          <div className="price-badge text-sm hidden sm:block shrink-0">
            ${conversation.estimated_price.toLocaleString()}
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden max-w-4xl w-full mx-auto px-0 sm:px-4 sm:py-6 gap-4">
        {/* Sidebar info - hidden on mobile */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-4">
          <div className="glass border border-border-subtle rounded-2xl p-5">
            <h3 className="font-display font-600 text-xs text-text-muted uppercase tracking-widest mb-4">Project Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-text-muted text-xs">Status</span>
                <div className={`font-600 mt-0.5 capitalize ${isBlocked ? "text-red-400" : isConfirmed ? "text-green-400" : "text-yellow-400"}`}>
                  {conversation.status}
                </div>
              </div>
              {conversation.estimated_price && (
                <div>
                  <span className="text-text-muted text-xs">Estimate</span>
                  <div className="font-display font-700 text-accent text-lg">${conversation.estimated_price.toLocaleString()}</div>
                </div>
              )}
              {conversation.project_description && (
                <div>
                  <span className="text-text-muted text-xs">Description</span>
                  <p className="text-text-secondary text-xs mt-1 leading-relaxed">{conversation.project_description}</p>
                </div>
              )}
            </div>
          </div>

          {isPending && (
            <div className="glass-accent border border-accent/20 rounded-2xl p-4 text-sm">
              <div className="text-sm font-600 text-accent mb-1">⏳ Under Review</div>
              <p className="text-text-secondary text-xs leading-relaxed">Bilal is reviewing your project. You'll get an email once he responds.</p>
            </div>
          )}
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-void-2 sm:rounded-2xl sm:border border-border-subtle overflow-hidden min-h-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="spinner border-accent" style={{ width: 28, height: 28, borderWidth: 2 }} />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="text-4xl mb-4">👋</div>
                <p className="text-text-secondary text-sm">
                  {isPending ? "Your project is being reviewed. Messages will appear here once Bilal responds." : "Start the conversation!"}
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender_role === "client";
                const isAI = msg.sender_role === "ai";
                return (
                  <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-700 shrink-0 mt-1 ${
                      isMe ? "bg-accent text-white" :
                      isAI ? "bg-purple-500/20 border border-purple-500/30 text-purple-300" :
                      "bg-void-3 border border-border-subtle text-text-secondary"
                    }`}>
                      {isMe ? (profile?.full_name?.[0] || "C") : isAI ? "🤖" : "B"}
                    </div>
                    <div className={`max-w-[75%] sm:max-w-[70%] px-4 py-3 text-sm leading-relaxed rounded-2xl ${
                      isMe ? "chat-bubble-user rounded-tr-sm" :
                      isAI ? "bg-purple-900/20 border border-purple-500/20 text-text-primary rounded-tl-sm" :
                      "chat-bubble-ai rounded-tl-sm"
                    }`}>
                      {!isMe && (
                        <div className="text-xs text-text-muted mb-1 font-600">
                          {isAI ? "AI Summary" : "Bilal"}
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      <div className="text-[10px] mt-1.5 opacity-50">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border-subtle p-4">
            {isBlocked ? (
              <div className="text-center py-3 text-sm text-red-400 bg-red-500/5 rounded-xl border border-red-500/10">
                This conversation has been closed. You cannot send new messages.
              </div>
            ) : !isConfirmed ? (
              <div className="text-center py-3 text-sm text-yellow-400/80 bg-yellow-500/5 rounded-xl border border-yellow-500/10">
                Chat unlocks once your project is confirmed by Bilal.
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Type a message..."
                  className="input-field flex-1 py-3 text-sm"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || sending}
                  className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center text-white
                    hover:bg-accent-light disabled:opacity-40 transition-all hover:scale-105 shrink-0"
                >
                  {sending ? (
                    <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M14 2L7.5 8.5M14 2L9.5 14 7.5 8.5 2 6.5 14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
