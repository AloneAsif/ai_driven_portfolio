"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";

interface GalleryLightboxProps {
  images: SanityImageSource[];
  title: string;
  /** Full-size display width for the lightbox image (raw source when omitted). */
  maxWidth?: number;
}

/**
 * Interactive gallery: each thumbnail opens a full-screen lightbox where the
 * image is shown at (near) full size, with previous/next navigation and
 * keyboard support (Esc closes, ←/→ moves). Body scroll is locked while open.
 */
export function GalleryLightbox({
  images,
  title,
  maxWidth = 2400,
}: GalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isOpen = activeIndex !== null;

  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length],
  );
  const prev = useCallback(
    () =>
      setActiveIndex((i) =>
        i === null ? null : (i - 1 + images.length) % images.length,
      ),
    [images.length],
  );

  // Lock body scroll while the lightbox is open.
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Keyboard navigation + focus management.
  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      else if (event.key === "ArrowRight") next();
      else if (event.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close, next, prev]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {images.map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Open ${title} image ${index + 1} in full size`}
            className="group relative block w-full overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Image
              src={urlFor(image).url()}
              alt={`${title} ${index + 1}`}
              width={800}
              height={600}
              className="w-full rounded-lg transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(min-width: 640px) 50vw, 100vw"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
              <ZoomIn className="size-8 text-white" aria-hidden="true" />
            </span>
          </button>
        ))}
      </div>

      {isOpen &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} image ${activeIndex + 1} of ${images.length}`}
            className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm"
            onClick={close}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between p-3 sm:p-4">
              <p className="px-2 text-sm text-white/80">
                {activeIndex! + 1} / {images.length}
              </p>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={close}
                aria-label="Close image viewer"
                className="rounded-full p-2 text-white/90 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="size-6" />
              </button>
            </div>

            {/* Image area */}
            <div className="relative flex flex-1 items-center justify-center overflow-hidden px-12 sm:px-16">
              <Image
                src={urlFor(images[activeIndex!])
                  .width(maxWidth)
                  .fit("max")
                  .auto("format")
                  .url()}
                alt={`${title} ${activeIndex! + 1} at full size`}
                fill
                className="object-contain"
                sizes="100vw"
                onClick={(e) => e.stopPropagation()}
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      prev();
                    }}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-6"
                  >
                    <ChevronLeft className="size-6" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      next();
                    }}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6"
                  >
                    <ChevronRight className="size-6" />
                  </button>
                </>
              )}
            </div>

            {/* Caption */}
            <p className={cn("px-4 py-4 text-center text-xs text-white/60 sm:py-5")}>
              {title}
            </p>
          </div>,
          document.body,
        )}
    </>
  );
}