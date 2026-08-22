import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { codeInput } from "@sanity/code-input";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";
import { dataset, projectId } from "./src/sanity/env";

/**
 * Sanity Studio configuration.
 * Mounted in the Next.js app at `/studio` via `next-sanity/studio`.
 */
export default defineConfig({
  name: "portfolio",
  title: "Portfolio",
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [structureTool({ structure }), visionTool(), codeInput()],
  document: {
    // Used by the Presentation tool / Visual Editing to open published
    // content. Falls back to localhost until NEXT_PUBLIC_BASE_URL is set.
    productionUrl: async (prev, { document }) => {
      const base =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const slug = (document?.slug as { current?: string } | undefined)
        ?.current;
      if (!slug || !document?._type) return prev;
      if (document._type === "project") return `${base}/projects/${slug}`;
      if (document._type === "post") return `${base}/blog/${slug}`;
      if (document._type === "offer") return `${base}/pricing`;
      return prev;
    },
  },
});
