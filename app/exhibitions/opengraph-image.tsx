import { OG_CONTENT_TYPE, OG_SIZE, landingOG } from "@/lib/og";
import { getExhibition } from "@/lib/content";

export const alt = "Exhibitions — Aglaya Nogina";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const featured = getExhibition("lost-beauty")?.hero?.src;
  return landingOG({
    eyebrow: "Solo & group · 2021 — 2025",
    title: "Exhibitions",
    lede:
      "Düsseldorf, Berlin, Kyiv, Lviv, the Carpathians, and the West Coast of the United States.",
    imagePath: featured,
  });
}
