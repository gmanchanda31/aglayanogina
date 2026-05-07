import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || "w6axlzhx",
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  /**
   * `pnpm sanity deploy` publishes the studio to:
   *   https://aglayanogina.sanity.studio
   * Auth is by SANITY_AUTH_TOKEN env var (we use the write token).
   */
  studioHost: "aglayanogina",
});
