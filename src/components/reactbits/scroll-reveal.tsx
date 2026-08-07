"use client";

import { useEffect, useRef } from "react";

/**
 * ScrollReveal — React Bits style.
 *
 * Animates every direct child in from below with a stagger when the
 * container scrolls into view. Uses the Web Animations API, so there is
 * no animation library dependency. Respects `prefers-reduced-motion`.
 */
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Seconds between each child starting its animation. */
  stagger?: number;
  /** Extra delay in seconds before the first child starts. */
  delay?: number;
  /** Animation duration in seconds. */
  duration?: number;
  /** Initial vertical offset in pixels. */
  y?: number;
}

export function ScrollReveal({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  duration = 0.6,
  y = 24,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = Array.from(el.children) as HTMLElement[];

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((item) => {
        item.style.opacity = "1";
        item.style.transform = "none";
      });
      return;
    }

    // Hide up-front so above-the-fold content doesn't flash before animating.
    items.forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = `translateY(${y}px)`;
    });

    const play = () => {
      items.forEach((item, i) => {
        item.animate(
          [
            { opacity: 0, transform: `translateY(${y}px)` },
            { opacity: 1, transform: "translateY(0px)" },
          ],
          {
            duration: duration * 1000,
            delay: (delay + i * stagger) * 1000,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "both",
          },
        );
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            play();
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [stagger, delay, duration, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
