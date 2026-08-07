import "server-only";
import { sanityFetch } from "./live";
import { isSanityConfigured } from "../env";

/**
 * Server-side data fetching helper used by pages.
 *
 * When Sanity is not configured yet (empty project id), it returns `null`
 * instead of throwing, so the site renders placeholder content and the
 * dev server stays clean. Once env vars are set, live data flows through.
 */
export async function fetchSanity<T>(
  query: string,
  params: Record<string, unknown> = {},
  tags: string[] = [],
): Promise<T | null> {
  if (!isSanityConfigured) return null;

  try {
    const { data } = await sanityFetch({
      query,
      params,
      tags,
    });
    return data as T;
  } catch (error) {
    console.error("Sanity fetch failed:", error);
    return null;
  }
}
