"use client";

import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { cn } from "@/lib/utils";

/**
 * Floating WhatsApp button — fixed bottom-left.
 * Glass morphism style matching the offer cards.
 * Separate from the AI chat widget (which is bottom-right).
 * Opens wa.me with a default greeting message.
 */
export function WhatsAppButton() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  const defaultMessage =
    "Hi! I found your portfolio and wanted to ask about a project.";
  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(defaultMessage)}`;

  // Track mouse position for light follow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseLeave = () => {
      setMousePos(null);
    };

    const button = buttonRef.current;
    if (button) {
      button.addEventListener("mousemove", handleMouseMove);
      button.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        button.removeEventListener("mousemove", handleMouseMove);
        button.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  // Don't render inside the Sanity Studio.
  if (pathname.startsWith("/studio")) return null;

  return (
    <a
      ref={buttonRef}
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "fixed bottom-4 left-4 z-40 flex h-14 w-14 items-center justify-center rounded-2xl",
        "overflow-hidden",
        // Base glass layer
        "bg-gradient-to-br from-white/5 via-white/3 to-white/5 dark:from-white/3 dark:via-white/2 dark:to-white/5",
        "backdrop-blur-2xl",
        "border border-white/10 dark:border-white/5",
        "shadow-[0_4px_24px_-4px_rgba(0,0,0,0.3),_0_0_0_1px_rgba(255,255,255,0.05)_inset]",
        "transition-all duration-500 ease-out",
        // Hover state
        "hover:border-white/20 hover:shadow-[0_8px_32px_-6px_rgba(0,0,0,0.4),_0_0_0_1px_rgba(255,255,255,0.1)_inset,_0_0_40px_-8px_rgba(34,211,238,0.3)]",
        "hover:scale-105 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      )}
    >
      {/* Deep ambient glow behind button */}
      <div
        className="pointer-events-none absolute -inset-2 rounded-[1.2rem] blur-2xl opacity-30 transition-opacity duration-500"
        style={{
          background: "radial-gradient(200px circle at center, rgba(34, 197, 94, 0.5), transparent 70%)",
          opacity: isHovered ? 0.6 : 0.25,
        }}
        aria-hidden="true"
      />

      {/* Inner highlight - top edge catch */}
      <div
        className="pointer-events-none absolute top-0 left-1 right-1 h-1.5 rounded-t-[1rem]"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,${isHovered ? 0.3 : 0.12}), transparent)`,
        }}
        aria-hidden="true"
      />

      {/* Animated border sweep on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          boxShadow: isHovered
            ? "inset 0 0 0 1px rgba(34, 197, 94, 0.6), inset 0 0 40px -8px rgba(34, 197, 94, 0.2)"
            : "inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
          transition: "box-shadow 0.5s ease-out",
        }}
        aria-hidden="true"
      />

      {/* Floating light orb that follows mouse */}
      {isHovered && mousePos && (
        <div
          className="pointer-events-none absolute rounded-full blur-2xl opacity-60 transition-all duration-200"
          style={{
            width: "180px",
            height: "180px",
            left: `${mousePos.x - 90}px`,
            top: `${mousePos.y - 90}px`,
            background: "radial-gradient(circle, rgba(34, 197, 94, 0.4), transparent 70%)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Corner accent glints */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/10 via-transparent via-50% to-emerald-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500"
        aria-hidden="true"
      />

      {/* Icon */}
      <WhatsAppIcon size={26} strokeWidth={2.5} className="relative z-10 drop-shadow-[0_0_6px_rgba(0,0,0,0.4)]" />
    </a>
  );
}