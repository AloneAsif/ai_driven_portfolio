"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as {
      name: string;
      email: string;
      message: string;
    };

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => null);

      if (json?.fallback) {
        setFallbackUrl(json.url as string);
        setStatus("success");
      } else if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success" && fallbackUrl) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-sm">
        <p className="font-heading font-medium">Almost there!</p>
        <p className="mt-1 text-muted-foreground">
          Email sending isn&apos;t configured yet, so your message is ready in
          your email client instead.{" "}
          <a
            href={fallbackUrl}
            className="font-medium text-primary underline underline-offset-3"
          >
            Open your email client
          </a>{" "}
          to send it. To enable automatic delivery, add a{" "}
          <code className="rounded bg-muted px-1 py-0.5">RESEND_API_KEY</code>{" "}
          to your environment.
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-dashed p-6 text-sm">
        <p className="font-heading font-medium">Thanks for reaching out!</p>
        <p className="mt-1 text-muted-foreground">
          Your message has been sent. I&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor="name"
            className="text-sm font-medium text-foreground"
          >
            Name
          </label>
          <Input id="name" name="name" required placeholder="Your name" />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="message"
          className="text-sm font-medium text-foreground"
        >
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Tell me about your project…"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message"}
        </Button>
        {status === "error" && (
          <p className="text-sm text-destructive">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </form>
  );
}
