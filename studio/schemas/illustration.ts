import { defineField, defineType } from "sanity";

/**
 * Illustration series (e.g. Schmalgauzen covers, The Eustomes).
 * Lives at /illustrations/<slug>.
 */
export const illustration = defineType({
  name: "illustration",
  title: "Illustration series",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 60 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "year", title: "Year / range", type: "string" }),
    defineField({
      name: "medium",
      type: "string",
      description: "e.g. 'Pen and ink on paper'",
    }),
    defineField({
      name: "client",
      title: "Client / commission",
      type: "string",
      description: "Optional — e.g. 'Schmalgauzen, album artwork'",
    }),
    defineField({
      name: "hero",
      title: "Hero image",
      type: "imageWithAlt",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      type: "portableText",
    }),
    defineField({
      name: "gallery",
      type: "array",
      of: [{ type: "imageWithAlt" }],
      options: { layout: "grid" },
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "year", media: "hero" },
  },
});
