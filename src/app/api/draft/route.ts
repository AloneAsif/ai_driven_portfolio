import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/client";

/**
 * Enables Draft Mode so unpublished Sanity content can be previewed on the
 * site (Visual Editing / Presentation). Requires SANITY_API_READ_TOKEN.
 */
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
});
