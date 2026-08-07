// Sanity environment configuration.
// All values come from environment variables (see .env.local / .env.example).
// Leave NEXT_PUBLIC_SANITY_PROJECT_ID empty until you have created a Sanity
// project — the app still compiles and renders placeholder content, and the
// embedded Studio will show a "missing projectId" message until it's filled in.

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-02-01";

export const readToken = process.env.SANITY_API_READ_TOKEN;

/** True when a Sanity project has been configured. */
export const isSanityConfigured = projectId.length > 0;
