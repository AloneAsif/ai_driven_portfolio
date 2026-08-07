import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

/**
 * Base Sanity client used by the server for GROQ queries.
 * For live/preview data use `sanityFetch` from `lib/live.ts`.
 *
 * When a Sanity project isn't configured yet (empty NEXT_PUBLIC_SANITY_PROJECT_ID)
 * we still construct the client with a placeholder id so the app compiles and
 * runs. Nothing is ever queried against it — `fetchSanity` short-circuits to
 * `null` until real credentials are provided in `.env.local`.
 */
export const client = createClient({
  projectId: projectId || "placeholder-project-id",
  dataset,
  apiVersion,
  // `useCdn: false` queries the API directly so content is always fresh.
  // (The apicdn.sanity.io CDN hostname is not resolvable on this network,
  // and a portfolio benefits from up-to-date content anyway.)
  useCdn: false,
});
