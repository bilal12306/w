"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface Message { id: string; role: "user" | "assistant"; content: string; }

const WELCOME = `Hello! I'm **Bilal's AI Assistant** 👋\n\nI'm here to understand your project needs and give you an accurate price estimate.\n\nWhat kind of website or app are you looking to build?`;

function renderContent(content: string) {
  if (!content) return "";
  return content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [requiresAuth, setRequiresAuth] = useState(false);
  const [user, setUser] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
      const { data: sub } = supabase.auth.onAuthStateChange((_, session) => setUser(session?.user ?? null));
      return () => sub?.subscription?.unsubscribe();
    } catch (e) {
      console.warn("Supabase init error:", e);
    }
  }, []);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ id: "welcome", role: "assistant", content: WELCOME }]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg: Message = { id: `u_${Date.now()}`, role: "user", content: text };
    setMessages((p) => [...p, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId, conversationId,
          message: text,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          userId: user?.id ?? null,
        }),
      });

      let data: any = {};
      try { data = await res.json(); } catch { data = {}; }

      if (data.requiresAuth) {
        setRequiresAuth(true);
        setMessages((p) => [...p, { id: `a_${Date.now()}`, role: "assistant", content: "To submit your project, please **create a free account** — it only takes 30 seconds! 🚀" }]);
        return;
      }

      if (data.conversationId) setConversationId(data.conversationId);

      // Always fall back to a safe string — never let content be undefined
      const reply = data.reply || data.message || "I had a little hiccup. Could you repeat that?";
      setMessages((p) => [...p, { id: `a_${Date.now()}`, role: "assistant", content: reply }]);

    } catch (e) {
      setMessages((p) => [...p, { id: `e_${Date.now()}`, role: "assistant", content: "Connection issue. Please try again in a moment." }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [input, loading, messages, sessionId, conversationId, user]);

  return (
    <>
      <button
        data-chatbot-trigger
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-accent text-white
          font-display font-600 text-sm rounded-full shadow-2xl transition-all duration-300
          hover:bg-accent-light hover:scale-105 px-4 sm:px-5 py-3 sm:py-3.5"
        style={{ boxShadow: "0 0 0 1px rgba(94,75,240,0.4), 0 8px 40px rgba(94,75,240,0.5)" }}
      >
        <div className="relative shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13.5 1.5h-11C1.67 1.5 1 2.17 1 3v9c0 .83.67 1.5 1.5 1.5H5l2 2 2-2h4.5c.83 0 1.5-.67 1.5-1.5V3c0-.83-.67-1.5-1.5-1.5Z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
            <circle cx="5" cy="7.5" r="1" fill="currentColor"/>
            <circle cx="8" cy="7.5" r="1" fill="currentColor"/>
            <circle cx="11" cy="7.5" r="1" fill="currentColor"/>
          </svg>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-accent" />
        </div>
        <span className="hidden sm:block whitespace-nowrap">Talk with the Designer</span>
        <span className="sm:hidden">Chat</span>
      </button>

      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[380px] max-w-[420px]
          bg-void-2 border border-border-subtle rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ height: "min(580px, 82vh)", boxShadow: "0 0 0 1px rgba(94,75,240,0.12), 0 24px 80px rgba(0,0,0,0.7)" }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border-subtle bg-void-3/60 shrink-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center text-base">🤖</div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-void-3" />
            </div>
            <div className="flex-1">
              <div className="font-display font-700 text-sm">Bilal's AI Assistant</div>
              <div className="text-[10px] text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />Online · Instant replies
              </div>
            </div>
            <button onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-lg hover:bg-void-2 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors text-xl leading-none">×</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-accent/15 border border-accent/20 flex items-center justify-center text-xs shrink-0 mt-1">🤖</div>
                )}
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 text-sm leading-relaxed rounded-2xl
                    ${msg.role === "user" ? "bg-accent text-white rounded-br-sm" : "bg-void-3 border border-border-subtle text-text-primary rounded-bl-sm"}`}
                  dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
                />
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5">
                <div className="w-6 h-6 rounded-full bg-accent/15 border border-accent/20 flex items-center justify-center text-xs shrink-0 mt-1">🤖</div>
                <div className="bg-void-3 border border-border-subtle rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1 items-center h-4">
                    {[0, 0.15, 0.3].map((d, i) => (
                      <span key={i} className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {requiresAuth && (
              <div className="flex flex-col gap-2 mt-1">
                <Link href="/auth/signup" className="flex items-center justify-center gap-2 bg-accent text-white font-display font-600 text-sm py-3 rounded-xl hover:bg-accent-light transition-colors">
                  Create Free Account →
                </Link>
                <Link href="/auth/login" className="flex items-center justify-center gap-2 border border-border-subtle text-text-secondary font-600 text-sm py-2.5 rounded-xl hover:border-border-accent transition-colors">
                  Sign In
                </Link>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 px-4 pb-4 pt-3 border-t border-border-subtle">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Describe your project..."
                className="flex-1 py-2.5 px-4 bg-void-3 border border-border-subtle rounded-xl text-text-primary text-sm placeholder-text-muted outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all"
                disabled={loading || requiresAuth}
              />
              <button onClick={sendMessage} disabled={!input.trim() || loading || requiresAuth}
                className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 shrink-0">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M12 2L6.5 7.5M12 2L8 12 6.5 7.5 1.5 6 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-text-muted mt-2 text-center">Powered by Llama 4 · Estimates may vary</p>
          </div>
        </div>
      )}
    </>
  );
}
