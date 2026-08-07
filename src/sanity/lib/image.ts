import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "../client";

const builder = createImageUrlBuilder(client);

/** Builds a Sanity Image CDN URL for a given asset/source. */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
