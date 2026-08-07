import "server-only";
import { defineLive } from "next-sanity/live";
import { client } from "../client";
import { readToken } from "../env";

/**
 * `sanityFetch` is a cache-aware fetch wrapper for server components.
 * `<SanityLive />` subscribes the client to real-time updates from Sanity.
 * Render `<SanityLive />` once in the root layout.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  // Required for draft/preview content. Set SANITY_API_READ_TOKEN in .env.local.
  serverToken: readToken,
  browserToken: readToken,
});
