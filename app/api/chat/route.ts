import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// Verified working free models on OpenRouter (in priority order)
const MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "qwen/qwen-2.5-72b-instruct:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
  "google/gemma-2-9b-it:free",
];

const SYSTEM_PROMPT = `You are Bilal's AI Assistant for W-Agency, a premium web design and development agency.

Your role:
1. Welcome the client warmly and professionally
2. Ask targeted questions to understand their project requirements  
3. Give an accurate price estimate based on W-Agency's strict pricing
4. Collect their full name and email before finalizing
5. Confirm their inquiry has been submitted to the designer

## STRICT PRICING RULES (NEVER go below these, NEVER give discounts):
- Basic frontend website (no animations): $100
- Modern frontend with basic animations: $130-$150
- Premium frontend with advanced animations + Premium UI/UX: $150-$200
- Full-stack website (database, auth, backend): $300-$350
- Full-stack with highly designed animated UI + Dashboard: $350-$450
- AI-integrated platform: add $100-$200 on top of base price
- E-commerce store: $250-$350
- SaaS platform: $400-$600

## BARGAINING RULE:
If a client asks for a discount or lower price, respond with:
"Our prices reflect the quality and speed of our delivery. What we can do is adjust the scope to fit your budget instead."
NEVER lower the price. NEVER make exceptions.

## CONVERSATION FLOW:
Stage 1 (greeting): Warmly welcome them, ask what type of website/app they need
Stage 2 (collecting): Ask follow-up questions:
  - What is the purpose? (business, portfolio, SaaS, e-commerce, etc.)
  - Do they need a backend/database?
  - Do they need animations or premium UI?
  - Do they need AI features?
  - Any special requirements?
Stage 3 (pricing): Give a clear price range and explain what's included
Stage 4 (summary): Ask for their full name and email address
Stage 5 (done): Once you have name + email + requirements, say exactly:
"Bilal's AI has understood your requirements. We are waiting for the designer to come online to review and confirm your project. We will send you an email shortly with his decision!"
Then write READY_TO_SUBMIT at the very end of your message.

## TONE RULES:
- Professional, warm, and concise (3-5 sentences per message)
- Max 1-2 emojis per message
- Never promise specific timelines`;

async function callAI(messages: any[]): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not configured");

  for (const model of MODELS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://w-agency.vercel.app",
          "X-Title": "W-Agency Chatbot",
        },
        body: JSON.stringify({ model, messages, max_tokens: 450, temperature: 0.7 }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.warn(`[Chat] Model ${model} → ${res.status}: ${errText.slice(0, 100)}`);
        continue;
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content?.trim();
      if (content) {
        console.log(`[Chat] Success with model: ${model}`);
        return content;
      }
    } catch (e: any) {
      console.warn(`[Chat] Model ${model} error: ${e.message}`);
      continue;
    }
  }

  throw new Error("All models failed to respond");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { sessionId, conversationId, message, history = [], userId } = body;

    if (!message?.trim()) {
      return NextResponse.json({ reply: "Please send a message." });
    }

    const supabase = await createServiceClient();

    // Get or create AI session
    const { data: existingSession } = await supabase
      .from("ai_sessions")
      .select("*")
      .eq("session_id", sessionId)
      .single();

    let session = existingSession;
    if (!session) {
      const { data } = await supabase.from("ai_sessions").insert({
        session_id: sessionId,
        user_id: userId || null,
        messages: [],
        stage: "greeting",
        collected_data: {},
      }).select().single();
      session = data;
    }

    // Build conversation history for AI
    const safeHistory = Array.isArray(history) ? history : [];
    const apiMessages = [
      {
        role: "system",
        content: `${SYSTEM_PROMPT}\n\n[CONTEXT]\nCurrent stage: ${session?.stage || "greeting"}\nData collected so far: ${JSON.stringify(session?.collected_data || {})}`,
      },
      // Skip welcome message (index 0), include the rest
      ...safeHistory.slice(1).map((m: any) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: String(m.content || ""),
      })),
      { role: "user", content: message.trim() },
    ];

    const reply = await callAI(apiMessages);

    // Detect stage progression from AI reply
    let newStage = session?.stage || "greeting";
    let collectedData = { ...(session?.collected_data || {}) };
    let readyToSubmit = false;

    const replyLower = reply.toLowerCase();
    if (replyLower.includes("what type") || replyLower.includes("what kind") || replyLower.includes("tell me about")) newStage = "collecting";
    if (reply.includes("$") && (reply.includes("-") || reply.includes("–") || reply.includes("to"))) newStage = "pricing";
    if (replyLower.includes("your name") || replyLower.includes("full name") || replyLower.includes("email address")) newStage = "summary";
    if (reply.includes("READY_TO_SUBMIT") || replyLower.includes("waiting for the designer")) {
      newStage = "done";
      readyToSubmit = true;
    }

    // Extract email from user message
    const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) collectedData.email = emailMatch[0];

    // Extract price estimate from AI reply
    const priceMatch = reply.match(/\$(\d+)(?:\s*[-–]\s*\$?(\d+))?/);
    if (priceMatch) {
      collectedData.estimatedPrice = priceMatch[2]
        ? Math.round((parseInt(priceMatch[1]) + parseInt(priceMatch[2])) / 2)
        : parseInt(priceMatch[1]);
    }

    // Update session
    await supabase.from("ai_sessions").update({
      stage: newStage,
      collected_data: collectedData,
      messages: [
        ...(Array.isArray(session?.messages) ? session.messages : []),
        { role: "user", content: message },
        { role: "assistant", content: reply },
      ],
    }).eq("session_id", sessionId);

    const cleanReply = reply.replace("READY_TO_SUBMIT", "").trim();

    // Create conversation in DB when ready
    if (readyToSubmit && userId && collectedData.email) {
      const { data: profile } = await supabase
        .from("profiles").select("*").eq("id", userId).single();

      const aiSummary = safeHistory
        .filter((m: any) => m.role === "assistant")
        .slice(-3)
        .map((m: any) => String(m.content || ""))
        .join(" ");

      let finalConvId = conversationId;
      if (!finalConvId) {
        const { data: conv } = await supabase.from("conversations").insert({
          client_id: userId,
          status: "pending",
          client_email: collectedData.email || profile?.email || "",
          client_name: profile?.full_name || "Client",
          ai_summary: aiSummary.slice(0, 1000),
          estimated_price: collectedData.estimatedPrice || null,
          project_description: message.slice(0, 500),
        }).select().single();

        if (conv) {
          finalConvId = conv.id;
          await supabase.from("messages").insert({
            conversation_id: conv.id,
            sender_id: userId,
            sender_role: "ai",
            content: `📋 AI Summary: ${aiSummary.slice(0, 500)}`,
          });
        }
      }

      if (finalConvId) {
        await supabase.from("ai_sessions")
          .update({ conversation_id: finalConvId })
          .eq("session_id", sessionId);
      }

      return NextResponse.json({ reply: cleanReply, stage: newStage, conversationId: finalConvId });
    }

    if (readyToSubmit && !userId) {
      return NextResponse.json({ requiresAuth: true, stage: "auth_required" });
    }

    return NextResponse.json({
      reply: cleanReply,
      stage: newStage,
      conversationId: conversationId || null,
    });

  } catch (error: any) {
    console.error("[Chat API Error]:", error.message);
    if (error.message?.includes("not configured")) {
      return NextResponse.json({ reply: "⚠️ API key not configured. Please contact the site owner." });
    }
    return NextResponse.json({ reply: "I'm having trouble connecting. Please try again in a moment." });
  }
}
