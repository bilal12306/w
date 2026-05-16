import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { page, referrer, userAgent } = await req.json();

    // Get or create visitor ID from cookie
    const visitorId = req.cookies.get("_wv")?.value || uuidv4();

    const supabase = await createServiceClient();

    await supabase.from("page_views").insert({
      visitor_id: visitorId,
      page: page || "/",
      referrer: referrer || "",
      user_agent: userAgent || "",
    });

    const res = NextResponse.json({ ok: true });

    // Set visitor cookie for 1 year
    if (!req.cookies.get("_wv")) {
      res.cookies.set("_wv", visitorId, {
        maxAge: 365 * 24 * 60 * 60,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    return res;
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
