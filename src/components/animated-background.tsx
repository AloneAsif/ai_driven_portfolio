"use client";

import { useEffect, useRef } from "react";

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

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Convert OKLab lightness + a/b axes to gamma-encoded sRGB (0-255). */
function oklabToRgb(L: number, a: number, b: number): RGB {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  const rLin = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  const toSrgb = (c: number) => {
    const v = clamp01(c);
    return Math.round(
      (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055) * 255,
    );
  };
  return { r: toSrgb(rLin), g: toSrgb(gLin), b: toSrgb(bLin) };
}

/**
 * Deterministically parse an `oklch(...)` CSS color to RGB. The theme tokens
 * are authored in OKLCH (Tailwind v4), and parsing them ourselves avoids
 * relying on canvas `fillStyle` support for OKLCH — a browser that rejects
 * the value silently paints black, which is invisible on dark themes.
 */
function parseOklch(value: string): RGB | null {
  const match = value.match(/^oklch\(\s*([\d.]+)(?:\s+([\d.]+)\s+([\d.]+))?/i);
  if (!match) return null;
  const L = clamp01(parseFloat(match[1]));
  const C = match[2] != null ? parseFloat(match[2]) : 0;
  const Hdeg = match[3] != null ? parseFloat(match[3]) : 0;
  const Hrad = (Hdeg * Math.PI) / 180;
  return oklabToRgb(L, C * Math.cos(Hrad), C * Math.sin(Hrad));
}

/** Fallback: resolve any other CSS color string via a 1px canvas probe. */
function probeCanvas(value: string): RGB | null {
  try {
    const probe = document.createElement("canvas");
    probe.width = 1;
    probe.height = 1;
    const ctx = probe.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = value;
    // A rejected color leaves `fillStyle` at its default (`#000000`); treat
    // that as "no color" rather than painting black.
    if (
      ctx.fillStyle === "#000000" &&
      value.toLowerCase() !== "black" &&
      value.toLowerCase() !== "#000"
    ) {
      return null;
    }
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    if (a === 0) return null;
    return { r, g, b };
  } catch {
    return null;
  }
}

/** Resolve a CSS custom-property value to {r,g,b}, or null when unparseable. */
function resolveColor(value: string): RGB | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return parseOklch(trimmed) ?? probeCanvas(trimmed);
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
  const colorsRef = useRef<{ foreground: RGB | null; primary: RGB | null }>({
    foreground: null,
    primary: null,
  });

  // Keep the particle/glow colors in sync with the active theme. The theme
  // class lives on <html>, so watch it directly — this re-syncs on manual
  // toggles and system-level theme changes without relying on a library hook.
  useEffect(() => {
    const sync = () => {
      const style = getComputedStyle(document.documentElement);
      const isDark = document.documentElement.classList.contains("dark");
      const fb = isDark
        ? { foreground: { r: 255, g: 255, b: 255 }, primary: { r: 240, g: 240, b: 240 } }
        : { foreground: { r: 20, g: 20, b: 20 }, primary: { r: 30, g: 30, b: 30 } };
      colorsRef.current.foreground =
        resolveColor(style.getPropertyValue("--foreground")) ?? fb.foreground;
      colorsRef.current.primary =
        resolveColor(style.getPropertyValue("--primary")) ?? fb.primary;
    };

    sync();

    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

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