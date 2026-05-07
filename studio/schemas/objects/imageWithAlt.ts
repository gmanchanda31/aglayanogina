import { defineField, defineType } from "sanity";

/**
 * Image + alt text + optional caption. Used inside galleries on every
 * project / exhibition / illustration / photograph set.
 */
export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description:
        "Brief description of the image for screen readers and search engines.",
      validation: (rule) =>
        rule.required().max(180).warning("Keep alt text under 180 characters."),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional — shows beneath the image.",
    }),
  ],
});
