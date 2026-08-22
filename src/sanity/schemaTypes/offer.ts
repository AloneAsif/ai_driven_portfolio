import { defineField, defineType } from "sanity";

/**
 * Offer document — pricing packages shown on the pricing page and homepage teaser.
 * All prices/content come from Sanity — no hardcoded prices anywhere in the codebase.
 */
export const offer = defineType({
  name: "offer",
  title: "Offer",
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
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "Short subtitle (e.g., 'Full-stack website, 5 pages')",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (rule) => rule.required().min(0),
      description: "Store as plain number, e.g., 15000",
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      initialValue: "PKR",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "billingNote",
      title: "Billing Note",
      type: "string",
      description: 'e.g., "one-time" or "/month" for retainer-style offers',
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [{ type: "string" }],
      description: "Bullet list shown on the card",
    }),
    defineField({
      name: "popular",
      title: "Most Popular",
      type: "boolean",
      description: "Highlights the card as 'Most Popular'",
      initialValue: false,
    }),
    defineField({
      name: "ctaMessage",
      title: "WhatsApp CTA Message",
      type: "text",
      description: "Custom WhatsApp prefill text for this package. Falls back to generated default if empty.",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Manual sort control (lower = first)",
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      description: "Show/hide this offer without deleting it",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "tagline",
      media: "coverImage",
    },
  },
});