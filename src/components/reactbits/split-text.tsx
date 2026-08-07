"use client";

import { useEffect, useRef } from "react";

/**
 * SplitText — React Bits style.
 *
 * Splits text into per-character spans that rise into place with a stagger
 * when the element scrolls into view. The full text stays available via
 * `aria-label` for screen readers. Respects `prefers-reduced-motion`.
 */
interface SplitTextProps {
  text: string;
  as?: React.ElementType;
  className?: string;
  /** Extra delay in seconds before the first character starts. */
  delay?: number;
  /** Animation duration in seconds. */
  duration?: number;
  /** Seconds between each character starting. */
  stagger?: number;
}

export function SplitText({
  text,
  as,
  className,
  delay = 0,
  duration = 0.6,
  stagger = 0.025,
}: SplitTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const Tag = (as ?? "span") as React.ElementType;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const container = document.createElement("span");
    container.style.display = "inline-block";

    text.split(" ").forEach((word) => {
      const wordSpan = document.createElement("span");
      wordSpan.style.display = "inline-block";
      wordSpan.style.whiteSpace = "nowrap";

      for (const char of word) {
        const charSpan = document.createElement("span");
        charSpan.textContent = char;
        charSpan.style.display = "inline-block";
        charSpan.style.opacity = "0";
        charSpan.style.transform = "translateY(0.4em) rotate(4deg)";
        charSpan.style.transition =
          `opacity ${duration}s ease, transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1)`;
        wordSpan.appendChild(charSpan);
      }
      container.appendChild(wordSpan);
      container.appendChild(document.createTextNode(" "));
    });
    // Remove the trailing space.
    if (container.lastChild?.nodeType === Node.TEXT_NODE) {
      container.lastChild.remove();
    }

    el.replaceChildren(container);

    const chars = Array.from(
      container.querySelectorAll<HTMLElement>("span span"),
    );

    const reveal = () => {
      chars.forEach((char, i) => {
        char.style.transitionDelay = `${(delay + i * stagger).toFixed(3)}s`;
        char.style.opacity = "1";
        char.style.transform = "translateY(0) rotate(0deg)";
      });
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      chars.forEach((char) => {
        char.style.opacity = "1";
        char.style.transform = "none";
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal();
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.5 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [text, delay, duration, stagger]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text}
    </Tag>
  );
}
