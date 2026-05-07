import { OG_CONTENT_TYPE, OG_SIZE, landingOG } from "@/lib/og";
import { getIllustration } from "@/lib/content";

export const alt = "Illustrations — Aglaya Nogina";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const featured = getIllustration("the-eustomes")?.hero?.src;
  return landingOG({
    eyebrow: "5 series",
    title: "Illustrations",
    lede:
      "Pen-and-ink series and album covers — Schmalgauzen, The Eustomes, The Winter Sea — patterned, intricate, quiet.",
    imagePath: featured,
  });
}
