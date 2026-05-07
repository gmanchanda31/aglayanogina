import { createClient } from "@sanity/client";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

const PROJECT_ID = process.env.SANITY_PROJECT_ID || "w6axlzhx";
const DATASET = process.env.SANITY_DATASET || "production";

/**
 * Read-only client used at build time to populate static pages.
 * - useCdn: true — served from Sanity's CDN, fine for public reads.
 * - perspective: published — drafts never leak into the build.
 * No token needed for reads on a public dataset.
 */
export const sanityClient = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2025-01-01",
  useCdn: true,
  perspective: "published",
});

const builder = createImageUrlBuilder(sanityClient);

/**
 * Resolve a Sanity image reference to a CDN URL.
 * Pass `width` to get a sized variant (Sanity does the resize on the fly).
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Sanity image asset _ref encodes intrinsic dimensions in its id, e.g.
 *   image-1234abcd-1200x1600-jpg
 * Parse them out so <Image> can ship correct width/height attrs.
 */
export function dimensionsFromRef(ref: string): { width: number; height: number } {
  const match = ref.match(/-(\d+)x(\d+)-/);
  if (!match) return { width: 1200, height: 1200 };
  return { width: parseInt(match[1], 10), height: parseInt(match[2], 10) };
}
