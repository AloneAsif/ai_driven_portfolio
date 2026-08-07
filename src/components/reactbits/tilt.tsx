"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Tilt — React Bits style.
 *
 * Gives the wrapped element a subtle 3D perspective tilt that follows the
 * cursor and settles back on leave. No dependencies.
 */
interface TiltProps {
  children: React.ReactNode;
  className?: string;
  /** Maximum tilt in degrees. */
  strength?: number;
}

export function Tilt({ children, className, strength = 6 }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform =
      `perspective(900px) rotateY(${(px * strength).toFixed(2)}deg)` +
      ` rotateX(${(-py * strength).toFixed(2)}deg)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("will-change-transform", className)}
      style={{
        transformStyle: "preserve-3d",
        transition: "transform 0.18s ease-out",
      }}
    >
      {children}
    </div>
  );
}
