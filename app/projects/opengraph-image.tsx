import { OG_CONTENT_TYPE, OG_SIZE, landingOG } from "@/lib/og";
import { getProject } from "@/lib/content";

export const alt = "Projects — Aglaya Nogina";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const featured = getProject("archipelago")?.hero?.src;
  return landingOG({
    eyebrow: "8 works · 2021 — 2025",
    title: "Projects",
    lede:
      "Selected works in xerography, relief printing, painting, and ceramic — exploring memory and friendship.",
    imagePath: featured,
  });
}
