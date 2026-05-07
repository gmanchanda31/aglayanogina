import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || "w6axlzhx",
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  /**
   * `pnpm sanity deploy` will publish the studio to <projectName>.sanity.studio
   * by default. We can pin it to a custom subdomain later via:
   *   studioHost: "aglayanogina"
   * which gives us https://aglayanogina.sanity.studio
   */
});
