"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

/** Resolve a CSS color string (e.g. `oklch(...)`) to an {r,g,b} via a 1px canvas. */
function resolveColor(value: string): RGB | null {
  if (!value) return null;
  try {
    const probe = document.createElement("canvas");
    probe.width = 1;
    probe.height = 1;
    const ctx = probe.getContext("2d");
    if (!ctx) return null;
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    if (a === 0) return null;
    return { r, g, b };
  } catch {
    return null;
  }
}

const LINK_DIST = 130; // particles closer than this get a connection line
const MOUSE_LINK_DIST = 180; // particles within this of the cursor link to it
const GLOW_RADIUS = 240; // radius of the soft glow that follows the cursor

/**
 * Full-page animated background: soft drifting particles with faint
 * connection lines, and a gentle glow that follows the cursor. Colors are
 * read from the active theme tokens so it stays in sync with light/dark mode.
 * Sits behind all content (`z-0`, `pointer-events-none`) — mount once in the
 * `(site)` layout, outside the Sanity Studio route.
 */
export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const colorsRef = useRef<{ foreground: RGB | null; primary: RGB | null }>({
    foreground: null,
    primary: null,
  });

  // Keep the particle/glow colors in sync with the active theme.
  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    colorsRef.current.foreground =
      resolveColor(style.getPropertyValue("--foreground")) ??
      (resolvedTheme === "dark" ? { r: 255, g: 255, b: 255 } : { r: 20, g: 20, b: 20 });
    colorsRef.current.primary =
      resolveColor(style.getPropertyValue("--primary")) ??
      (resolvedTheme === "dark" ? { r: 240, g: 240, b: 240 } : { r: 30, g: 30, b: 30 });
  }, [resolvedTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;
    let particles: Particle[] = [];
    let raf = 0;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

    const initParticles = () => {
      const target = Math.min(
        90,
        Math.max(24, Math.floor((width * height) / 24000)),
      );
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1 + Math.random() * 1.7,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      initParticles();
    };

    const drawConnections = (fg: RGB) => {
      ctx.lineWidth = 1;
      const linkDist2 = LINK_DIST * LINK_DIST;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        // Links to other particles.
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDist2 && d2 > 0.01) {
            const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.13;
            ctx.strokeStyle = `rgba(${fg.r},${fg.g},${fg.b},${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // Link to the cursor when close enough.
        if (mouse.x > -1000 && mouse.y > -1000) {
          const dx = a.x - mouse.x;
          const dy = a.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < MOUSE_LINK_DIST * MOUSE_LINK_DIST) {
            const alpha = (1 - Math.sqrt(d2) / MOUSE_LINK_DIST) * 0.22;
            ctx.strokeStyle = `rgba(${fg.r},${fg.g},${fg.b},${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    };

    const drawParticles = (fg: RGB) => {
      for (const p of particles) {
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = `rgba(${fg.r},${fg.g},${fg.b},1)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const drawGlow = (primary: RGB) => {
      if (mouse.x < -1000) return;
      const g = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        GLOW_RADIUS,
      );
      g.addColorStop(0, `rgba(${primary.r},${primary.g},${primary.b},0.15)`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(
        mouse.x - GLOW_RADIUS,
        mouse.y - GLOW_RADIUS,
        GLOW_RADIUS * 2,
        GLOW_RADIUS * 2,
      );
    };

    const frame = () => {
      const { foreground, primary } = colorsRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Ease the cursor toward its latest position for a smooth trail.
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = width + 20;
        else if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        else if (p.y > height + 20) p.y = -20;
      }

      if (primary) drawGlow(primary);
      if (foreground) {
        drawConnections(foreground);
        drawParticles(foreground);
      }
      raf = requestAnimationFrame(frame);
    };

    const onPointerMove = (e: PointerEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // Respect reduced-motion: draw one static frame, no animation loop.
    if (reducedMotion) {
      const { foreground } = colorsRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      if (foreground) {
        drawConnections(foreground);
        drawParticles(foreground);
      }
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      if (typeof raf === "number") cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}