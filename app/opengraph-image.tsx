import { home } from "@/lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, landingOG } from "@/lib/og";

export const alt = "Aglaya Nogina — Visual Artist";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return landingOG({
    eyebrow: "Visual artist · Düsseldorf",
    title: "Aglaya Nogina",
    lede:
      "Xerography, relief printing, painting, photography, and writing — exploring memory, displacement, and friendship.",
    imagePath: home.hero?.src,
  });
}
