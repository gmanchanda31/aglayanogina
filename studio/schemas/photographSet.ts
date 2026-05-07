import { defineField, defineType } from "sanity";
import { ImagesIcon } from "@sanity/icons";

/**
 * A photograph archive (Colour, Black & White, India, Turkey).
 * Lives at /photographs/<slug>. Just a title + an ordered photo set.
 */
export const photographSet = defineType({
  name: "photographSet",
  title: "Photograph archive",
  type: "document",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.required(),
      description: "Display title — e.g. 'Black & White' or 'Colour'",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 40 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "blurb",
      title: "Short blurb",
      type: "text",
      rows: 3,
      description:
        "Optional one-paragraph context shown above the masonry on the archive page.",
    }),
    defineField({
      name: "images",
      title: "Photographs",
      type: "array",
      of: [{ type: "imageWithAlt" }],
      options: { layout: "grid" },
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: {
      title: "title",
      images: "images",
    },
    prepare({ title, images }) {
      const count = Array.isArray(images) ? images.length : 0;
      return {
        title,
        subtitle: `${count} photograph${count === 1 ? "" : "s"}`,
        media: images?.[0],
      };
    },
  },
});
