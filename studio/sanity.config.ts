import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { deskStructure } from "./desk/structure";

/**
 * Sanity Studio for Aglaya Nogina's portfolio.
 *
 * Project setup steps live in studio/README.md.
 * Once `SANITY_PROJECT_ID` is known, drop it in below.
 */
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
  },
});
