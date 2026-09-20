import { defineField, defineType } from "sanity";

/**
 * Project document — portfolio pieces shown on the homepage (when featured)
 * and in the projects grid.
 */
export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      description: "Short description used on cards.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }, { type: "externalImage" }],
      description: "Full write-up. Add images from Sanity or external image URLs.",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
        }),
      ],
      description: "Upload a Sanity image, or use Cover Image URL below.",
    }),
    defineField({
      name: "coverImageUrl",
      title: "Cover Image URL",
      type: "url",
      description: "Direct image URL from Unsplash, Pexels, Pixabay, or another image host.",
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image" }],
      description: "Optional uploaded screenshots. External gallery images can be added below.",
    }),
    defineField({
      name: "externalGallery",
      title: "External Gallery Images",
      type: "array",
      of: [{ type: "externalImage" }],
      description: "Optional gallery images using direct URLs from stock image sites.",
    }),
    defineField({
      name: "techStack",
      title: "Tech Stack",
      type: "array",
      of: [{ type: "string" }],
      description: 'Tags such as "Next.js", "TypeScript".',
    }),
    defineField({
      name: "githubUrl",
      title: "GitHub URL",
      type: "url",
    }),
    defineField({
      name: "liveUrl",
      title: "Live URL",
      type: "url",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Show on the homepage.",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Manual sort control (lower = first).",
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "coverImage",
    },
  },
});
