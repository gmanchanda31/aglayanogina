import { defineField, defineType } from "sanity";
import { CaseIcon } from "@sanity/icons";

/**
 * A body of work. Lives at /projects/<slug>.
 *
 * The shape is shared (almost identically) by exhibition and illustration —
 * each is a separate document type so they show up as separate sections
 * in the studio sidebar, but the schema is intentionally consistent.
 */
export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  icon: CaseIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "title", maxLength: 60 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year / range",
      type: "string",
      description: "e.g. 2024 or 2023 — 2025",
    }),
    defineField({
      name: "medium",
      title: "Medium",
      type: "string",
      description:
        "Comma-separated list, e.g. 'Paper, textile, ink, xerography'",
    }),
    defineField({
      name: "dimensions",
      title: "Dimensions",
      type: "string",
      description: "Optional, e.g. '200 × 125 cm, 22 pieces'",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "Optional, e.g. 'Düsseldorf, Germany'",
    }),
    defineField({
      name: "kinds",
      title: "Filter tags",
      type: "array",
      of: [
        {
          type: "string",
          options: {
            list: [
              "Print",
              "Painting",
              "Ceramic",
              "Sculpture",
              "Photography",
              "Textile",
              "Book",
            ],
          },
        },
      ],
      description: "Used by the /projects filter chips.",
      options: { layout: "tags" },
    }),
    defineField({
      name: "hero",
      title: "Hero image",
      type: "imageWithAlt",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "portableText",
      description:
        "First paragraph becomes the italic stand-first; rest is body. Pull-quote blocks render as oversized italic.",
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "imageWithAlt" }],
      description: "Supporting images shown beneath the description.",
      options: { layout: "grid" },
    }),
  ],
  orderings: [
    {
      title: "Year (newest first)",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
    {
      title: "Title (A–Z)",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      year: "year",
      medium: "medium",
      media: "hero",
    },
    prepare({ title, year, medium, media }) {
      const subtitle = [year, medium].filter(Boolean).join(" · ");
      return { title, subtitle, media };
    },
  },
});
