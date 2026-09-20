import { defineType } from "sanity";

export const externalImage = defineType({
  name: "externalImage",
  title: "External Image",
  type: "object",
  fields: [
    {
      name: "url",
      title: "Image URL",
      type: "url",
      validation: (rule) => rule.required(),
      description: "Use a direct image URL, not the page URL from the stock site.",
    },
    {
      name: "alt",
      title: "Alternative text",
      type: "string",
      validation: (rule) => rule.required(),
    },
    {
      name: "caption",
      title: "Caption",
      type: "string",
    },
  ],
  preview: {
    select: {
      title: "alt",
      subtitle: "url",
    },
  },
});