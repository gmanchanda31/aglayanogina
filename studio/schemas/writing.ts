import { defineField, defineType } from "sanity";

/**
 * A literary essay. Lives at /writings/<slug>.
 * Body is rich text (portableText) with support for drop caps and
 * inline pull quotes — both render as their respective React components
 * on the site.
 */
export const writing = defineType({
  name: "writing",
  title: "Writing",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 60 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description:
        "Used on the writings index and as the meta description. Keep ~150 characters.",
      validation: (r) => r.max(280).warning("Excerpts read best under 280 chars."),
    }),
    defineField({
      name: "body",
      title: "Essay body",
      type: "portableText",
      validation: (r) => r.required(),
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
    select: { title: "title", subtitle: "year" },
  },
});
