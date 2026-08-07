"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Loader2, MessageSquare, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_CHATBOT_API_URL;

const FALLBACK =
  "Having trouble reaching the assistant right now — feel free to check the Projects page or use the Contact form instead.";

interface Source {
  type: string;
  title: string;
  slug: string;
  url: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

function sourceHref(source: Source) {
  if (source.url) return source.url;
  if (source.type === "post") return `/blog/${source.slug}`;
  if (source.type === "project") return `/projects/${source.slug}`;
  return "#";
}

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [waking, setWaking] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Don't render inside the Sanity Studio.
  if (pathname.startsWith("/studio")) return null;

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Escape closes the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Click-outside closes the panel.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // Keep the newest message in view.
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, sending]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;

    const history = messages.slice(-6).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setSending(true);
    setWaking(false);

    // Free-tier backends go cold; show a note if it's slow to answer.
    const wakeTimer = setTimeout(() => setWaking(true), 5000);

    try {
      if (!API_URL) throw new Error("NEXT_PUBLIC_CHATBOT_API_URL is not set");
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      const data = (await res.json()) as { answer: string; sources?: Source[] };
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.answer, sources: data.sources ?? [] },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: FALLBACK, sources: [] },
      ]);
    } finally {
      clearTimeout(wakeTimer);
      setWaking(false);
      setSending(false);
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void send();
  };

  return (
    <>
      {/* Floating toggle — shown when the panel is closed. */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open chat with the assistant"
          className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <MessageSquare className="size-5" />
        </button>
      )}

      {/* Panel — near full-height on mobile, a box on sm+. */}
      {open && (
        <div
          ref={panelRef}
          className="fixed inset-x-3 bottom-20 z-50 flex h-[70vh] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-xl sm:inset-x-auto sm:right-4 sm:h-[520px] sm:max-h-[calc(100vh-8rem)] sm:w-96"
        >
          <header className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <p className="font-heading text-sm font-semibold">Chat with me</p>
              <p className="text-xs text-muted-foreground">
                Ask about my projects or posts.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X className="size-4" />
            </Button>
          </header>

          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Hi — ask me anything about the projects or posts here.
              </p>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-xl px-3 py-2 text-sm",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.sources.map((s) => (
                        <Link
                          key={s.url || `${s.type}-${s.slug}`}
                          href={sourceHref(s)}
                          className="inline-flex max-w-full items-center rounded-full border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <span className="truncate">{s.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-sm text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" />
                  {waking ? "Waking up, almost there…" : "Thinking…"}
                </div>
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="border-t p-3">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                aria-label="Message"
                className="h-9"
              />
              <Button
                type="submit"
                size="icon"
                disabled={sending || !input.trim()}
                aria-label="Send message"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
