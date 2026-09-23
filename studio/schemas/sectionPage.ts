import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

/**
 * The intro block at the top of a listing page — the eyebrow line, the page
 * title, and the italic stand-first underneath.
 *
 * One document per section, with a fixed id (`sectionPage-projects`, …) so
 * the site can look each one up without a slug. Seeded by
 * scripts/seed-section-pages.mjs; the Studio hides "Create new" for this
 * type so there can never be a second copy of a section's intro.
 */

export const SECTION_OPTIONS = [
  { title: "Projects", value: "projects" },
  { title: "Exhibitions", value: "exhibitions" },
  { title: "Illustration series", value: "illustrations" },
  { title: "Photograph archives", value: "photographs" },
  { title: "Writings", value: "writings" },
] as const;

export const sectionPage = defineType({
  name: "sectionPage",
  title: "Page intro",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "section",
      title: "Section",
      type: "string",
      description:
        "Which listing page this intro sits on. Fixed when the document was created.",
      options: { list: [...SECTION_OPTIONS], layout: "radio" },
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "eyebrow",
      title: "Small line above the title",
      type: "string",
      description:
        'Set in small caps, e.g. "8 works · 2021 — 2025". Leave empty to let the site count the works for you.',
      validation: (rule) => rule.max(80).warning("Keep it to a short line."),
    }),
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro paragraph",
      type: "text",
      rows: 3,
      description:
        "The italic sentence under the title. One or two sentences reads best.",
      validation: (rule) =>
        rule.max(320).warning("Long intros crowd the works below."),
    }),
    defineField({
      name: "metaDescription",
      title: "Search-engine description",
      type: "text",
      rows: 2,
      description:
        "Shown in Google results and link previews. Falls back to the intro paragraph if left empty.",
      validation: (rule) =>
        rule.max(200).warning("Google trims descriptions past ~160 characters."),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "intro" },
  },
});
