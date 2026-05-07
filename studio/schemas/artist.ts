import { defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons";

/**
 * Singleton — there's exactly one artist (Aglaya). Drives /about.
 */
export const artist = defineType({
  name: "artist",
  title: "Artist",
  type: "document",
  icon: UserIcon,
  // Sanity treats this as a singleton via the desk structure (see desk/structure.ts).
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      initialValue: "Aglaya Nogina",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description:
        "Short label-caps line on the home hero, e.g. 'Visual artist · Luhansk → Kyiv → Düsseldorf · b. 1996'",
    }),
    defineField({
      name: "intro",
      title: "Intro paragraph",
      type: "text",
      rows: 3,
      description: "First paragraph on the About page — italic stand-first.",
    }),
    defineField({
      name: "paragraphs",
      title: "Bio paragraphs",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      description: "Long-form bio body, in order.",
    }),
    defineField({
      name: "portrait",
      title: "Studio portrait",
      type: "imageWithAlt",
      description: "Used on the home hero and About page.",
    }),

    // CV — four titled lists
    defineField({
      name: "education",
      title: "Education",
      type: "array",
      of: [{ type: "cvRow" }],
    }),
    defineField({
      name: "publications",
      title: "Publications",
      type: "array",
      of: [{ type: "cvRow" }],
    }),
    defineField({
      name: "soloExhibitions",
      title: "Solo Exhibitions",
      type: "array",
      of: [{ type: "cvRow" }],
    }),
    defineField({
      name: "selectedExhibitions",
      title: "Selected Exhibitions",
      type: "array",
      of: [{ type: "cvRow" }],
    }),

    // Contact — surfaced in footer
    defineField({
      name: "city",
      title: "City",
      type: "string",
      initialValue: "Düsseldorf, Germany",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "email",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "whatsappUrl",
      title: "WhatsApp URL",
      type: "url",
      description: "wa.me link, e.g. https://wa.me/491756252702",
    }),
    defineField({
      name: "patreonUrl",
      title: "Patreon URL",
      type: "url",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Artist · Aglaya Nogina" }),
  },
});
