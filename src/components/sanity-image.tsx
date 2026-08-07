import { Image } from "next-sanity/image";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/lib/image";

interface SanityImageProps {
  asset?: SanityImageSource | null;
  alt?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
  fill?: boolean;
}

/**
 * Renders a Sanity image asset through Next.js <Image> with automatic
 * srcSet generation via the Sanity CDN. Returns null when no asset is set.
 */
export function SanityImage({
  asset,
  alt,
  width,
  height,
  priority,
  sizes,
  className,
  fill,
}: SanityImageProps) {
  if (!asset) return null;

  const src = urlFor(asset).url();

  return (
    <Image
      src={src}
      alt={alt ?? ""}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes}
      className={className}
      fill={fill}
    />
  );
}
