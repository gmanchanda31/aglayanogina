import { defineField, defineType } from "sanity";

/**
 * An exhibition (solo or group). Lives at /exhibitions/<slug>.
 * Shape mirrors `project` — same fields, swap "kinds" for show-specific
 * metadata (curator, venue) which surface in the metadata stack.
 */
export const exhibition = defineType({
  name: "exhibition",
  title: "Exhibition",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 60 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "kind",
      title: "Type",
      type: "string",
      options: { list: ["Solo", "Group"] },
    }),
    defineField({ name: "year", title: "Year / range", type: "string" }),
    defineField({
      name: "venue",
      title: "Venue",
      type: "string",
      description: "e.g. KUT Gallery",
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      description: "e.g. Kyiv",
    }),
    defineField({
      name: "curator",
      title: "Curator",
      type: "string",
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
  orderings: [
    {
      title: "Year (newest first)",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "year", media: "hero" },
  },
});
