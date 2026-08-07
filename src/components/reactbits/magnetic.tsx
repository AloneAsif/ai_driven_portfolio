"use client";

import { useRef } from "react";

/**
 * Magnetic — React Bits style.
 *
 * The wrapped element is pulled gently toward the cursor while hovering and
 * springs back on leave. Pure pointer + transform, no dependencies.
 */
interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  /** How strongly the element follows the cursor (0–1). */
  strength?: number;
}

export function Magnetic({ children, className, strength = 0.3 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0px, 0px)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{
        display: "inline-block",
        willChange: "transform",
        transition: "transform 0.18s ease-out",
      }}
    >
      {children}
    </div>
  );
}
