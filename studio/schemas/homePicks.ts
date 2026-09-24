import { defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";

/**
 * Singleton — drives what the homepage features.
 * Replaces the hard-coded picks in lib/home.ts.
 */
export const homePicks = defineType({
  name: "homePicks",
  title: "Homepage",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "heroItalic",
      title: "Closing line",
      type: "text",
      rows: 2,
      description:
        "First line under the list of works at the foot of the homepage, e.g. 'Interdisciplinary artist'. Keep it short.",
    }),
    defineField({
      name: "heroTagline",
      title: "Closing line — second line",
      type: "text",
      rows: 2,
      description: "Quieter line beneath the closing line, e.g. 'Working across images, objects, text and space'.",
    }),
    defineField({
      name: "featuredProject",
      title: "Work on the homepage",
      type: "reference",
      to: [{ type: "project" }],
      description:
        "The one work the homepage opens on, shown large at its own proportions. Leave empty to show the most recent project.",
    }),
    defineField({
      name: "featuredTeaser",
      title: "Featured project teaser",
      type: "string",
      hidden: true,
      description: "No longer shown on the homepage. Kept so nothing is lost.",
      validation: (r) => r.max(100),
    }),
    defineField({
      name: "featuredExhibitionLine",
      title: "Exhibition line (under the work)",
      type: "string",
      description:
        "Optional, e.g. 'KUT Gallery, Kyiv · October 2025'. Third line of the label under the homepage work.",
    }),
    defineField({
      name: "selectedWorks",
      title: "Selected works",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }] }],
      hidden: true,
      description: "No longer shown — the homepage lists every project, newest first. Kept so nothing is lost.",
    }),
    defineField({
      name: "journalPicks",
      title: "Journal pair (essays on home)",
      type: "array",
      of: [
        {
          type: "object",
          name: "journalPick",
          fields: [
            {
              name: "writing",
              type: "reference",
              to: [{ type: "writing" }],
              validation: (r) => r.required(),
            },
            {
              name: "teaser",
              type: "string",
              description: "One-sentence italic teaser. Keep ≤ 110 chars.",
              validation: (r) => r.max(150),
            },
          ],
          preview: {
            select: {
              title: "writing.title",
              subtitle: "teaser",
            },
          },
        },
      ],
      hidden: true,
      description: "No longer shown on the homepage. Kept so nothing is lost.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Homepage" }),
  },
});
