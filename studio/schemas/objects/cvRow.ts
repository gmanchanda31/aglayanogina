import { defineField, defineType } from "sanity";

/**
 * One row of the CV: a date/range and a one-line entry.
 * Used by Education, Publications, Solo Exhibitions, Selected Exhibitions.
 */
export const cvRow = defineType({
  name: "cvRow",
  title: "CV row",
  type: "object",
  fields: [
    defineField({
      name: "year",
      title: "Year / range",
      type: "string",
      description: "e.g. 2024, October — or 2018 – 2022",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "detail",
      title: "Entry",
      type: "string",
      description:
        'e.g. "Lost beauty", curated by Daria Zhuravel · KUT Gallery, Kyiv',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "year", subtitle: "detail" },
  },
});
