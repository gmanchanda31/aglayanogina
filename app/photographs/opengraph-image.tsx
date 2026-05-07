import { OG_CONTENT_TYPE, OG_SIZE, landingOG } from "@/lib/og";
import { getPhotographSet } from "@/lib/content";

export const alt = "Photographs — Aglaya Nogina";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const featured = getPhotographSet("colour")?.hero?.src;
  return landingOG({
    eyebrow: "Film & digital archive",
    title: "Photographs",
    lede:
      "Places lived in, places visited, faces returned to. Made between Kyiv, Berlin, Istanbul, Goa, and Düsseldorf.",
    imagePath: featured,
  });
}
