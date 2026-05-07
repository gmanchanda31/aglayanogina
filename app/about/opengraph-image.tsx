import { OG_CONTENT_TYPE, OG_SIZE, landingOG } from "@/lib/og";
import { getProject } from "@/lib/content";

export const alt = "About — Aglaya Nogina";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const portrait = getProject("archipelago")?.images[2]?.src;
  return landingOG({
    eyebrow: "About",
    title: "Aglaya Nogina",
    lede: "Born in Luhansk, 1996. Lives in Düsseldorf. Studies at the Kunstakademie.",
    imagePath: portrait,
  });
}
