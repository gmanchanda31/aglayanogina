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
      title: "Hero italic line",
      type: "text",
      rows: 2,
      description:
        "Single italic line under AGLAYA NOGINA. Lifted from her own words. Keep ≤ 18 words.",
    }),
    defineField({
      name: "heroTagline",
      title: "Hero tagline",
      type: "text",
      rows: 2,
      description: "Small label-caps tagline beneath the italic line.",
    }),
    defineField({
      name: "featuredProject",
      title: "Featured project (Currently on view)",
      type: "reference",
      to: [{ type: "project" }],
      description:
        "The project shown in the cinematic 21:9 banner. Pick the most current.",
    }),
    defineField({
      name: "featuredTeaser",
      title: "Featured project teaser",
      type: "string",
      description:
        "One italic line beneath the title in the featured section. Keep ≤ 80 chars.",
      validation: (r) => r.max(100),
    }),
    defineField({
      name: "featuredExhibitionLine",
      title: "Featured project — exhibition line",
      type: "string",
      description:
        "Optional, e.g. 'KUT Gallery, Kyiv · October 2025'. Shown in the metadata stack.",
    }),
    defineField({
      name: "selectedWorks",
      title: "Selected works (the asymmetric grid)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }] }],
      validation: (r) => r.min(2).max(8),
      description: "4 projects render at the canonical layout. 2 or 6 also work.",
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
      validation: (r) => r.length(2),
      description: "Pick exactly two essays.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Homepage" }),
  },
});
