import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { deskStructure } from "./desk/structure";

/**
 * Sanity Studio for Aglaya Nogina's portfolio.
 * Setup steps live in studio/README.md.
 */

/**
 * Document types that are singletons — one fixed document per id, never
 * created from the Studio. `sectionPage` is five of them (one per listing
 * page), seeded by scripts/seed-section-pages.mjs.
 */
const SINGLETONS = ["artist", "homePicks", "sectionPage"] as const;

export default defineConfig({
  name: "aglaya-nogina",
  title: "Aglaya Nogina — Studio",

  // Project IDs are public — they ship in client bundles. Safe to commit.
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "w6axlzhx",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",

  plugins: [
    structureTool({ structure: deskStructure }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // Strip "Create new" / "Duplicate" / "Delete" from the singletons so
    // Aglaya can't accidentally create a second Homepage, Artist, or
    // page-intro document.
    templates: (templates) =>
      templates.filter(
        (t) => !SINGLETONS.includes(t.schemaType as (typeof SINGLETONS)[number]),
      ),
  },

  document: {
    actions: (input, context) =>
      SINGLETONS.includes(context.schemaType as (typeof SINGLETONS)[number])
        ? input.filter(
            ({ action }) =>
              action !== "duplicate" &&
              action !== "delete" &&
              action !== "unpublish",
          )
        : input,
  },
});
