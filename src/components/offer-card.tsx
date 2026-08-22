"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollReveal } from "@/components/reactbits/scroll-reveal";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import type { Offer } from "@/sanity/types";
import { cn } from "@/lib/utils";

interface OfferCardProps {
  offer: Offer;
  index?: number;
}

/**
 * Glass morphism offer card with animated light effects on hover.
 * Futuristic, premium feel with layered transparency and subtle motion.
 * Works in both light and dark modes.
 */
export function OfferCard({ offer, index = 0 }: OfferCardProps) {
  const price = `${offer.currency} ${offer.price.toLocaleString()}`;
  const billingNote = offer.billingNote ? ` ${offer.billingNote}` : "";
  const isPopular = offer.popular ?? false;

  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Build WhatsApp message
  const defaultMessage = `Hi! I'm interested in the ${offer.title} package (${price}${billingNote}). Can you share more details?`;
  const message = offer.ctaMessage ?? defaultMessage;
  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

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

    const card = cardRef.current;
    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  return (
    <ScrollReveal delay={index * 0.1} className="h-full">
      <div
        ref={cardRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative h-full perspective-1000"
      >
        {/* Deep ambient glow behind card - always visible, intensifies on hover */}
        <div
          className="pointer-events-none absolute -inset-4 rounded-[1.5rem] blur-3xl opacity-30 transition-opacity duration-700"
          style={{
            background: `radial-gradient(400px circle at center, rgba(34, 211, 238, 0.4), transparent 70%)`,
            opacity: isHovered ? 0.5 : 0.2,
          }}
          aria-hidden="true"
        />

        {/* Glass morphism card */}
        <Card
          className={cn(
            "relative h-full flex flex-col overflow-hidden",
            // Base glass layer - works in both light/dark
            "bg-gradient-to-br from-white/70 via-white/50 to-white/70 dark:from-neutral-900/70 dark:via-neutral-900/50 dark:to-neutral-900/70",
            "backdrop-blur-2xl",
            "border border-neutral-200/50 dark:border-neutral-800/50",
            "shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08),_0_0_0_1px_rgba(255,255,255,0.1)_inset] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4),_0_0_0_1px_rgba(255,255,255,0.03)_inset]",
            "transition-all duration-700 ease-out",
            // Hover state
            "hover:border-cyan-500/30 hover:shadow-[0_12px_48px_-8px_rgba(0,0,0,0.12),_0_0_0_1px_rgba(255,255,255,0.15)_inset,_0_0_60px_-10px_rgba(34,211,238,0.25)] dark:hover:shadow-[0_12px_48px_-8px_rgba(0,0,0,0.5),_0_0_0_1px_rgba(255,255,255,0.05)_inset,_0_0_60px_-10px_rgba(34,211,238,0.3)]",
            "hover:-translate-y-2 hover:scale-[1.015]",
            // Popular variant
            isPopular &&
              "border-cyan-500/40 shadow-[0_8px_32px_-6px_rgba(34,211,238,0.25),_0_0_0_1px_rgba(34,211,238,0.15)_inset] dark:border-cyan-500/50 dark:shadow-[0_8px_32px_-6px_rgba(34,211,238,0.35),_0_0_0_1px_rgba(34,211,238,0.2)_inset]",
            "focus-within:ring-2 focus-within:ring-cyan-500/40 focus-within:ring-offset-2 focus-within:ring-offset-background"
          )}
        >
          {/* Subtle inner highlight - top edge catch */}
          <div
            className="pointer-events-none absolute top-0 left-1 right-1 h-1.5 rounded-t-[1rem]"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,${isHovered ? 0.4 : 0.2}), transparent)`,
            }}
            aria-hidden="true"
          />

          {/* Animated border sweep on hover */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[1rem]"
            style={{
              boxShadow: isHovered
                ? "inset 0 0 0 1px rgba(34, 211, 238, 0.6), inset 0 0 60px -10px rgba(34, 211, 238, 0.15)"
                : "inset 0 0 0 1px rgba(0, 0, 0, 0.03)",
              transition: "box-shadow 0.6s ease-out",
            }}
            aria-hidden="true"
          />

          {/* Popular badge */}
          {isPopular && (
            <div className="relative z-10 -mt-3 mb-4 flex justify-center">
              <Badge
                variant="default"
                className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-cyan-500/15 to-blue-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 backdrop-blur-sm shadow-[0_0_20px_rgba(34,211,238,0.15)] animate-pulse"
              >
                Most Popular
              </Badge>
            </div>
          )}

          {/* Floating light orb that follows mouse */}
          {isHovered && mousePos && (
            <div
              className="pointer-events-none absolute rounded-full blur-2xl opacity-60 transition-all duration-300"
              style={{
                width: "300px",
                height: "300px",
                left: `${mousePos.x - 150}px`,
                top: `${mousePos.y - 150}px`,
                background: "radial-gradient(circle, rgba(34, 211, 238, 0.35), transparent 70%)",
              }}
              aria-hidden="true"
            />
          )}

          {/* Subtle corner accent glints */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 rounded-[1rem]",
              "bg-gradient-to-br from-cyan-500/5 via-transparent via-50% to-blue-500/5 dark:from-cyan-400/10 dark:to-blue-400/10",
              "opacity-0 hover:opacity-100 transition-opacity duration-700"
            )}
            aria-hidden="true"
          />

          <CardContent className="relative z-10 flex flex-col flex-1 gap-4 pt-(--card-spacing) pb-0 px-6">
            {/* Header with title and tagline */}
            <div className="text-center">
              <h3 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white">
                {offer.title}
              </h3>
              {offer.tagline && (
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 font-medium">{offer.tagline}</p>
              )}
            </div>

            {/* Price with shimmer effect */}
            <div className="flex items-baseline justify-center gap-2">
              <span className="font-heading text-3xl font-bold bg-gradient-to-r from-neutral-900 via-cyan-600 to-neutral-900 dark:from-white dark:via-cyan-400 dark:to-white bg-clip-text text-transparent animate-shimmer" style={{ backgroundSize: "200% auto" }}>
                {price}
              </span>
              {billingNote && (
                <span className="text-neutral-600 dark:text-neutral-400 font-medium">{billingNote}</span>
              )}
            </div>

            {/* Features list with staggered animation */}
            {offer.features && offer.features.length > 0 && (
              <ul className="flex-1 space-y-3" role="list">
                {offer.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-neutral-700/90 dark:text-neutral-300/90 transition-all duration-300 group"
                    style={{ transitionDelay: `${i * 50}ms` }}
                  >
                    <div className="relative flex-shrink-0">
                      <Check
                        className="size-5 text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] group-hover:scale-110 transition-transform"
                        aria-hidden="true"
                      />
                      {/* Checkmark glow on hover */}
                      <div
                        className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        aria-hidden="true"
                      />
                    </div>
                    <span className="leading-relaxed group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Floating particles on hover */}
            {isHovered && (
              <div
                className="absolute inset-0 pointer-events-none overflow-hidden rounded-[1rem]"
                aria-hidden="true"
              >
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-cyan-500/60 animate-float"
                    style={{
                      left: `${12 + (i * 14)}%`,
                      top: `${25 + (i * 8)}%`,
                      animationDelay: `${i * 0.4}s`,
                      animationDuration: `${3.5 + i * 0.4}s`,
                    }}
                  />
                ))}
                {[...Array(6)].map((_, i) => (
                  <div
                    key={`rev-${i}`}
                    className="absolute w-1 h-1 rounded-full bg-blue-500/40 animate-float"
                    style={{
                      right: `${15 + (i * 13)}%`,
                      top: `${30 + (i * 7)}%`,
                      animationDelay: `${0.2 + i * 0.35}s`,
                      animationDuration: `${4 + i * 0.3}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </CardContent>

          <CardFooter className="relative z-10 pt-0 px-6 pb-6">
            <Button
              asChild
              className={cn(
                "w-full justify-center gap-2 relative overflow-hidden",
                "bg-gradient-to-r from-green-500/90 via-emerald-500/90 to-green-600/90 hover:from-green-400 hover:via-emerald-400 hover:to-emerald-500",
                "text-white shadow-[0_0_20px_rgba(34,197,94,0.35)] hover:shadow-[0_0_35px_rgba(34,197,94,0.55)]",
                "backdrop-blur-sm border border-white/20 dark:border-white/10",
                "transition-all duration-300",
                "before:absolute before:inset-0 before:bg-gradient-to-r before:from-cyan-400/20 before:via-transparent before:to-blue-400/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity"
              )}
              variant="default"
              size="lg"
            >
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 w-full flex items-center justify-center gap-2"
              >
                <WhatsAppIcon size={18} className="drop-shadow-[0_0_4px_rgba(0,0,0,0.3)]" />
                <span className="font-medium tracking-wide">Ask on WhatsApp</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
          50% { transform: translateY(-18px) scale(1.3); opacity: 1; }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </ScrollReveal>
  );
}