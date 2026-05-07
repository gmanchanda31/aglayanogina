import { OG_CONTENT_TYPE, OG_SIZE, landingOG } from "@/lib/og";

export const alt = "Writings — Aglaya Nogina";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return landingOG({
    eyebrow: "11 essays",
    title: "Writings",
    lede:
      "Lyrical essays and short prose — sometimes companions to the visual work, sometimes their own quiet thing.",
  });
}
