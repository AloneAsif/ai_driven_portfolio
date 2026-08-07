import { NextResponse, type NextRequest } from "next/server";
import { siteConfig } from "@/lib/site";

/**
 * Contact form endpoint.
 *
 * - If RESEND_API_KEY is set, sends the message via the Resend HTTP API
 *   (no SDK required).
 * - Otherwise returns a fallback `mailto:` URL so the client can hand the
 *   message to the visitor's email client.
 */
export async function POST(request: NextRequest) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email and message are required" },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev",
        to: process.env.CONTACT_TO_EMAIL ?? email,
        reply_to: email,
        subject: `New message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  }

  // Fallback: build a mailto: link the client can hand off to the browser.
  const subject = encodeURIComponent(`Message from ${name}`);
  const mailBody = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
  const url = `mailto:${siteConfig.author.email}?subject=${subject}&body=${mailBody}`;

  return NextResponse.json({ ok: true, fallback: true, url });
}
